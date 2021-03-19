const request = require('supertest');
const app = require('../src/app');
const fs = require('fs');

jest.setTimeout(30000);

/*
let json_orders = fs.readFileSync('src/database/test.json', 'utf-8');
let orders = JSON.parse(json_orders); */

// Json file to simulate database
beforeEach( () => {
    let orders = [];
    const json_orders = JSON.stringify(orders);
    fs.writeFileSync('src/database/test.json', json_orders, 'utf-8');
})

const validOrder = {
    "seller_store": "Test Store",
    "shipping_method": "3",
    "external_order_number": "1234test",
    "buyer_full_name": "Mikhail Tester",
    "buyer_phone_number": "+58 3174562456",
    "buyer_email": "test@test.com",
    "shipping_address": "8 The Green, Suite A 19901",
    "shipping_city": "Dover",
    "shipping_region": "Delaware",
    "shipping_country": "Estados Unidos",
    "line_items": [{
        "product_name": "Xiami Redmi 20",
        "product_qty": "12312312",
        "product_weight": "15"
    },
    {
        "product_name": "PS4",
        "product_qty": "3232323",
        "product_weight": "1"
    }],
    "creation_date": "2021-03-17",
    "currentHour": 12
}


describe('Listing Sell Orders', () => {
    it("returns an array of orders", async () => {
        await request(app).post('/api/1.0/orders').send({ ...validOrder });
        const response = await request(app).get('/api/1.0/orders').send();
        console.log(response.body)
        expect(Array.isArray(response.body.orders)).toBe(true);
        expect(response.body.orders.length).toBeGreaterThan(0);
    });
});

describe('Get Sell Order Details', () => {
    it("returns status 200 when order is found", async () => {
        const res = await request(app).post('/api/1.0/orders').send({ ...validOrder });
        const id = res.body.order.id;
        const response = await request(app).get(`/api/1.0/orders/order/${id}`).send();
     
        expect(response.status).toBe(200);
    });

    it("returns status 404 when order not found", async () => {
        const response = await request(app).get('/api/1.0/orders/001234').send();
        expect(response.status).toBe(404);
    });

    it("returns correct order fields when order is found", async () => {
        const res = await request(app).post('/api/1.0/orders').send({ ...validOrder });
        const id = res.body.order.id;
        const response = await request(app).get(`/api/1.0/orders/order/${id}`).send();
        expect(Object.keys(response.body.order)).toEqual([
            "id",
            "seller_store",
            "shipping_method",
            "external_order_number",
            "buyer_full_name",
            "buyer_phone_number",
            "buyer_email",
            "shipping_address",
            "shipping_city",
            "shipping_region",
            "shipping_country",
            "line_items",
            "creation_date",
            "currentHour",
            "packPromiseMin",
            "packPromiseMax",
            "shipPromiseMin",
            "shipPromiseMax",
            "deliveryPromiseMin",
            "deliveryPromiseMax",
            "readyPickupPromiseMin",
            "readyPickupPromiseMax",
        ])
    });

});

