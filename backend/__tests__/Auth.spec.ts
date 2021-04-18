const request = require('supertest');
const app = require('../src/app');
const fs = require('fs');

jest.setTimeout(30000);

beforeEach( () => {
    let orders = [];
    let users = [];
    const json_orders = JSON.stringify(orders);
    fs.writeFileSync('src/database/test.json', json_orders, 'utf-8');
    const json_users = JSON.stringify(users);
    fs.writeFileSync('src/database/usersTest.json', json_users, 'utf-8');
});

const addUser = async () => {
    const user = {
        username: 'user1',
        email: 'user@test.com',
        password: '12345678'
    }
    return await request(app).post('/api/1.0/users/register').send({ ...user});
}

const postAuthentication = async (credentials) => {
    return await request(app).post('/api/1.0/users/login').send(credentials);
}

describe('Authentication', () => {
    it('returns 200 when credentials are correct', async () => {
        await addUser();
        const res = await postAuthentication({email: 'user@test.com', password: '12345678' });
        expect(res.status).toBe(200);
    })

    it('returns only user id and email when login sucess', async () => {
        await addUser();
        const res = await postAuthentication({email: 'user@test.com', password: '12345678' });
        expect(Object.keys(res.body.user)).toEqual(['id', 'email'])
    })

    it('returns 401 when user does not exist', async () => {
        const res = await postAuthentication({email: 'user12@test.com', password: '12345678' });
        expect(res.status).toBe(401);
    })

    it('returns 401 when password is wrong', async () => {
        await addUser();
        const res = await postAuthentication({email: 'user@test.com', password: 'wrongpassword' });
        expect(res.status).toBe(401);
    })

    it('returns token in response when credentials are correct', async () => {
        await addUser();
        const res = await postAuthentication({email: 'user@test.com', password: '12345678' });
        expect(res.body.token).not.toBeUndefined();
    })

})