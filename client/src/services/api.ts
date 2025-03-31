import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001'
  // baseURL: 'https://bookworms-zfhb.onrender.com'
});

export default api;
