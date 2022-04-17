import React from 'react'
import { useDispatch } from 'react-redux'

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddEditFAQTopic = ({ open, setOpen, dispatch, _id, setTopicToBeEdited }) => {
  const reduxDispatch = useDispatch();

  // State to handle dialog data
  const [topic, setTopic] = React.useState("");

  // Text field errors
  const [topicError, setTopicError] = React.useState("");

  // State to handle loading
  const [loading, setLoading] = React.useState(_id ? true : false);

  // Get topic by id to fill dialog when updating
  const getFAQ = async (_id) => {
    const { data } = await api.get(`/exam_cell/faq/${_id}`);
    return data;
  }

  React.useEffect(() => {
    // No ID is passed to dialog
    // Which means user wants to add new FAQ instead of editing an existing FAQ
    if (!_id) return
    let mounted = true;
    getFAQ(_id).then(data => {
      if (mounted) {
        setTopic(data.topic);
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [_id])

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);
    setTopic("");
    setTopicError("");
    setTopicToBeEdited(null);
  }

  const editFAQTopic = async (e) => {
    try {
      e.preventDefault();
      // Validation
      const { data } = await api.put(`/exam_cell/faq/${_id}`, {
        topic
      })
      dispatch({
        type: 'EDIT_FAQ',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Updated FAQ topic successfully!"));
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error))
      }
    }
  }

  const addFAQTopic = async (e) => {
    try {
      e.preventDefault();
      if (topic.length === 0) {
        setTopicError('Topic name required')
        return
      }
      const { data } = await api.post("/exam_cell/faq", {
        topic
      })
      dispatch({
        type: 'ADD_FAQ',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Added new FAQ topic successfully!"))
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error))
      }
    }
  }

  return (
    loading ? <></> : <Dialog fullWidth open={open} onClose={setDialogClose}>
      <DialogTitle>
        {
          _id ? "Edit Topic" : "Add New Topic"
        }
      </DialogTitle>
      <form onSubmit={_id ? editFAQTopic : addFAQTopic}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Topic"
            value={topic}
            onChange={e => {
              setTopicError('')
              setTopic(e.target.value)
            }}
            name="topic"
            error={topicError ? true : false}
            helperText={topicError}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={setDialogClose}>Cancel</Button>
          <Button variant="outlined" type="submit">
            {
              _id ? "Edit" : "Add"
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEditFAQTopic