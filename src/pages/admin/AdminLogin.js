import {
  Typography, Box, TextField, Card, CardContent, Grid
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

import Header from "../../components/Header"

import { login } from "../../redux/user/user.action"

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const userState = useSelector(state => state.userState)
  const dispatch = useDispatch();

  const AdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(login(password, setLoading));
  }

  return userState.isAuthenticated ? <Navigate to="/dashboard/exam-cell" /> : <Box
    component="main"
    sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}
  >
    <Header />
    <Typography sx={{ mt: 3 }} gutterBottom variant="h5" color="black" align="center">
      Admin Login
    </Typography>

    <Card style={{ maxWidth: 300, margin: "24px auto", padding: "20px 5px" }}>
      <CardContent>
        <form onSubmit={AdminLogin}>
          <Grid container spacing={1}>
            <Grid xs={12} item>
              <TextField type="password" value={password} label="Admin Password" variant="outlined" onChange={e => setPassword(e.target.value)} fullWidth required />
            </Grid>

            <Grid sx={{ mt: 2 }} xs={12} item>
              <LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Login</LoadingButton>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  </Box >
}