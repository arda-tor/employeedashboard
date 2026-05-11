import axios from 'axios';
 

const api = axios.create({
    baseURL: 'http://employees-api.test/api'
})

export default api