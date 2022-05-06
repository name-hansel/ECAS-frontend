import React from "react"
import { useDispatch } from 'react-redux'
import { setSnackbar } from '../../redux/snackbar/snackbar.action'
import api from "../../utils/api"

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import DashboardHeader from "../../components/DashboardHeader"

const ChangePassword = () => {
  const reduxDispatch = useDispatch();
  const initialPasswordState = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }
  const [password, setPassword] = React.useState(initialPasswordState)
  const [loading, setLoading] = React.useState(false);

  const passwordValidation = () => {
    if (password.newPassword !== password.confirmPassword) {
      reduxDispatch(setSnackbar(true, "error", "Passwords do not match"));
      return false
    }
    return true
  }

  const changePassword = async (e) => {
    try {
      e.preventDefault();
      if (!passwordValidation()) {
        return
      }
      setLoading(true);
      await api.post("/admin/auth/change-password", {
        ...password
      })
      reduxDispatch(setSnackbar(true, "success", "Changed password successfully!"));
      setPassword(initialPasswordState);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        if (Array.isArray(err.response.data.error)) {
          const errors = {};
          err.response.data.error.forEach(({ param, msg }) => {
            errors[`${param}Error`] = msg;
          })
        } else {
          reduxDispatch(setSnackbar(true, "error", err.response.data.error))
        }
      }
    }
  }

  return <>
    <DashboardHeader heading={"Change Password"} backgroundColor={'#99BBD3'} />
    <Box sx={{ mt: 4 }} display="flex" justifyContent="center">
      <form onSubmit={changePassword}>
        <Box sx={{ display: 'inline-flex', flexDirection: 'column' }}>
          <TextField
            sx={{ mt: 2 }}
            label="Old Password"
            variant="outlined"
            value={password.oldPassword}
            onChange={e => setPassword({ ...password, oldPassword: e.target.value })}
            name="oldPassword"
            type="password"
            required
          />
          <TextField
            sx={{ mt: 2 }}
            label="New Password"
            variant="outlined"
            value={password.newPassword}
            onChange={e => setPassword({ ...password, newPassword: e.target.value })}
            name="newPassword"
            type="password"
            required
          />
          <TextField
            sx={{ mt: 2 }}
            label="Confirm New Password"
            variant="outlined"
            value={password.confirmPassword}
            onChange={e => setPassword({ ...password, confirmPassword: e.target.value })}
            name="confirmPassword"
            type="password"
            required
          />
          <LoadingButton sx={{ mt: 4 }} loading={loading} type="submit" variant="contained" >Change Password</LoadingButton>
        </Box>
      </form>
    </Box>
  </>
}

export default ChangePassword;