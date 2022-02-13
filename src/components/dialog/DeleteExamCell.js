import React from 'react'
import { useDispatch } from 'react-redux'

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

const DeleteExamCell = ({ open, setOpen, name, dispatch, _id }) => {
  const reduxDispatch = useDispatch();

  const handleClose = () => {
    setOpen(false)
  }

  // Function to delete examcell member
  const deleteExamCellMember = async () => {
    try {
      await api.delete(`/admin/exam_cell/${_id}`)
      // setExamCellMembers(examCellMembers.filter(ec => ec._id !== _id))
      dispatch({
        type: 'DELETE_EXAM_CELL_MEMBER',
        payload: _id
      })
      handleClose();
      reduxDispatch(setSnackbar(true, "success", "Deleted Exam Cell Member successfully!"))
    } catch (err) {
      console.log(err)
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
        Delete Exam Cell Member
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to remove ${name} as an Exam Cell Member?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>No</Button>
        <Button variant="outlined" onClick={deleteExamCellMember} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteExamCell