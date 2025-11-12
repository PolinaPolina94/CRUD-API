import 'dotenv/config';
import { createApp } from './app';
import cluster from 'cluster';
import os from 'os';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

if (process.argv[2] === 'multi' && cluster.isPrimary) {
    // Cluster mode (horizontal scaling)
    const numCPUs = os.cpus().length - 1 || 1;

    console.log(`Primary ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);

    // Create workers
    for (let i = 0; i < numCPUs; i++) {
        const workerPort = PORT + i + 1;
        const worker = cluster.fork({ WORKER_PORT: workerPort, WORKER_ID: i + 1 });

        worker.on('message', (message) => {
            if (message.type === 'started') {
                console.log(`Worker ${message.workerId} started on port ${message.port}`);
            }
        });
    }

    // Load balancer server
    const balancer = createApp();

    let currentWorker = 1;
    const workers = Object.values(cluster.workers!);

    balancer.on('request', (req, res) => {
        const worker = workers[(currentWorker - 1) % workers.length];
        currentWorker = (currentWorker % workers.length) + 1;

        // In a real implementation, you would proxy the request to the worker
        // This is a simplified version for demonstration
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Request received by load balancer',
            note: 'In full implementation, request would be proxied to worker'
        }));
    });

    balancer.listen(PORT, () => {
        console.log(`Load balancer running on port ${PORT}`);
        console.log(`Workers running on ports ${PORT + 1} to ${PORT + numCPUs}`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

} else {
    // Single instance or worker
    const app = createApp();
    const workerPort = process.env.WORKER_PORT ? parseInt(process.env.WORKER_PORT) : PORT;
    const workerId = process.env.WORKER_ID || 'single';

    app.listen(workerPort, () => {
        console.log(`Server (Worker ${workerId}) running on port ${workerPort}`);

        if (process.send) {
            process.send({
                type: 'started',
                workerId,
                port: workerPort
            });
        }
    });
}