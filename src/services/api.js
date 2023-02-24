import axios from "axios";

const api = axios.create({
    baseURL: 'http://172.19.10.30:5080'
});

export default api;