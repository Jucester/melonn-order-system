const request = require('supertest');
const app = require('../src/app');

describe('Listing Sell Orders', () => {
    it("returns an array of orders", async () => {
        const response = await request(app).get('/api/1.0/orders').send();

        expect(response.body.orders.length).toBeGreaterThan(1);
    });
});

/*
describe('Get Sell Order Details', () => {
    
});
*/

/*
describe('Get Sell Order Details', () => {
    
});
*/

