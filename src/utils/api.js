import axios from 'axios';
import store from '../redux/store';
import { LOGOUT } from '../redux/user/user.types';

// Create an instance of axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401 || err.response.status === 403) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);

export default api;