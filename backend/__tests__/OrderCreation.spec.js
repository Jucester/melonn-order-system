const request = require('supertest');
const app = require('../src/app');




describe("returns 'Today is not a bussiness day' when the now datetime is in the offDays array", () => {
    it("returns 'Today is not a bussiness day' when the now datetime is in the offDays array", async () => {
        const order = {
            
        }
        const response = await request(app).post('/api/1.0/orders').send();

        expect(response.message).toBe('Today is not a bussiness day');
    });


});



/*
describe('Get Sell Order Details', () => {
    
});
*/

