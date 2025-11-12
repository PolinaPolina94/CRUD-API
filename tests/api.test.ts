import { createApp } from '../src/app';
import { Server } from 'http';

describe('CRUD API Integration Tests', () => {
    let server: Server;
    const PORT = 4001;
    const baseUrl = `http://localhost:${PORT}`;

    const makeRequest = async (url: string, options: any = {}) => {
        const response = await fetch(`${baseUrl}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        let data = null;
        const text = await response.text();
        if (text) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = text;
            }
        }

        return {
            status: response.status,
            data,
        };
    };

    beforeAll((done) => {
        server = createApp().listen(PORT, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    describe('Scenario 1: Basic CRUD operations', () => {
        let createdUserId: string;

        test('1. GET /api/users should return empty array initially', async () => {
            const { status, data } = await makeRequest('/api/users');
            expect(status).toBe(200);
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(0);
        });

        test('2. POST /api/users should create a new user', async () => {
            const userData = {
                username: 'John Doe',
                age: 30,
                hobbies: ['reading', 'swimming']
            };

            const { status, data } = await makeRequest('/api/users', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            expect(status).toBe(201);
            expect(data.username).toBe(userData.username);
            expect(data.age).toBe(userData.age);
            expect(data.hobbies).toEqual(userData.hobbies);
            expect(data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

            createdUserId = data.id;
        });

        test('3. GET /api/users/{userId} should return created user', async () => {
            const { status, data } = await makeRequest(`/api/users/${createdUserId}`);
            expect(status).toBe(200);
            expect(data.id).toBe(createdUserId);
            expect(data.username).toBe('John Doe');
        });

        test('4. PUT /api/users/{userId} should update the user', async () => {
            const updateData = {
                username: 'Jane Doe',
                age: 25,
                hobbies: ['painting']
            };

            const { status, data } = await makeRequest(`/api/users/${createdUserId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });

            expect(status).toBe(200);
            expect(data.username).toBe(updateData.username);
            expect(data.age).toBe(updateData.age);
            expect(data.hobbies).toEqual(updateData.hobbies);
            expect(data.id).toBe(createdUserId);
        });

        test('5. DELETE /api/users/{userId} should delete the user', async () => {
            const { status } = await makeRequest(`/api/users/${createdUserId}`, {
                method: 'DELETE',
            });
            expect(status).toBe(204);
        });

        test('6. GET /api/users/{userId} should return 404 after deletion', async () => {
            const { status } = await makeRequest(`/api/users/${createdUserId}`);
            expect(status).toBe(404);
        });
    });

    describe('Scenario 2: Error handling', () => {
        test('GET /api/users/{invalidId} should return 400 for invalid UUID', async () => {
            const { status, data } = await makeRequest('/api/users/invalid-id');
            expect(status).toBe(400);
            expect(data.error).toContain('Invalid user ID');
        });

        test('POST /api/users should return 400 for invalid data', async () => {
            const invalidData = {
                username: '', // empty username
                age: 0, // invalid age
                hobbies: [] // valid but other fields invalid
            };

            const { status, data } = await makeRequest('/api/users', {
                method: 'POST',
                body: JSON.stringify(invalidData),
            });

            expect(status).toBe(400);
            expect(data.error).toBeDefined();
        });
    });

    describe('Scenario 3: Non-existing endpoints and methods', () => {
        test('GET /non-existing should return 404', async () => {
            const { status, data } = await makeRequest('/non-existing');
            expect(status).toBe(404);
            expect(data.error).toBe('Endpoint not found');
        });

        test('GET /api/non-existing should return 404', async () => {
            const { status, data } = await makeRequest('/api/non-existing');
            expect(status).toBe(404);
            expect(data.error).toBe('Endpoint not found');
        });
    });
});