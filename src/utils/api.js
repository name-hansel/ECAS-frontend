import axios from 'axios';
import store from '../redux/store';
import { LOGOUT } from '../redux/user/user.types';
import { SET_SNACKBAR } from '../redux/snackbar/snackbar.types'

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
      store.dispatch({
        type: SET_SNACKBAR,
        payload: {
          snackbarOpen: true,
          snackbarType: "error",
          snackbarMessage: "Please log in again."
        }
      })
    }
    return Promise.reject(err);
  }
);

export default api;