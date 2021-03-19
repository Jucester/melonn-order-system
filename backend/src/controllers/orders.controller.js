const moment = require('moment');
const fs = require('fs');
const clientAxios = require('../configs/axios');

// Utils functions
const checkBusinessDay = require('../utils/checkBusinessDay');
const validateOrderWeight = require('../utils/validateOrderWeight');
const { calculateMinPromise, calculateMaxPromise } = require('../services/calculatePromises');

// Controller object that saves all our functions
const controller = {};

// Path to the Json file to simulate database
let dbPath = process.env.NODE_ENV == 'development' ? 'src/database/orders.json' : 'src/database/test.json';

const packPromiseObject = {
    "packPromiseMin": null,
    "packPromiseMax": null,
    "shipPromiseMin": null,
    "shipPromiseMax": null,
    "deliveryPromiseMin": null,
    "deliveryPromiseMax": null,
    "readyPickupPromiseMin": null,
    "readyPickupPromiseMax": null,
}

controller.getShippingMethods = async (req, res) => {

    const response = await clientAxios.get(`/shipping-methods`);

    res.status(200).json({
        content: response.data
    })
};

controller.getOrders = (req, res) => {
 
    const json_orders = fs.readFileSync(dbPath, 'utf-8');
    let orders = JSON.parse(json_orders);

    res.status(200).json({
        message: 'Order List',
        orders
    });
}

controller.getOrder = (req, res) => {

    const { id } = req.params;

    const json_orders = fs.readFileSync(dbPath, 'utf-8');
    let orders = JSON.parse(json_orders);

    const ordersFound = orders.filter(order => order.id == id);

    if( ordersFound.length == 0 ) {
        return res.status(404).json({
            message: 'Order not found',
        });
    }
    const order = ordersFound[0]

    return res.status(200).json({
        message: 'Order found',
        order
    });
}

controller.createOrder = async (req, res) => {

    // Initialize "database"
    const json_orders = fs.readFileSync(dbPath, 'utf-8');
    let orders = JSON.parse(json_orders);

    let creationDate = req.body.creation_date ? req.body.creation_date : moment().format('YYYY-MM-DD');

    // Checking if date is a business day
    const checkDay = await checkBusinessDay(creationDate);

    /*
    if (checkDay) {
        return res.status(200).json({
            message: "Today is not a bussiness day",
        });
    }*/

    // Retrieving the rules from the API
    const shippingMethodId = Number.parseInt(req.body.shipping_method);
    const response = await clientAxios.get(`/shipping-methods/${shippingMethodId}`);
    const rules = response.data.rules;
    
    try {
        // First checking if order is repeated based on his external order number
        const checkOrder = orders.filter( order => order.external_order_number === req.body.external_order_number );

        if( checkOrder.length > 0 ) {
            return res.status(200).json({
                message: 'Order with that number already exists',
            });
        }

        // if not repeated, then validate the data
        let newOrder = { id: (Date.now() + Math.floor(Math.random() * 101) + 1).toString(), ... req.body };

        // 1. VALIDATE BASED ON WEIGHT AVAILABILITY: Calculating the weight and comparing with the rules
        let items = newOrder.line_items;
        const minWeight = rules.availability.byWeight.min;
        const maxWeight = rules.availability.byWeight.max;

        const weight = validateOrderWeight(items, minWeight, maxWeight);

        if (!weight) {
            return res.status(200).json({
                message: "Invalid Item Weight",
            });
        }

        // 2. VALIDATE BASED ON REQUEST TIME AVAILABILITY: Checking day type and company hours available
        const dayType = rules.availability.byRequestTime.dayType;
        const fromTimeOfDay = rules.availability.byRequestTime.fromTimeOfDay;
        const toTimeOfDay = rules.availability.byRequestTime.toTimeOfDay;

        switch ( dayType ) {
            case 'ANY':
                let currentHour = req.body.currentHour ? req.body.currentHour : new Date().getHours();
                if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                    return res.status(200).json({
                        message: "Not available at this hour",
                    });
                }
                break;
            case 'BUSINESS':
                if (!checkDay) {
                    let currentHour = req.body.currentHour ? req.body.currentHour : new Date().getHours();
                    if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                        return res.status(200).json({
                            message: "Not available at this hour",
                        });
                    }
                } else {
                    return res.status(200).json({
                        message: "NOT FOR NOW",
                    });
                }
                break;
            default:
                break;
        }

        // 3. DETERMINE WHICH CASE APPLIES: determine which case applies
        const cases = rules.promisesParameters.cases;
        let priority = 1;
        let workingCase = null;

         // looping through cases
        cases.forEach( cas => {
            if (cas.priority == priority) {
                let dType = cas.condition.byRequestTime.dayType;
                let fTimeOfDay = cas.condition.byRequestTime.fromTimeOfDay;
                let tTimeOfDay = cas.condition.byRequestTime.toTimeOfDay;

                switch ( dType ) {
                    case 'ANY':
                        let currentHour = new Date().getHours();
                        if (currentHour <= fTimeOfDay || currentHour >= tTimeOfDay ) {
                            priority++
                        } else {
                            workingCase = cas;   
                        }
                        break;
                    case 'BUSINESS':
                        if (checkDay) {
                            priority++
                        } else {
                            let currentHour = new Date().getHours();
                    
                            if (currentHour <= fTimeOfDay || currentHour >= tTimeOfDay ) {
                                priority++
                            } else {
                                workingCase = cas;
                            }
                        }
                        break;
                    case 'NON-BUSINESS':
                    case 'WEEKEND':
                        return res.json({
                            message: "NOT FOR NOW",
                        });
                    default:
                        break;
                }
            }
        })
        
        // 4. Calculate Promises
        // Saving the min cases
        packPromiseObject.packPromiseMin = await calculateMinPromise(workingCase.packPromise);
        packPromiseObject.shipPromiseMin = await calculateMinPromise(workingCase.shipPromise);  
        packPromiseObject.deliveryPromiseMin = await calculateMinPromise(workingCase.deliveryPromise);
        packPromiseObject.readyPickupPromiseMin = await calculateMinPromise(workingCase.readyPickUpPromise);

        // Saving the max cases
        packPromiseObject.packPromiseMax = await calculateMaxPromise(workingCase.packPromise);
        packPromiseObject.shipPromiseMax = await calculateMaxPromise(workingCase.shipPromise);
        packPromiseObject.deliveryPromiseMax = await calculateMaxPromise(workingCase.deliveryPromise);
        packPromiseObject.readyPickupPromiseMax = await calculateMaxPromise(workingCase.readyPickUpPromise);


        let order = {
            ...newOrder, ...packPromiseObject
        }

        // saving the new order in a "database"
        orders.push(order);
        const json_orders = JSON.stringify(orders);
        fs.writeFileSync(dbPath, json_orders, 'utf-8');

        return res.status(201).json({
            message: 'Order created',
            order,
        });
    } catch (err) {
        res.status(502).json({
            message: 'Something went wrong',
        });
    }
}

controller.deleteOrder = (req, res) => {

    const json_orders = fs.readFileSync(dbPath, 'utf-8');
    let orders = JSON.parse(json_orders);
    
    filterOlders = orders.filter( order => order.id != req.params.id );

    if ( filterOlders.length == 0 ) {
        console.log(orders);
        return res.status(200).json({
            message: 'Error'
        });
    }

    json_orders = JSON.stringify(filterOlders);
    fs.writeFileSync(dbPath, json_orders, 'utf-8');

    return res.status(200).json({
        message: 'Order deleted'
    });
}

module.exports = controller;