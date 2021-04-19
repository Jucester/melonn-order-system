import axios from 'axios';

const clientAxios = axios.create({
    baseURL: 'https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox/',
    headers: {'x-api-key': process.env.MELONN_API_KEY}
});

export default clientAxios;