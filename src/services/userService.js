import client from './client';

export async function isLoggedIn() {
    const response = await client.get('/user/isLoggedIn');
    return response.data.user;
}

export async function login(username, password) {
    const response = await client.post('/user/login', { username, password });
    return response.data.user;
}

export async function register(username, password) {
    const response = await client.post('/user/register', { username, password });
    return response.data.user;
}

export async function logout() {
    const response = await client.post('/user/logout');
    return response.data;
}
