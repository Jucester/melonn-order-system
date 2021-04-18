const clientAxios = require('../configs/axios');

const checkBusinessDay = async (date) => {
    
    let apiResponse = await clientAxios.get('/off-days');
    const offDays = apiResponse.data;

    return offDays.includes(date);
}

module.exports = checkBusinessDay;