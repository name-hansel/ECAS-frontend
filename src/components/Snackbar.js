import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { setSnackbar } from "../redux/snackbar/snackbar.action"

const SnackbarElement = () => {
  const dispatch = useDispatch();
  const { snackbarOpen, snackbarType, snackbarMessage } = useSelector(state => state.snackbar)

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    dispatch(setSnackbar(false, snackbarType, snackbarMessage))
  }

  return (
    <div>
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert elevation={6} variant='filled' severity={snackbarType} onClose={handleClose}>{snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SnackbarElement;