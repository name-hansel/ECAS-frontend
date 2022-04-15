import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

import DashboardHeader from '../../components/DashboardHeader'

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddSA = () => {
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();

  // State to handle form data errors about seating arrangement
  const [formErrors, setFormErrors] = React.useState({
    titleError: "",
    dateOfExamError: "",
    studentFileError: "",
    courseFileError: "",
    roomFileError: ""
  })

  // State to handle form data about seating arrangement
  const [sa, setSA] = React.useState({
    title: "",
    dateOfExam: new Date(),
    studentFile: null,
    courseFile: null,
    roomFile: null
  });

  // Function to handle date picker data
  const handleChange = (newValue) => {
    setFormErrors({ ...formErrors, [`dateOfExamError`]: "" })
    setSA({ ...sa, dateOfExam: newValue });
  };

  // Function to handle file upload 
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormErrors({ ...formErrors, [`${name}Error`]: "" });
    setSA({ ...sa, [name]: files[0] })
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSA({ ...sa, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  const saValidation = () => {
    let titleError = "",
      dateOfExamError = "",
      studentFileError = "",
      courseFileError = "",
      roomFileError = "";
    if (!sa.title || sa.title.length === 0) titleError = "Title is required";
    if (!sa.dateOfExam || sa.dateOfExam < new Date()) dateOfExamError = "Exam date is invalid";
    if (!sa.studentFile) studentFileError = "Student details required";
    if (!sa.courseFile) courseFileError = "Course details required";
    if (!sa.roomFile) roomFileError = "Room details required";

    // Return false if any error exists, to stop form from sending data
    if (titleError || dateOfExamError || studentFileError || courseFileError || roomFileError) {
      setFormErrors({ ...formErrors, titleError, dateOfExamError, studentFileError, courseFileError, roomFileError });
      return false;
    }
    return true;
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!saValidation())
        return;

      const formData = new FormData();
      for (const name in sa) formData.append(name, sa[name]);
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      }

      await api.post("/exam_cell/seating", formData, config);

      reduxDispatch(setSnackbar(true, "success", "Added seating arrangement job successfully"));
      // Redirect to dashboard
      navigate("/dashboard/seating-arrangement");
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
    <DashboardHeader heading={'Add Seating Arrangement'} backgroundColor={'#eeaa66'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'/dashboard/seating-arrangement'} variant="outlined" startIcon={<ArrowBackIcon />}>Back</Button>
    </Box>
    <form onSubmit={onSubmit}>
      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: "space-between", width: '80%' }}>
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '50%'
        }}>
          <div>
            <Typography variant="h6">Title</Typography>
            <TextField
              variant="outlined"
              value={sa.title}
              onChange={handleFormChange}
              name="title"
              fullWidth
              required
              error={formErrors.titleError ? true : false}
              helperText={formErrors.titleError}
            />
          </div>
          <div>
            <Typography variant="h6">Date of Exam</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Typography sx={{ color: 'red' }} variant="subtitle2">{formErrors.dateOfExamError}</Typography>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                value={sa.dateOfExam}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
                minDate={new Date()}
                err
              />
            </LocalizationProvider>
          </div>
        </Box>
        <Box>
          <Stack spacing={3}>
            <div>
              <Typography variant="h6">Student details</Typography>
              <Typography sx={{ color: 'red' }} variant="subtitle2">{formErrors.studentFileError}</Typography>
              <input type="file" name='studentFile' onChange={handleFileChange} />
            </div>
            <div>
              <Typography variant="h6">Course details</Typography>
              <Typography sx={{ color: 'red' }} variant="subtitle2">{formErrors.courseFileError}</Typography>
              <input type="file" name='courseFile' onChange={handleFileChange} />
            </div>
            <div>
              <Typography variant="h6">Room details</Typography>
              <Typography sx={{ color: 'red' }} variant="subtitle2">{formErrors.roomFileError}</Typography>
              <input type="file" name='roomFile' onChange={handleFileChange} />
            </div>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', marginTop: 10 }}>
        <Button sx={{ marginLeft: 3 }} variant="contained" type="submit">Generate Seating Arrangement</Button>
        <Button component={Link} to={'/dashboard/seating-arrangement'} variant="outlined">Cancel</Button>
      </Box>
    </form>
  </>
}

export default AddSA