import { createServer, IncomingMessage, ServerResponse } from 'http';
import { handleUsersRoute } from './routes/userRoutes';

export const createApp = () => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Route requests
        if (req.url && req.url.startsWith('/api/users')) {
            await handleUsersRoute(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    });

    return server;
};