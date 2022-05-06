import React from 'react'
import { useDispatch } from 'react-redux';

import DashboardHeader from "../../components/DashboardHeader";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';
import QuizItem from './QuizItem';

const Quiz = () => {
  const reduxDispatch = useDispatch();
  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getQuizzes = async () => {
    try {
      const { data } = await api.get(`/student/quiz`);
      return data;
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", 'Quizzes not found'));
      }
    }
  }

  React.useEffect(() => {
    getQuizzes().then(data => {
      setQuizzes(data);
      setLoading(false);
    })
  }, [])

  return <>
    <DashboardHeader heading="Quiz" backgroundColor={'#eabb99'} />
    <Box sx={{ marginTop: 4 }}>
      {
        loading ? <CircularProgress /> : <Box sx={{ marginBottom: 3 }}>
          <Typography variant="h5">
            Published Quiz Results
          </Typography>
          {
            quizzes.length === 0 ? <Typography sx={{ color: '#dedede' }} textAlign="center" variant="subtitle2">
              No quiz results published yet.
            </Typography> : <Box sx={{ mt: 2 }}>
              {
                quizzes.map(quiz => <QuizItem key={quiz._id} quiz={quiz} />)
              }
            </Box>
          }
        </Box>
      }
    </Box>
  </>
}

export default Quiz