import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.1.30:5080'
});

export default api;