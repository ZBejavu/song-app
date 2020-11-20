import axios from 'axios';

console.log(process.env.NODE_ENV , "environment")
const network = axios.create({
  // baseURL: 'http://localhost:5000'
});

const getToken = () => {
  return localStorage.getItem('token');
}

network.interceptors.request.use(
  config => {
    // Do something before request is sent

    config.headers["Authorization"] = "bearer " + getToken();
    return config;
  }
);

network.interceptors.response.use(
  config => {
    console.log('RESPONSE', config)
    return config;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.replace('/login');
    }
    return error.response;
  }
);

export default network;