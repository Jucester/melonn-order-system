import moment from 'moment';
import clientAxios from '../config/axios';


const getNextBusinessDays = async () => {
    
    let today = moment().format('YYYY-MM-DD');
    let nextBusinessDays = [];

    let apiResponse = await clientAxios.get('/off-days');
    const offDays = apiResponse.data;

    let count = 1;
    while (nextBusinessDays.length < 10) {
        let day = moment(today).add(count, 'days').format('YYYY-MM-DD');

        if (!offDays.includes(day)) {
            day = moment(today).add(count, 'days').format("MMM D");
            nextBusinessDays.push(day)
        }
        count++;
    }

    return nextBusinessDays;
}

export default getNextBusinessDays;