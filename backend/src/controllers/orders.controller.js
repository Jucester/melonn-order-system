const database = require('../database.json');
const moment = require('moment');
const clientAxios = require('../configs/axios');
const controller = {};

controller.getOrders = (req, res) => {
    console.log(database);
    res.status(200).json({
        message: 'Order List',
        orders: database.orders
    });
}

controller.createOrder = async (req, res) => {

    console.log(req.body);
    //let date = moment().format('YYYY-MM-DD, h:mm:ss a');
    let date = moment().format('YYYY-MM-DD');

    const shipping_method = Number.parseInt(req.body.shipping_method);

    const response = await clientAxios.get(`/shipping-methods/${shipping_method}`);

    console.log(response.data);

    res.status(200).json({
        message: 'Order created',
        date
    });
}

controller.getShippingMethods = async (req, res) => {

    const response = await clientAxios.get(`/shipping-methods`);
    console.log(response.data);


    res.status(200).json({
        content: response.data
    })
};

module.exports = controller;