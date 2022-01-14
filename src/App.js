import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link as RouterLink, Navigate } from "react-router-dom";
import { Link } from '@mui/material';

import { loadUser } from "./redux/user/user.action"

export default function App() {
  const userState = useSelector((state) => state.userState)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser())
  }, [])

  return userState.isAuthenticated ? userState.user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <h1>Normal user</h1> : < Link component={RouterLink} to="/admin-login" variant="body1" >
    Admin Login
  </Link >;
}
