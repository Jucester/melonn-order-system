import clientAxios from '../config/axios';

const checkBusinessDay = async (date : any ) => {
    
    let apiResponse = await clientAxios.get('/off-days');
    const offDays = apiResponse.data;

    return offDays.includes(date);
}

export default checkBusinessDay;