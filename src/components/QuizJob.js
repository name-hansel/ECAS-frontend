import React from 'react';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import api from "../utils/api"
import { setSnackbar } from '../redux/snackbar/snackbar.action'

import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PublishIcon from '@mui/icons-material/Publish';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const ModifiedPaper = styled(Paper)({
  padding: 6,
  paddingLeft: 8,
  paddingRight: 8,
  marginRight: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const QuizJob = ({ quiz, setId, setOpen, updateQuiz }) => {
  const reduxDispatch = useDispatch();
  const [showDetails, setShowDetails] = React.useState(false);

  const fileInputRef = React.useRef();
  const handleChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append('resultFile', e.target.files[0]);
      const { data } = await api.post(`/faculty/quiz/${quiz._id}/result`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      updateQuiz(data);
      reduxDispatch(setSnackbar(true, "success", "Uploaded result file successfully!"));
    } catch (err) {
      console.log(err);
      if (err.response)
        reduxDispatch(setSnackbar(true, "error", err.response.data.error));
    }
  }

  const deleteResult = async () => {
    try {
      const { data } = await api.delete(`/faculty/quiz/${quiz._id}/result`);
      updateQuiz(data);
      reduxDispatch(setSnackbar(true, "success", "Deleted result file successfully!"));
    } catch (err) {
      console.log(err);
      if (err.response)
        reduxDispatch(setSnackbar(true, "error", err.response.data.error));
    }
  }

  const publishResult = async () => {
    try {
      const { data } = await api.put(`/faculty/quiz/${quiz._id}`);
      updateQuiz(data);
      reduxDispatch(setSnackbar(true, "success", "Published result file successfully!"));
    } catch (err) {
      console.log(err);
      if (err.response)
        reduxDispatch(setSnackbar(true, "error", err.response.data.error));
    }
  }

  return <Card variant="outlined" sx={{ p: 2, paddingTop: 1.5, paddingBottom: 1.5, marginBottom: 3 }}>
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: showDetails ? 1 : 0 }}>
      <div>
        <Typography variant="h6">{quiz.title}</Typography>
        <Typography variant="subtitle1">Course: {quiz.course.name}</Typography><Typography variant="subtitle1">Class: {
          `Semester ${quiz.course.semester} - ${quiz.division}`
        }</Typography>
        <Typography variant="subtitle1">{
          !quiz.complete && !quiz.failed ? <Typography sx={{ color: 'gray' }}>In progress</Typography> : quiz.failed ? <Typography sx={{ color: 'red' }}>Failed</Typography> : <Stack direction="row" spacing={2}>
            <Typography sx={{ color: 'green', marginTop: '2px' }}>Completed</Typography>
            {/* Download seating arrangement */}
            <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/quiz/${quiz.solutionFile}`} target="_blank" rel="noreferrer">
              Download
            </Link>
          </Stack>
        }</Typography>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {
          quiz.complete && !quiz.failed ? quiz.resultFile ? !quiz.resultPublish ? <Button startIcon={<PublishIcon />} variant="outlined" onClick={publishResult}>Publish Results</Button> : <Button startIcon={<DoneAllIcon />} variant="outlined" disabled>Result Published</Button> : <div>
            <input onChange={handleChange} multiple={false} ref={fileInputRef} type='file' hidden />
            <Button onClick={() => fileInputRef.current.click()} sx={{ marginLeft: 2 }} startIcon={<FileUploadIcon />} variant="outlined">Upload Results</Button>
          </div> : null
        }
        <Button sx={{ marginLeft: 2 }} variant="outlined" onClick={() => setShowDetails(!showDetails)}>{
          showDetails ? "Hide Details" : "Show details"
        }</Button>
        {
          quiz.complete || quiz.failed ? <IconButton onClick={() => {
            setId(quiz._id)
            setOpen(true)
          }} sx={{ marginLeft: 2 }}>
            <DeleteIcon />
          </IconButton> : <IconButton onClick={() => {
            setId(quiz._id)
            setOpen(true)
          }} sx={{ marginLeft: 2 }}>
            <CancelIcon />
          </IconButton>
        }
      </div>
    </Box>
    {
      showDetails ? <>
        <Divider />
        <Box sx={{ display: 'flex', marginTop: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex' }}>
            <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/quiz/${quiz.questionsFile}`} underline="hover" target="_blank" rel="noreferrer">
              <ModifiedPaper variant="outlined" elevation={0}>
                <PersonIcon sx={{ marginRight: 1 }} />
                <Typography variant="subtitle1">{decodeURI(quiz.questionsFile)}</Typography>
              </ModifiedPaper>
            </Link>
            {
              quiz.resultFile ? <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/quiz/${quiz.resultFile}`} underline="hover" target="_blank" rel="noreferrer">
                <ModifiedPaper variant="outlined" elevation={0}>
                  <ListAltIcon sx={{ marginRight: 1 }} />
                  <Typography variant="subtitle1">{decodeURI(quiz.resultFile)}</Typography>
                </ModifiedPaper>
              </Link> : <></>
            }
          </Box>
          {
            quiz.resultFile && !quiz.resultPublish ? <Box>
              <Button startIcon={<DeleteIcon />} onClick={deleteResult} variant="outlined">Delete Result</Button>
            </Box> : <></>
          }
        </Box>
      </> : null
    }
  </Card>
}

export default QuizJob