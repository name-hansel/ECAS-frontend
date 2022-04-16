import React from 'react'
import { useDispatch } from 'react-redux'

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

// MUI components
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

const DeleteQuery = ({ open, setOpen, dispatch, _id }) => {
  // Redux dispatch to show snackbar
  const reduxDispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  }

  const deleteQuery = async () => {
    try {
      await api.delete(`/student/query/${_id}`);
      dispatch({
        type: 'DELETE_QUERY',
        payload: _id
      })
      handleClose();
      reduxDispatch(setSnackbar(true, "success", "Deleted query successfully!"))
    } catch (err) {
      console.log(err.response.data.error)
      reduxDispatch(setSnackbar(true, "error", err.response.data.error));
      handleClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete Query
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to remove this query?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>No</Button>
        <Button variant="outlined" onClick={deleteQuery} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteQuery