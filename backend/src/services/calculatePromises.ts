import getNextBusinessDays from '../utils/getNextBusinessDays';
import moment from 'moment';

export const calculateMinPromise = async (casePromise : any ) => {

    const nextBusinessDays = await getNextBusinessDays();

    let minType = casePromise.min.type;
    let minDeltaHours =  casePromise.min.deltaHours;
    let minDeltaBusinessDay =  casePromise.min.deltaBusinessDays;
    let minTimeOfDay = casePromise.min.timeOfDay;

    // returning values
    let promiseMin;
 
    if (minType == null || minType == "NULL") {
        promiseMin = null;
    } else if (minType == 'DELTA-HOURS') {
        promiseMin = moment().add(minDeltaHours, 'hours').format("MMM D h:mm a");
    } else if (minType == 'DELTA-BUSINESSDAYS') {
        if (minDeltaBusinessDay > 0) {
            minDeltaBusinessDay -= 1
        }
        promiseMin = nextBusinessDays[minDeltaBusinessDay] + " at " + moment.utc(minTimeOfDay*3600*1000).format('HH:mm a');
    } 

    return promiseMin;
}

export const calculateMaxPromise = async (casePromise : any) => {

    const nextBusinessDays = await getNextBusinessDays();

    let maxType = casePromise.max.type;
    let maxDeltaHours =  casePromise.max.deltaHours;
    let maxDeltaBusinessDay =  casePromise.max.deltaBusinessDays;
    let maxTimeOfDay = casePromise.max.timeOfDay;

    let promiseMax;

    if (maxType == null || maxType == "NULL") {
        promiseMax = null;
    } else if (maxType == 'DELTA-HOURS') {
        //promiseMax = new Date().getHours() + maxDeltaHours;
        promiseMax = moment().add(maxDeltaHours, 'hours').format("MMM D h:mm a");
    } else if (maxType == 'DELTA-BUSINESSDAYS') {
        if (maxDeltaBusinessDay > 0) {
            maxDeltaBusinessDay -= 1
        }
        promiseMax = nextBusinessDays[maxDeltaBusinessDay] + " at " + moment.utc(maxTimeOfDay*3600*1000).format('HH:mm a');
    }  
 
    return promiseMax;
}



/*

        // Getting pack promise params from working cases
        let packMinType = workingCase.packPromise.min.type;
        let packMinDeltaHours =  workingCase.packPromise.min.deltaHours;
        let packMinDeltaBusinessDay =  workingCase.packPromise.min.deltaBusinessDays;
        let packMinTimeOfDay = workingCase.packPromise.min.timeOfDay;

        let packMaxType = workingCase.packPromise.max.type;
        let packMaxDeltaHours =  workingCase.packPromise.max.deltaHours;
        let packMaxDeltaBusinessDay =  workingCase.packPromise.max.deltaBusinessDays;
        let packMaxTimeOfDay = workingCase.packPromise.max.timeOfDay;


        if (!packMinType) {
            packPromiseObject.packPromiseMin = null;
        } else if (packMinType == 'DELTA-HOURS') {
            packPromiseObject.packPromiseMin = new Date().getHours() + packMinDeltaHours;
        } else if (packMinType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.packPromiseMin = nextBusinessDays[packMinDeltaBusinessDay - 1] + " at " + packMinTimeOfDay;
        } 

        if (!packMaxType) {
            packPromiseObject.packPromiseMax = null;
        } else if (packMaxType == 'DELTA-HOURS') {
            packPromiseObject.packPromiseMax = new Date().getHours() + packMaxDeltaHours;
        } else if (packMaxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.packPromiseMax = nextBusinessDays[packMaxDeltaBusinessDay - 1] + packMaxTimeOfDay;
        } 

        // Getting ship promise params from working cases
        let shipMinType = workingCase.shipPromise.min.type;
        let shipMinDeltaHours =  workingCase.shipPromise.min.deltaHours;
        let shipMinDeltaBusinessDay =  workingCase.shipPromise.min.deltaBusinessDays;
        let shipMinTimeOfDay = workingCase.shipPromise.min.timeOfDay;

        let shipMaxType = workingCase.shipPromise.max.type;
        let shipMaxDeltaHours =  workingCase.shipPromise.max.deltaHours;
        let shipMaxDeltaBusinessDay =  workingCase.shipPromise.max.deltaBusinessDays;
        let shipMaxTimeOfDay = workingCase.shipPromise.max.timeOfDay;

        if (!shipMinType) {
            packPromiseObject.shipPromiseMin = null;
        } else if (shipMinType == 'DELTA-HOURS') {
            packPromiseObject.shipPromiseMin = new Date().getHours() + shipMinDeltaHours;
        } else if (shipMinType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.shipPromiseMin = nextBusinessDays[shipMinDeltaBusinessDay - 1] + shipMinTimeOfDay;
        } 

        if (!shipMaxType) {
            packPromiseObject.shipPromiseMax = null;
        } else if (shipMaxType == 'DELTA-HOURS') {
            packPromiseObject.shipPromiseMax = new Date().getHours() + shipMaxDeltaHours;
        } else if (shipMaxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.shipPromiseMax = nextBusinessDays[shipMaxDeltaBusinessDay - 1] + shipMaxTimeOfDay;
        } 


        // Getting Delivery promise params from working cases
        let deliveryMinType = workingCase.deliveryPromise.min.type;
        let deliveryMinDeltaHours =  workingCase.deliveryPromise.min.deltaHours;
        let deliveryMinDeltaBusinessDay =  workingCase.deliveryPromise.min.deltaBusinessDays;
        let deliveryMinTimeOfDay = workingCase.deliveryPromise.min.timeOfDay;

        let deliveryMaxType = workingCase.deliveryPromise.max.type;
        let deliveryMaxDeltaHours =  workingCase.deliveryPromise.max.deltaHours;
        let deliveryMaxDeltaBusinessDay =  workingCase.deliveryPromise.max.deltaBusinessDays;
        let deliveryMaxTimeOfDay = workingCase.deliveryPromise.max.timeOfDay;

        if (!deliveryMinType) {
            packPromiseObject.deliveryPromiseMin = null;
        } else if (deliveryMinType == 'DELTA-HOURS') {
            packPromiseObject.deliveryPromiseMin = new Date().getHours() + deliveryMinDeltaHours;
        } else if (deliveryMinType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.deliveryPromiseMin = nextBusinessDays[deliveryMinDeltaBusinessDay - 1] + deliveryMinTimeOfDay;
        } 

        if (!deliveryMaxType) {
            packPromiseObject.deliveryPromiseMax = null;
        } else if (deliveryMaxType == 'DELTA-HOURS') {
            packPromiseObject.deliveryPromiseMax = new Date().getHours() + deliveryMaxDeltaHours;
        } else if (deliveryMaxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.deliveryPromiseMax = nextBusinessDays[deliveryMaxDeltaBusinessDay - 1] + deliveryMaxTimeOfDay;
        } 

   
        // Getting Delivery promise params from working cases
        let pickupMinType = workingCase.readyPickUpPromise.min.type;
        let pickupMinDeltaHours =  workingCase.readyPickUpPromise.min.deltaHours;
        let pickupMinDeltaBusinessDay =  workingCase.readyPickUpPromise.min.deltaBusinessDays;
        let pickupMinTimeOfDay = workingCase.readyPickUpPromise.min.timeOfDay;

        let pickupMaxType = workingCase.readyPickUpPromise.max.type;
        let pickupMaxDeltaHours =  workingCase.readyPickUpPromise.max.deltaHours;
        let pickupMaxDeltaBusinessDay =  workingCase.readyPickUpPromise.max.deltaBusinessDays;
        let pickupMaxTimeOfDay = workingCase.readyPickUpPromise.max.timeOfDay;

        if (!pickupMinType) {
            packPromiseObject.readyPickupPromiseMin = null;
        } else if (pickupMinType == 'DELTA-HOURS') {
            packPromiseObject.readyPickupPromiseMin = new Date().getHours() + pickupMinDeltaHours;
        } else if (pickupMinType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.readyPickupPromiseMin = nextBusinessDays[pickupMinDeltaBusinessDay - 1] + pickupMinTimeOfDay;
        } 

        if (!pickupMaxType) {
            packPromiseObject.readyPickupPromiseMax = null;
        } else if (pickupMaxType == 'DELTA-HOURS') {
            packPromiseObject.readyPickupPromiseMax = new Date().getHours() + pickupMaxDeltaHours;
        } else if (pickupMaxType == 'DELTA-BUSINESSDAYS') {
            packPromiseObject.readyPickupPromiseMax = nextBusinessDays[pickupMaxDeltaBusinessDay - 1] + pickupMaxTimeOfDay;
        } 
*/