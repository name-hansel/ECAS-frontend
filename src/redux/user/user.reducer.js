import {
  LOAD_USER,
  AUTH_ERROR,
  LOGOUT
} from "./user.types"

const initialState = {
  isAuthenticated: false,
  loading: true,
  user: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
    case AUTH_ERROR: return {
      ...state,
      isAuthenticated: false,
      loading: false,
      user: null
    }
    case LOAD_USER: return {
      ...state,
      user: action.payload,
      isAuthenticated: true,
      loading: false
    }
    default:
      return state;
  }
}

export default userReducer