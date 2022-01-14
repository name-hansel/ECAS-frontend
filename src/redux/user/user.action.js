import api from "../../utils/api"

export const loadUser = () => {
  return async dispatch => {
    try {
      const res = await api.get("/auth");
      // res.data contains payload for dispatch
      dispatch({
        type: "LOAD_USER",
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR"
      })
    }
  }
}

export const login = (password) => {
  return async dispatch => {
    try {
      const { data } = await api.post('/admin/auth/login', { password });
      console.log(data) // Message
      dispatch({
        type: "LOAD_USER",
        payload: {
          role: "admin"
        }
      })
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR"
      })
    }
  }
}

export const logout = () => {
  return async dispatch => {
    try {
      const { data } = await api.post("/auth/logout");
      // data.message
      dispatch({
        type: "LOGOUT"
      })
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR"
      })
    }
  }
}