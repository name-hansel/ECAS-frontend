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

const AddQuestion = ({ open, setOpen, dispatch, _id }) => {
  const reduxDispatch = useDispatch();
  const [faq, setFAQ] = React.useState({
    question: '',
    answer: ''
  })

  // Text field errors
  const [formErrors, setFormErrors] = React.useState({
    questionError: '',
    answerError: ''
  })

  const setDialogClose = () => {
    setFormErrors({
      questionError: '',
      answerError: ''
    });
    setFAQ({
      question: '',
      answer: ''
    });
    setOpen(false);
  }

  const questionValidation = () => {
    if (formErrors.questionError || formErrors.answerError)
      return false;
    let questionError = "", answerError = "";
    const { question, answer } = faq;

    if (!question || question.length === 0) questionError = 'Question is required';
    if (!answer || answer.length === 0) answerError = 'Answer is required';

    // Return false if any error exists, to stop form from sending data
    if (questionError || answerError) {
      setFormErrors({ ...formErrors, questionError, answerError })
      return false;
    }

    return true
  }

  const addQuestion = async (e) => {
    try {
      e.preventDefault();
      if (!questionValidation()) {
        return
      }
      const { data } = await api.post(`/exam_cell/faq/${_id}`, {
        ...faq
      })
      dispatch({
        type: 'ADD_QUESTION',
        payload: data
      })
      setDialogClose();
      setFAQ({ question: '', answer: '' })
      reduxDispatch(setSnackbar(true, "success", "Added new question successfully!"))
    } catch (err) {
      if (err.response) {
        if (Array.isArray(err.response.data.error)) {
          const errors = {};
          err.response.data.error.forEach(({ param, msg }) => {
            errors[`${param}Error`] = msg;
          })
          setFormErrors({ ...formErrors, ...errors })
        } else {
          reduxDispatch(setSnackbar(true, "error", err.response.data.error))
        }
      }
    }
  }

  return (
    <Dialog open={open} onClose={setDialogClose} fullWidth>
      <DialogTitle>
        Add Question to FAQ Topic
      </DialogTitle>
      <form onSubmit={addQuestion}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Question"
            value={faq.question}
            onChange={e => setFAQ({ ...faq, question: e.target.value })}
            name="question"
            error={formErrors.questionError ? true : false}
            helperText={formErrors.questionError}
          />
          <TextField
            sx={{ marginTop: 1 }}
            label="Answer"
            multiline
            rows={4}
            value={faq.answer}
            onChange={e => setFAQ({ ...faq, answer: e.target.value })}
            name="answer"
            error={formErrors.answerError ? true : false}
            helperText={formErrors.answerError}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={setDialogClose}>Cancel</Button>
          <Button variant="outlined" type="submit">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddQuestion