import axios from 'axios';

const clientAxios = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + '/api/1.0'
});

export default clientAxios;