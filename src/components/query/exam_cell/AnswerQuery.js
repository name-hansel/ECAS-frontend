import React from 'react';
import { useDispatch } from 'react-redux';

import api from "../../../utils/api";
import { getFormattedDate } from '../../../utils/format';
import semesterYearMapping from '../../../utils/semester';
import { setSnackbar } from '../../../redux/snackbar/snackbar.action';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AnswerQuery = ({ open, setOpen, dispatch, _id, setIdToBeAnswered }) => {
  const reduxDispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  const initialQuery = {
    question: "",
    answer: "",
    askedBy: {
      firstName: "",
      lastName: "",
      branch: {
        name: ""
      }
    }, createdAt: null
  }

  const [query, setQuery] = React.useState(initialQuery)

  const [answer, setAnswer] = React.useState("");
  const [answerError, setAnswerError] = React.useState("");

  // Get answer in case of edit answer
  const getQuery = async () => {
    try {
      const { data } = await api.get(`/exam_cell/query/${_id}`);
      return data;
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error))
      }
    }
  }

  React.useEffect(() => {
    if (!_id) return
    let mounted = true;
    getQuery(_id).then(data => {
      if (mounted) {
        setQuery({ ...data });
        setAnswer(data.answer);
        setLoading(false);
      }
    })
    return () => {
      mounted = false
      setLoading(true);
    };
  }, [_id])

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);
    setAnswerError("");
    setQuery(initialQuery);
    setIdToBeAnswered(null);
  }

  const editAnswer = async (e) => {
    try {
      e.preventDefault();
      if (!answer || answer.length === 0) {
        setAnswerError("Answer is required")
        return
      }
      const { data } = await api.patch(`/exam_cell/query/${_id}`, {
        answer
      })
      dispatch({
        type: 'EDIT_QUERY',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Edited answer successfully!"))
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error))
      }
    }
  }

  const addAnswer = async (e) => {
    try {
      e.preventDefault();
      if (!answer || answer.length === 0) {
        setAnswerError("Answer is required")
        return
      }
      const { data } = await api.post(`/exam_cell/query/${_id}`, {
        answer
      })
      dispatch({
        type: 'EDIT_QUERY',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Answered query successfully!"))
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error))
      }
    }
  }

  return (
    _id ? <Dialog fullWidth open={open} onClose={setDialogClose}>
      {
        loading ? <></> : <>
          <DialogTitle>
            {
              query.answer ? "Edit Answer" : "Answer Query"
            }
          </DialogTitle>
          <form onSubmit={query.answer ? editAnswer : addAnswer}>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', pt: 0 }}>
              <Box sx={{ display: 'flex', pb: 2, }}>
                <Avatar sx={{ width: 64, height: 64 }}>{`${query.askedBy.firstName[0] + query.askedBy.lastName[0]}`}</Avatar>
                <Box sx={{ marginLeft: 2 }}>
                  <Typography variant="h6">{query.question}</Typography>
                  <Typography sx={{ color: 'gray' }} variant="caption">{`Asked on: ${getFormattedDate(query.createdAt)}`}</Typography>
                  <Typography sx={{ color: 'gray' }} variant="caption" display="block">{
                    `Asked by: ${[query.askedBy.firstName, query.askedBy.lastName].join(" ")} (${[semesterYearMapping[query.askedBy.currentSemester - 1], query.askedBy.branch.name].join(" - ")})`
                  }
                  </Typography>
                </Box>
              </Box>
              <TextField
                label="Answer"
                value={answer}
                multiline
                rows={4}
                onChange={e => {
                  setAnswerError('')
                  setAnswer(e.target.value);
                }}
                name="topic"
                error={answerError ? true : false}
                helperText={answerError}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button variant="outlined" onClick={setDialogClose}>Cancel</Button>
              <Button variant="outlined" type="submit">
                {
                  query.answer ? "Edit" : "Add"
                }
              </Button>
            </DialogActions>
          </form>
        </>
      }
    </Dialog> : null
  )
}

export default AnswerQuery