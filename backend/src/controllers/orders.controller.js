const moment = require('moment');
const fs = require('fs');
const clientAxios = require('../configs/axios');
const checkBusinessDay = require('../utils/checkBusinessDay');
const validateOrderWeight = require('../utils/validateOrderWeight');

const controller = {};

// Json file to simulate database
const json_orders = fs.readFileSync('src/database.json', 'utf-8');
let orders = JSON.parse(json_orders);

controller.getOrders = (req, res) => {
   
    res.status(200).json({
        message: 'Order List',
        orders
    });
}

controller.createOrder = async (req, res) => {
    
    //let date = moment().format('YYYY-MM-DD, h:mm:ss a');
    let date = moment().format('YYYY-MM-DD');

    // Checking if date is a business day
    const checkDay = await checkBusinessDay(date);
    if (checkDay) {
        return res.status(200).json({
            message: "Today is not a bussiness day",
        });
    }

    // Retrieving the rules from the API
    const shippingMethodId = Number.parseInt(req.body.shipping_method);
    const response = await clientAxios.get(`/shipping-methods/${shippingMethodId}`);
    const rules = response.data.rules;
    
    try {
          
        // Checking is order is repited
        const checkOrder = orders.filter( order => order.external_order_number == req.body.external_order_number );

        if( checkOrder.length > 0 ) {
            return res.status(200).json({
                message: 'Order with that number already exists',
                date
            });
        }

        // if not repited, then add it to the "database"
        let newOrder = { ... req.body, date };
        //orders.push(newOrder);

        // Calculating the weight and comparing with the rules
        let items = newOrder.line_items;
        const minWeight = rules.availability.byWeight.min;
        const maxWeight = rules.availability.byWeight.max;

        const weight = validateOrderWeight(items, minWeight, maxWeight);

        if (!weight) {
            return res.status(200).json({
                message: "Invalid Item Weight",
            });
        }

    

        // saving the array in a file
        /*
        const json_orders = JSON.stringify(orders);
        fs.writeFileSync('src/database.json', json_orders, 'utf-8');*/

        return res.status(201).json({
            message: 'Order created',
            date
        });
    } catch (err) {
        res.status(502).json({
            message: 'Something went wrong',
            date
        });
    }
}

controller.getShippingMethods = async (req, res) => {

    const response = await clientAxios.get(`/shipping-methods`);

    res.status(200).json({
        content: response.data
    })
};

module.exports = controller;