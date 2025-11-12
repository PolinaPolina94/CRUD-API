import { IncomingMessage, ServerResponse } from 'http';
import { getErrorMessage } from '../utils/validation';
import * as userController from '../controllers/userController';

export const handleUsersRoute = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const { method, url } = req;
    const urlParts = url?.split('/') || [];
    const userId = urlParts[3];

    try {
        // GET /api/users
        if (method === 'GET' && url === '/api/users') {
            const users = userController.getAllUsers();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
            return;
        }

        // GET /api/users/{userId}
        if (method === 'GET' && userId) {
            const validation = userController.validateUserId(userId);
            if (!validation.isValid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: validation.message }));
                return;
            }

            const user = userController.getUserById(userId);
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
            return;
        }

        // POST /api/users
        if (method === 'POST' && url === '/api/users') {
            let body;
            try {
                body = await parseRequestBody(req);
                console.log('Body received:', body);
            } catch (err) {
                console.error('Error parsing body:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }

            const validation = userController.validateUserData(body);
            console.log('Validation result:', validation);

            if (!validation.isValid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: validation.message }));
                return;
            }

            const newUser = userController.createUser(validation.userData!);
            console.log('New user created:', newUser);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
            return;
        }

        // PUT /api/users/{userId}
        if (method === 'PUT' && userId) {
            const idValidation = userController.validateUserId(userId);
            if (!idValidation.isValid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: idValidation.message }));
                return;
            }

            const body = await parseRequestBody(req);
            const dataValidation = userController.validateUserData(body);

            if (!dataValidation.isValid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: dataValidation.message }));
                return;
            }

            const updatedUser = userController.updateUser(userId, dataValidation.userData!);
            if (!updatedUser) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
            return;
        }

        // DELETE /api/users/{userId}
        if (method === 'DELETE' && userId) {
            const validation = userController.validateUserId(userId);
            if (!validation.isValid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: validation.message }));
                return;
            }

            const deleted = userController.deleteUser(userId);
            if (!deleted) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }

            res.writeHead(204);
            res.end();
            return;
        }

        // If no route matches
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));

    } catch (error) {
        console.error('Error handling request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
};

const parseRequestBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
};