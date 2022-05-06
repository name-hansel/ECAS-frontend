import api from "../../utils/api"
import { SET_SNACKBAR } from "../snackbar/snackbar.types";
import { LOAD_USER, LOGOUT, AUTH_ERROR } from "./user.types";

export const loadUser = () => {
  return async dispatch => {
    try {
      const res = await api.get("/auth");
      dispatch({
        type: LOAD_USER,
        payload: res.data
      })
    } catch (err) {
      if (err.response.status !== 400) dispatch({
        type: SET_SNACKBAR,
        payload: {
          snackbarOpen: true,
          snackbarType: "error",
          snackbarMessage: err.response.data.error
        }
      })
      dispatch({
        type: AUTH_ERROR
      })
    }
  }
}

// Used only for admin login
export const login = (password, setLoading) => {
  return async dispatch => {
    try {
      await api.post('/admin/auth/login', { password });
      dispatch({
        type: LOAD_USER,
        payload: {
          role: "admin"
        }
      })
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) dispatch({
        type: SET_SNACKBAR,
        payload: {
          snackbarOpen: true,
          snackbarType: "error",
          snackbarMessage: err.response.data.error
        }
      })
      dispatch({
        type: AUTH_ERROR
      })
    }
  }
}

export const logout = () => {
  return async dispatch => {
    try {
      const { data } = await api.post("/auth/logout");
      dispatch({
        type: LOGOUT
      })
      dispatch({
        type: SET_SNACKBAR,
        payload: {
          snackbarOpen: true,
          snackbarType: "success",
          snackbarMessage: data.message
        }
      })
    } catch (err) {
      if (err.response) dispatch({
        type: SET_SNACKBAR,
        payload: {
          snackbarOpen: true,
          snackbarType: "error",
          snackbarMessage: err.response.data.error
        }
      })
      dispatch({
        type: AUTH_ERROR
      })
    }
  }
}