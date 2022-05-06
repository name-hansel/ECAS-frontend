import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

import DashboardHeader from "../../components/DashboardHeader";
import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';
import QuizJob from '../../components/QuizJob';
import DeleteQuiz from '../../components/dialog/DeleteQuiz';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider'

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const Quiz = () => {
  const reduxDispatch = useDispatch();

  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_QUIZ':
        return action.payload
      case 'ADD_QUIZ':
        return [...state, action.payload]
      case 'UPDATE_QUIZ':
        return state.map(quiz => {
          if (quiz._id === action.payload._id) return action.payload
          return quiz
        })
      case 'DELETE_QUIZ':
        return state.filter(quiz => quiz._id !== action.payload)
      default:
        throw new Error();
    }
  }

  // _id for delete dialog
  const [id, setId] = React.useState(null);

  // State for opening/closing delete dialog
  const [open, setOpen] = React.useState(false);

  // State containing quizzes already in database
  const [state, dispatch] = React.useReducer(reducer, []);

  // State to track if data is loading
  const [loading, setLoading] = React.useState(true);

  const getQuizzes = async () => {
    try {
      const { data } = await api.get("/faculty/quiz");
      return data;
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error));
      }
    }
  }

  // useEffect hook to populate state on load
  React.useEffect(() => {
    let mounted = true;
    getQuizzes().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_QUIZ',
          payload: data
        });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])

  const updateQuiz = (newQuiz) => {
    dispatch({
      type: 'UPDATE_QUIZ',
      payload: newQuiz
    })
  }

  return <>
    <DashboardHeader heading="Quiz" backgroundColor={'#aebe66'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'./add'} variant="outlined" startIcon={<AddIcon />}>Generate Quiz</Button>
      <Button variant="outlined" sx={{ marginRight: 2 }} startIcon={<RefreshIcon />} onClick={() => {
        // Get data again
        getQuizzes().then(data => {
          dispatch({
            type: 'LOAD_QUIZ',
            payload: data
          })
        })
      }}>Refresh</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {
        loading ? <CircularProgress /> :
          <>
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="h5">
                In Progress
              </Typography>
              <Divider />
              <Box sx={{ marginTop: 2 }} >
                {
                  state.filter(sa => !sa.complete && !sa.failed).length === 0 ? <Typography sx={{ color: '#dedede' }} textAlign="center" variant="subtitle2">
                    No quiz generation in progress.
                  </Typography> :
                    <>
                      {
                        state.filter(quiz => !quiz.complete && !quiz.failed).map(job => <QuizJob key={job._id} quiz={job} setId={setId} setOpen={setOpen} />)
                      }
                    </>
                }
              </Box>
            </Box>
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h5">
                Finished
              </Typography>
              <Divider />
              <Box sx={{ marginTop: 2 }}>
                {
                  state.filter(sa => sa.complete || sa.failed).length === 0 ? <Typography sx={{ color: '#dedede' }} textAlign="center" variant="subtitle2">
                    No quiz generation completed.
                  </Typography> : <>
                    {
                      state.filter(sa => sa.complete || sa.failed).map(job => <QuizJob key={job._id} quiz={job} setId={setId} setOpen={setOpen} updateQuiz={updateQuiz} />)
                    }
                  </>
                }
              </Box>
            </Box>
          </>
      }
    </Box>
    <DeleteQuiz
      open={open}
      setOpen={setOpen}
      dispatch={dispatch}
      _id={id}
    />
  </>
}

export default Quiz