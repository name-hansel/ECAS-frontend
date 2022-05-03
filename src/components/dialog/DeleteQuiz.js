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

const DeleteQuiz = ({ open, setOpen, dispatch, _id }) => {
  // Redux dispatch to show snackbar
  const reduxDispatch = useDispatch();

  const handleClose = () => {
    setOpen(false)
  }

  const deleteQuiz = async () => {
    try {
      await api.delete(`/faculty/quiz/${_id}`);
      dispatch({
        type: 'DELETE_QUIZ',
        payload: _id
      })
      handleClose();
      reduxDispatch(setSnackbar(true, "success", "Deleted quiz successfully!"))
    } catch (err) {
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
        Delete Quiz
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to remove this quiz?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>No</Button>
        <Button variant="outlined" onClick={deleteQuiz} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteQuiz