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

const ArchiveUnarchiveStudent = ({ open, setOpen, name, dispatch, _id, archive }) => {
  const reduxDispatch = useDispatch();

  const handleClose = () => {
    setOpen(false)
  }

  // Function to archive/unarchive
  const archiveOrUnarchiveStudent = async () => {
    try {
      await api.patch(`/exam_cell/student/${_id}`)
      if (archive) dispatch({
        type: 'ARCHIVE_STUDENT',
        payload: _id
      })
      else dispatch({
        type: 'UNARCHIVE_STUDENT',
        payload: _id
      })
      handleClose();
      reduxDispatch(setSnackbar(true, "success", `${archive ? 'Archived' : 'Unarchived'} student successfully!`))
    } catch (err) {
      console.log(err.message)
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
        {`${archive ? 'Archive' : 'Unarchive'} student?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to ${archive ? 'archive' : 'unarchive'} ${name}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>No</Button>
        <Button variant="outlined" onClick={archiveOrUnarchiveStudent} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ArchiveUnarchiveStudent