import React from 'react'
import { useDispatch } from 'react-redux'

import AddQuestion from "../../dialog/AddQuestion"
import api from "../../../utils/api"
import { setSnackbar } from '../../../redux/snackbar/snackbar.action'

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

// Accordion
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const FAQTopic = ({ faq, deleteTopic, editTopic }) => {
  const reduxDispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  // Adding question to which FAQ topic
  const [id, setId] = React.useState(null);

  // Reducer for questions in faq
  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_QUESTIONS':
        return faq.questionAndAnswers
      case 'ADD_QUESTION':
        return [...state, action.payload]
      case 'DELETE_QUESTION':
        return state.filter(faq => faq._id !== action.payload)
      default:
        throw new Error();
    }
  }

  // State containing questions of the topic
  const [questions, dispatch] = React.useReducer(reducer, []);

  React.useEffect(() => {
    dispatch({
      type: 'LOAD_QUESTIONS',
    })
  }, [])

  const deleteQuestion = async (faq_id, question_id) => {
    try {
      await api.delete(`/exam_cell/faq/${faq_id}/${question_id}`);
      dispatch({
        type: 'DELETE_QUESTION',
        payload: question_id
      })
      reduxDispatch(setSnackbar(true, "success", "Deleted question successfully!"))
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error));
      }
    }
  }

  return <Card variant="outlined" sx={{ p: 2, marginBottom: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h5">{faq.topic}</Typography>
      <Stack direction="row" spacing={1}>
        <IconButton aria-label="add" onClick={() => {
          setId(faq._id)
          setOpen(true)
        }}>
          <AddIcon />
        </IconButton>
        <IconButton aria-label="edit" onClick={() => editTopic(faq._id)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => deleteTopic(faq._id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {
        questions.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No questions found in this topic.</Typography> : questions.map((qna, index) => <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            <Typography variant="subtitle1">{qna.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2">
              {qna.answer}
            </Typography>
            <IconButton aria-label="delete" onClick={() => deleteQuestion(faq._id, qna._id)}>
              <DeleteIcon />
            </IconButton>
          </AccordionDetails>
        </Accordion>
        )
      }
    </Box>
    <AddQuestion
      open={open}
      setOpen={setOpen}
      _id={id}
      dispatch={dispatch}
    />
  </Card>
}

export default FAQTopic