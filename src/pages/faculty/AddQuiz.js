import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

import DashboardHeader from '../../components/DashboardHeader'

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddQuiz = () => {
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();

  // State to handle form data errors about quiz
  const [formErrors, setFormErrors] = React.useState({
    titleError: "",
    courseError: "",
    questionsFileError: "",
    numberOfQuestionsInQuizError: "",
    rowsError: "",
    columnsError: "",
    numberOfStudentsError: ""
  })

  // State to handle form data about quiz
  const [quiz, setQuiz] = React.useState({
    title: "",
    course: "",
    questionsFile: "",
    numberOfQuestionsInQuiz: "",
    rows: "",
    columns: "",
    numberOfStudents: ""
  });

  // Function to get courses
  const [courses, setCourses] = React.useState([]);

  const getCourses = async () => {
    const { data } = await api.get('/faculty/course');
    return data
  }

  // Populate branches on load
  React.useEffect(() => {
    getCourses().then(data => {
      setCourses([...data])
    })
  }, [])

  // Function to handle file upload 
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormErrors({ ...formErrors, [`${name}Error`]: "" });
    setQuiz({ ...quiz, [name]: files[0] })
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  const quizValidation = () => {
    let titleError = "", courseError = "", questionsFileError = "", numberOfQuestionsInQuizError = "", numberOfStudentsError = "", rowsError = "", columnsError = "";

    if (!quiz.title || quiz.title.length === 0) titleError = "Title is required";
    if (!quiz.course || quiz.course.length === 0) courseError = "Course is required";
    if (!quiz.questionsFile) questionsFileError = "Questions file is required";
    if (!quiz.numberOfQuestionsInQuiz || quiz.numberOfQuestionsInQuiz.length === 0) numberOfQuestionsInQuizError = "Number of questions in quiz is required";
    if (!quiz.numberOfStudents || quiz.numberOfStudents.length === 0) numberOfStudentsError = "Number of students is required";
    if (!quiz.rows || quiz.rows.length === 0) rowsError = "Number of rows in room required";
    if (!quiz.columns || quiz.columns.length === 0) columnsError = "Number of columns in room required";

    // Return false if any error exists, to stop form from sending data
    if (titleError || courseError || questionsFileError || numberOfQuestionsInQuizError || numberOfStudentsError || rowsError || columnsError) {
      setFormErrors({ ...formErrors, titleError, courseError, questionsFileError, numberOfQuestionsInQuizError, numberOfStudentsError, rowsError, columnsError });
      return false;
    }
    return true;
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!quizValidation())
        return;

      const formData = new FormData();
      for (const name in quiz) formData.append(name, quiz[name]);
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      }

      await api.post("/faculty/quiz", formData, config);

      reduxDispatch(setSnackbar(true, "success", "Added quiz job successfully"));
      // Redirect to dashboard
      navigate("/dashboard/quiz");
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

  return <>
    <DashboardHeader heading={'Add Quiz'} backgroundColor={'#aebe66'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'/dashboard/quiz'} variant="outlined" startIcon={<ArrowBackIcon />}>Back</Button>
    </Box>
    <form onSubmit={onSubmit}>
      <Box sx={{ marginTop: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '50%' }}>
            <Typography variant="h6">Title</Typography>
            <TextField
              variant="outlined"
              value={quiz.title}
              onChange={handleFormChange}
              name="title"
              fullWidth
              required
              error={formErrors.titleError ? true : false}
              helperText={formErrors.titleError}
            />
          </div>
          <Box sx={{ width: '40%' }}>
            <Typography variant="h6">Question Bank</Typography>
            <Typography sx={{ color: 'red' }} variant="subtitle2">{formErrors.questionsFileError}</Typography>
            <input type="file"
              name='questionsFile'
              onChange={handleFileChange}
              accept=".csv"
            />
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Course</Typography>
          <FormControl sx={{ width: 1 }}>
            <Select
              value={quiz.course}
              onChange={handleFormChange}
              displayEmpty
              name="course"
              inputProps={{ 'aria-label': 'Course' }}
            >
              {
                courses.map(course => <MenuItem key={course._id} value={course._id}>{course.code} - {course.name} - {course.branch.name}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <div style={{ width: '50%' }}>
            <Typography variant="h6">Number of Questions in Quiz</Typography>
            <TextField
              variant="outlined"
              value={quiz.numberOfQuestionsInQuiz}
              onChange={handleFormChange}
              InputProps={{
                endAdornment: <InputAdornment>
                  Questions
                </InputAdornment>,
              }}
              name="numberOfQuestionsInQuiz"
              fullWidth
              required
              error={formErrors.numberOfQuestionsInQuizError ? true : false}
              helperText={formErrors.numberOfQuestionsInQuizError}
            />
          </div>
          <div style={{ width: '40%' }}>
            <Typography variant="h6">Number of Students</Typography>
            <TextField
              variant="outlined"
              value={quiz.numberOfStudents}
              onChange={handleFormChange}
              name="numberOfStudents"
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment>
                  Students
                </InputAdornment>,
              }}
              required
              error={formErrors.numberOfStudentsError ? true : false}
              helperText={formErrors.numberOfStudentsError}
            />
          </div>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6">Room Details</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mt: 1 }}>
          <div style={{ width: '50%' }}>
            <Typography variant="subtitle1">Number of Rows</Typography>
            <TextField
              variant="outlined"
              value={quiz.rows}
              onChange={handleFormChange}
              name="rows"
              fullWidth
              required
              error={formErrors.rowsError ? true : false}
              helperText={formErrors.rowsError}
            />
          </div>
          <div style={{ width: '40%' }}>
            <Typography variant="subtitle1">Number of Columns</Typography>
            <TextField
              variant="outlined"
              value={quiz.columns}
              onChange={handleFormChange}
              name="columns"
              fullWidth
              required
              error={formErrors.columnsError ? true : false}
              helperText={formErrors.columnsError}
            />
          </div>
        </Box>
        <Divider sx={{ mt: 2 }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mt: 3 }}>
        <Button sx={{ marginLeft: 3 }} variant="contained" type="submit">Generate Quiz</Button>
        <Button component={Link} to={'/dashboard/quiz'} variant="outlined">Cancel</Button>
      </Box>
    </form>
  </>
}

export default AddQuiz