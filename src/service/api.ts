import axios from 'axios';

const base_url = 'http://64.226.108.80:8090';

axios.defaults.baseURL = base_url;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || '';
  config.headers.Authorization = token;
  return config;
});

export default { base_url, axios };
