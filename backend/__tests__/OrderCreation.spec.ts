const request = require('supertest');
const app = require('../src/app');
const fs = require('fs');

jest.setTimeout(30000);

// Json file to simulate database
/*
let json_orders = fs.readFileSync('src/database/test.json', 'utf-8');
let orders = JSON.parse(json_orders); */

beforeEach( () => {
    let orders = [];
    let users = [];
    const json_orders = JSON.stringify(orders);
    fs.writeFileSync('src/database/test.json', json_orders, 'utf-8');
    const json_users = JSON.stringify(users);
    fs.writeFileSync('src/database/usersTest.json', json_users, 'utf-8');
});

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

const user = {
    username: 'usertest',
    email: 'user@test.com',
    password: '12345678'
}

// .set('Authorization', `Bearer ${token}`);
const postOrder = async (body) => {

    let agent = request(app);

    await agent.post('/api/1.0/users/register').send({ ...user});
    const userResponse =  await agent.post('/api/1.0/users/login').send({ email: user.email, password: user.password });
    const token = userResponse.body.token;

    agent = request(app).post('/api/1.0/orders');
    if (token) {
        agent.set('Authorization', `Bearer ${token}`);
    }

    return agent.send({ user_id: userResponse.body.user.id, ...body});
}

const getOrders = async () => {

    let agent = request(app);

    //await agent.post('/api/1.0/users/register').send({ ...user});
    const userResponse =  await agent.post('/api/1.0/users/login').send({ email: user.email, password: user.password });
    const token = userResponse.body.token;

    agent = request(app).get('/api/1.0/orders/' + userResponse.body.user.id);

    if (token) {
        agent.set('Authorization', `Bearer ${token}`);
    }

    return agent.send();
}

const getIndividualOrder= async (id) => {

    let agent = request(app);

    //await agent.post('/api/1.0/users/register').send({ ...user});
    const userResponse =  await agent.post('/api/1.0/users/login').send({ email: user.email, password: user.password });
    const token = userResponse.body.token;

    agent = request(app).get('/api/1.0/orders/order/' + id);

    if (token) {
        agent.set('Authorization', `Bearer ${token}`);
    }

    return agent.send();
}

describe("Order creation", () => {
    it("returns 'Order created' when all fields in valid order are corrects", async () => {
        const response = await postOrder({...validOrder})
        expect(response.body.message).toBe('Order created');
        expect(response.status).toBe(201);
    });
    /*
    it("returns 'Today is not a bussiness day' when the now datetime is in the offDays array", async () => {
        const response = await request(app).post('/api/1.0/orders').send({ ...validOrder, creation_date: "2021-03-21"});
        expect(response.body.message).toBe('Today is not a bussiness day');
    });*/

    it("returns 'Order with that number already exists' when trying to create an order with an external order number repeated", async () => {
        await postOrder({...validOrder})
        const response = await postOrder({...validOrder})
        expect(response.body.message).toBe('Order with that number already exists');
    });

    it("returns 'Invalid Item Weight' when the items weight exceed the limit", async () => {
        const response = await postOrder({ ...validOrder, 
                external_order_number: "000009",
                line_items: [{
                    "product_name": "Xiami Redmi 19",
                    "product_qty": "12312312",
                    "product_weight": "120"
                }] 
        });
        expect(response.body.message).toBe('Invalid Item Weight');
    });

    it("returns 'Invalid Item Weight' when the items weight is under the limit", async () => {
        const response = await postOrder({ ...validOrder, 
                external_order_number: "000009",
                line_items: [{
                    "product_name": "Xiami Redmi 19",
                    "product_qty": "12312312",
                    "product_weight": "-10"
                }] 
        });

        expect(response.body.message).toBe('Invalid Item Weight');
    });
    
    it("returns 'Not available at this hour' when day type is ANY and not in the working hours", async () => {
        let currentHour = 15;
        const response = await postOrder({ ...validOrder,  external_order_number: "000009", currentHour });
        expect(response.body.message).toBe('Not available at this hour');
    });

    it("returns 'Not available at this hour' when day type is BUSINESS and not in the working hours", async () => {
        let currentHour = 15;
        const response = await postOrder({ ...validOrder,  
            external_order_number: "000009", 
            creation_date: "2021-03-19",
            currentHour 
        });
        expect(response.body.message).toBe('Not available at this hour');
    });

    it("returns 'NOT FOR NOW' when day type is NON-BUSINESS", async () => {
        let currentHour = 15;
        const response = await postOrder({ ...validOrder,  
            external_order_number: "000009", 
            creation_date: "2021-03-21",
            currentHour 
        });
        expect(response.body.message).toBe('NOT FOR NOW');
    });

});


