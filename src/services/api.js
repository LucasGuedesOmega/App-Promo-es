import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.15.20:5080'
});

export default api;