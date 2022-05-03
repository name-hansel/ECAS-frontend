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

const ArchiveUnarchiveFaculty = ({ open, setOpen, name, dispatch, _id, archive }) => {
  const reduxDispatch = useDispatch();

  const handleClose = () => {
    setOpen(false)
  }

  // Function to archive/unarchive
  const archiveOrUnarchiveFaculty = async () => {
    try {
      await api.patch(`/exam_cell/faculty/${_id}`)
      if (archive) dispatch({
        type: 'ARCHIVE_FACULTY',
        payload: _id
      })
      else dispatch({
        type: 'UNARCHIVE_FACULTY',
        payload: _id
      })
      handleClose();
      reduxDispatch(setSnackbar(true, "success", `${archive ? 'Archived' : 'Unarchived'} faculty successfully!`))
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
        {`${archive ? 'Archive' : 'Unarchive'} faculty?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to ${archive ? 'archive' : 'unarchive'} ${name}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>No</Button>
        <Button variant="outlined" onClick={archiveOrUnarchiveFaculty} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ArchiveUnarchiveFaculty