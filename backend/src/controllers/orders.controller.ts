import { RequestHandler } from 'express';
import Order, { IOrder } from '../models/Order';
import moment from 'moment';
import clientAxios from '../config/axios';

// Utils functions
import checkBusinessDay from '../utils/checkBusinessDay';
import validateOrderWeight from '../utils/validateOrderWeight';
import { calculateMinPromise, calculateMaxPromise } from '../services/calculatePromises';

// Controller object that saves all our functions

// Path to the Json file to simulate database
//let dbPath = process.env.NODE_ENV == 'development' ? 'src/database/orders.json' : 'src/database/test.json';

//const packPromiseObject : {[k: string ] : any } = {};

export const getShippingMethods : RequestHandler = async (req, res) => {

    const response = await clientAxios.get(`/shipping-methods`);

    res.status(200).json({
        content: response.data
    })
};

export const getOrders : RequestHandler = async (req, res) => {
    
    const { userId } = req.params;
   
    let orders = await Order.find({ where: { userId } });
    

    res.status(200).json({
        message: 'Order List',
        orders
    });
}
/*
export const getOrder : RequestHandler = (req, res) => {

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
} */

export const createOrder : RequestHandler  = async (req, res) => {

    console.log(req.body);
    // Initialize "database"
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
    const shippingMethodId = Number.parseInt(req.body.shippingMethod);
    const response = await clientAxios.get(`/shipping-methods/${shippingMethodId}`);
    const rules = response.data.rules;

 
    
    try {
        // First checking if order is repeated based on his external order number
        const checkOrder = await Order.find({ where: { externalNumber: req.body.externalOrder }});

        console.log(checkOrder);
        if(checkOrder.length > 0) {
            return res.status(200).json({
                message: 'Order with that number already exists',
            });
        }

        // if not repeated, then validate the data
        //let newOrder = { id: "MSE-" + (Date.now() + Math.floor(Math.random() * 101) + 1).toString(), ... req.body, creation_date: creationDate };

        // 1. VALIDATE BASED ON WEIGHT AVAILABILITY: Calculating the weight and comparing with the rules
        let items = req.body.lineItems;
        const minWeight = rules.availability.byWeight.min;
        const maxWeight = rules.availability.byWeight.max;

        const weight = validateOrderWeight(items, minWeight, maxWeight);

        if (!weight) {
            return res.status(200).json({
                message: "Invalid Item Weight",
            });
        }

         console.log(1);
    
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


         console.log(2);
    
        // 3. DETERMINE WHICH CASE APPLIES: determine which case applies
        const cases = rules.promisesParameters.cases;
        let priority : number = 1;
        let workingCase : any = null;

         // looping through cases
        cases.forEach( (cas : any)  => {
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
        
        console.log(3);
    
        // 4. Calculate Promises
        // Saving the min cases
        const packPromiseMin = await calculateMinPromise(workingCase.packPromise);
        const shipPromiseMin = await calculateMinPromise(workingCase.shipPromise);  
        const deliveryPromiseMin = await calculateMinPromise(workingCase.deliveryPromise);
        const readyPickupPromiseMin = await calculateMinPromise(workingCase.readyPickUpPromise);

        // Saving the max cases
        const packPromiseMax = await calculateMaxPromise(workingCase.packPromise);
        const shipPromiseMax = await calculateMaxPromise(workingCase.shipPromise);
        const deliveryPromiseMax = await calculateMaxPromise(workingCase.deliveryPromise);
        const readyPickupPromiseMax = await calculateMaxPromise(workingCase.readyPickUpPromise);


   
        console.log(4);
    
        // saving the new order in a database
        let order : IOrder = new Order(req.body);
        await order.save();

        return res.status(201).json({
            message: 'Order created',
            order,
        });

    } catch (err) {
        console.log(err);
        res.status(502).json({
            message: 'Something went wrong',
        });
    }
}

/*
export const deleteOrder : RequestHandler = (req, res) => {

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

*/