const moment = require('moment');
const fs = require('fs');
const clientAxios = require('../configs/axios');

// Utils functions
const checkBusinessDay = require('../utils/checkBusinessDay');
const getNextBusinessDays = require('../utils/getNextBusinessDays');
const validateOrderWeight = require('../utils/validateOrderWeight');

// Controller object that saves all our functions
const controller = {};

// Json file to simulate database
const json_orders = fs.readFileSync('src/database/orders.json', 'utf-8');
let orders = JSON.parse(json_orders);


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
    /*
    if (checkDay) {
        return res.status(200).json({
            message: "Today is not a bussiness day",
        });
    }*/

    const nextBusinessDays = await getNextBusinessDays();
  

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
        let newOrder = { id: 1, ... req.body, creation_date: date };
        //orders.push(newOrder);

        /*
            1. VALIDATE BASED ON WEIGHT AVAILABILITY
        */
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

        /*
            2. VALIDATE BASED ON REQUEST TIME AVAILABILITY
        */
        //  Checking day type and company hours active
        const dayType = rules.availability.byRequestTime.dayType;
        const fromTimeOfDay = rules.availability.byRequestTime.fromTimeOfDay;
        const toTimeOfDay = rules.availability.byRequestTime.toTimeOfDay;

        switch ( dayType ) {
            case 'ANY':
                let currentHour = new Date().getHours();
                if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                    return res.status(200).json({
                        message: "Not available at this hour",
                    });
                }
                break;
            case 'BUSINESS':
                if (!checkDay) {
                    //let currentHour = new Date().getHours();
                    let currentHour = 11;
                    if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                        return res.status(200).json({
                            message: "Not available at this hour",
                        });
                    }
                } else {
                    return res.status(200).json({
                        message: "NOT A BUSINESS DAY",
                    });
                }
                break;
            case 'NON-BUSINESS':
            case 'WEEKEND':
                return res.status(200).json({
                    message: "NOT FOR NOW",
                });
                break;
            default:
                break;
        }


        /*
            3. CALCULATE PROMISES
        */
        // determine which case applies
        const cases = rules.promisesParameters.cases;
        let priority = 0;
        let workingCase = null;

        while (workingCase == null) {
            //console.log(cases[priority].priority);
        
            if (cases[priority].priority) {
                
                let dType = cases[priority].condition.byRequestTime.dayType;
                let fTimeOfDay = cases[priority].condition.byRequestTime.fromTimeOfDay;
                let tTimeOfDay = cases[priority].condition.byRequestTime.toTimeOfDay;

                //console.log(dType);
                switch ( dType ) {
                    case 'ANY':
                        let currentHour = new Date().getHours();
                        if (currentHour <= fTimeOfDay || currentHour >= tTimeOfDay ) {
                            priority++
                        } else {
                            workingCase = cases[priority];
                            break
                        }
                    case 'BUSINESS':
                        if (checkDay) {
                            priority++
                        } else {
                            let currentHour = new Date().getHours();
                    
                            if (currentHour <= fTimeOfDay || currentHour >= tTimeOfDay ) {
                                priority++
                            } else {
                                workingCase = cases[priority];
                                break
                            }
                        }
                        break;
                    case 'NON-BUSINESS':
                    case 'WEEKEND':
                        return res.status(200).json({
                            message: "NOT FOR NOW",
                        });
                    default:
                        break;
                }
            }

        }

        //console.log('Working', workingCase);

        /*
            4. Calculate PACK promise
        */
        // Getting pack promise params from working cases
        let minType = workingCase.packPromise.min.type;
        let minDeltaHours =  workingCase.packPromise.min.deltaHours;
        let minDeltaBusinessDay =  workingCase.packPromise.min.deltaBusinessDays;
        let minTimeOfDay = workingCase.packPromise.min.timeOfDay;

        let maxType = workingCase.packPromise.max.type;
        let maxDeltaHours =  workingCase.packPromise.max.deltaHours;
        let maxDeltaBusinessDay =  workingCase.packPromise.max.deltaBusinessDays;
        let maxTimeOfDay = workingCase.packPromise.max.timeOfDay;

    
        if (!minType) {
            packPromiseObject.packPromiseMin = null;
        } else if (minType == 'DELTA-HOURS') {
            packPromiseObject.packPromiseMin = new Date().getHours() + minDeltaHours;
        } else if (minType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.packPromiseMin = nextBusinessDays[minDeltaBusinessDay - 1] + " " + minTimeOfDay;
        } 

        if (!maxType) {
            packPromiseObject.packPromiseMax = null;
        } else if (maxType == 'DELTA-HOURS') {
            packPromiseObject.packPromiseMax = new Date().getHours() + maxDeltaHours;
        } else if (maxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.packPromiseMax = nextBusinessDays[maxDeltaBusinessDay - 1] + maxTimeOfDay;
        } 

        /*
            5. Calculate SHIP promise
        */
        // Getting ship promise params from working cases
        let shipMinType = workingCase.shipPromise.min.type;
        let shipMaxType = workingCase.shipPromise.max.type;

        if (!shipMinType) {
            packPromiseObject.shipPromiseMin = null;
        } else if (minType == 'DELTA-HOURS') {
            packPromiseObject.shipPromiseMin = new Date().getHours() + minDeltaHours;
        } else if (minType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.shipPromiseMin = nextBusinessDays[minDeltaBusinessDay - 1] + minTimeOfDay;
        } 

        if (!shipMaxType) {
            packPromiseObject.shipPromiseMax = null;
        } else if (maxType == 'DELTA-HOURS') {
            packPromiseObject.shipPromiseMax = new Date().getHours() + maxDeltaHours;
        } else if (maxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.shipPromiseMax = nextBusinessDays[maxDeltaBusinessDay - 1] + maxTimeOfDay;
        } 

        /*
            6. Calculate Delivery promise
        */
        // Getting Delivery promise params from working cases
        let delvieryMinType = workingCase.deliveryPromise.min.type;
        let deliveryMaxType = workingCase.deliveryPromise.max.type;

        if (!delvieryMinType) {
            packPromiseObject.deliveryPromiseMin = null;
        } else if (minType == 'DELTA-HOURS') {
            packPromiseObject.deliveryPromiseMin = new Date().getHours() + minDeltaHours;
        } else if (minType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.deliveryPromiseMin = nextBusinessDays[minDeltaBusinessDay - 1] + minTimeOfDay;
        } 

        if (!deliveryMaxType) {
            packPromiseObject.deliveryPromiseMax = null;
        } else if (maxType == 'DELTA-HOURS') {
            packPromiseObject.deliveryPromiseMax = new Date().getHours() + maxDeltaHours;
        } else if (maxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.deliveryPromiseMax = nextBusinessDays[maxDeltaBusinessDay - 1] + maxTimeOfDay;
        } 


        /*
            7. Calculate Ready Pick promise
        */
        // Getting Delivery promise params from working cases
        let pickupMinType = workingCase.readyPickUpPromise.min.type;
        let pickupMaxType = workingCase.readyPickUpPromise.max.type;

        if (!pickupMinType) {
            packPromiseObject.readyPickupPromiseMin = null;
        } else if (minType == 'DELTA-HOURS') {
            packPromiseObject.readyPickupPromiseMin = new Date().getHours() + minDeltaHours;
        } else if (minType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.readyPickupPromiseMin = nextBusinessDays[minDeltaBusinessDay - 1] + minTimeOfDay;
        } 

        if (!pickupMaxType) {
            packPromiseObject.readyPickupPromiseMax = null;
        } else if (maxType == 'DELTA-HOURS') {
            packPromiseObject.readyPickupPromiseMax = new Date().getHours() + maxDeltaHours;
        } else if (maxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.readyPickupPromiseMax = nextBusinessDays[maxDeltaBusinessDay - 1] + maxTimeOfDay;
        } 

        //console.log(packPromiseObject);

        let order = {
            ...newOrder, ...packPromiseObject
        }
        // saving the array in a file
        
        orders.push(order);
        const json_orders = JSON.stringify(orders);
        fs.writeFileSync('src/database/orders.json', json_orders, 'utf-8');

        return res.status(201).json({
            message: 'Order created',
            order,
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