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

const AddQuery = ({ open, setOpen, dispatch }) => {
  const reduxDispatch = useDispatch();
  const [question, setQuestion] = React.useState("");
  const [questionError, setQuestionError] = React.useState("");

  const closeDialog = () => {
    setQuestion("");
    setQuestionError("");
    setOpen(false);
  }

  const askQuery = async (e) => {
    try {
      e.preventDefault();
      if (question.length === 0) {
        setQuestionError('Question name required');
        return
      }
      const { data } = await api.post("/student/query", {
        question
      })
      dispatch({
        type: 'ADD_QUERY',
        payload: data
      });
      closeDialog();
      reduxDispatch(setSnackbar(true, "success", "Added query successfully!"))
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error))
      }
    }
  }

  return <Dialog fullWidth open={open} onClose={closeDialog}>
    <DialogTitle sx={{ pb: 1 }}>Ask query</DialogTitle>
    <form onSubmit={askQuery}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          label="Question"
          value={question}
          multiline
          rows={4}
          onChange={e => {
            setQuestionError('')
            setQuestion(e.target.value)
          }}
          name="question"
          error={questionError ? true : false}
          helperText={questionError}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button variant="outlined" onClick={closeDialog}>Cancel</Button>
        <Button variant="outlined" type="submit">
          Ask
        </Button>
      </DialogActions>
    </form>
  </Dialog>
}

export default AddQuery