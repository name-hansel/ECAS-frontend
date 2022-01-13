import {
  Typography, Container, TextField, Button
} from '@mui/material';
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

import { login } from "../../redux/user/user.action"

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const userState = useSelector(state => state.userState)
  const dispatch = useDispatch();

  // If user is logged in and an admin, redirect
  if (userState.isAuthenticated && userState.user.role === "admin") return <Navigate to="/admin/dashboard" />

  const AdminLogin = (e) => {
    e.preventDefault();
    dispatch(login(password))
  }

  return <Container>
    <Typography variant="h3" style={{ textAlign: 'center' }}>
      Admin Login
    </Typography>
    <p>{password}</p>
    <form onSubmit={AdminLogin}>
      <TextField type="password" value={password} label="Admin Password" variant="outlined" onChange={e => setPassword(e.target.value)} />
      <Button type="submit" variant="contained">Login</Button>
    </form>
  </Container>
}