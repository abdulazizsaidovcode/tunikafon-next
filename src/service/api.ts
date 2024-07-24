import axios from 'axios';
import { base_url } from './urls';


axios.defaults.baseURL = base_url;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export default axios;
