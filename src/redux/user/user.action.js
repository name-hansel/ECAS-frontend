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
      const res = await api.post('/admin/auth/login', { password });
      console.log(res.data) // Message
      dispatch({
        type: "LOAD_USER",
        payload: {
          role: "admin"
        }
      })
    } catch (err) {
      // TODO dispatch logout action
      console.log(err.response.data)
    }
  }
}