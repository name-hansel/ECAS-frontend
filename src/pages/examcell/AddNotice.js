import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"

// import RichTextEditor from "../../components/Editor"

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'
import { getTimeAfterMinutes } from "../../utils/format"

import DashboardHeader from '../../components/DashboardHeader'
import UploadAttachmentItems from '../../components/UploadAttachmentItems';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';

import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import HomeIcon from '@mui/icons-material/Home';

const FileInput = styled('input')({
  display: 'none',
});

const AddNotice = () => {
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();

  // Reducer for files
  function reducer(state, action) {
    switch (action.type) {
      case 'ADD_FILE':
        return [...state, action.payload]
      case 'REMOVE_FILE':
        return state.filter(file => file.awsFileName !== action.payload)
      case 'CLEAR_FILES':
        return []
      default:
        throw new Error();
    }
  }

  // Store files
  const [state, dispatch] = React.useReducer(reducer, []);

  // State to track if files are uploading
  const [fileUploading, setFileUploading] = React.useState(false);

  // Notice state
  const [notice, setNotice] = React.useState({
    title: '',
    description: '',
    sendNotification: 'yes',
    sendEmailIn: 0
  })

  // Branch data
  const [branches, setBranches] = React.useState([]);

  // Year data
  const [years, setYears] = React.useState([
    {
      name: 'First Year',
      value: 1,
      checked: false
    }, {
      name: 'Second Year',
      value: 2,
      checked: false
    }, {
      name: 'Third Year',
      value: 3,
      checked: false
    }, {
      name: 'Final Year',
      value: 4,
      checked: false
    }
  ]);

  // Form errors state
  const [formErrors, setFormErrors] = React.useState({
    titleError: '',
    branchError: '',
    yearError: '',
    sendEmailInError: ''
  })

  // Ref to save state for clean up function
  const stateRef = React.useRef();

  React.useEffect(() => {
    stateRef.current = state;
  }, [state])

  // Cleanup function to delete uploaded files when user moves away from add announcement page
  React.useEffect(() => {
    return async () => {
      if (stateRef.current.length === 0) return;
      // Get AWSFileNames for each file
      const fileName = stateRef.current.map(file => file.awsFileName);
      await api.delete('/exam_cell/notice/document', {
        data: {
          files: fileName
        }
      });
    }
  }, [])

  // Function to upload file to AWS and return filename
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/exam_cell/notice/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data.fileName;
    } catch (err) {
      console.error(err)
      // Set error snackbar
      reduxDispatch(setSnackbar(true, "error", err.response.data.error))
    }
  }

  // Function to delete file 
  const removeFile = async (awsFileName) => {
    try {
      await api.delete(`/exam_cell/notice/document/${awsFileName}`);
      dispatch({
        type: 'REMOVE_FILE',
        payload: awsFileName
      })
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

  const onFileChange = async (e) => {
    try {
      // Extract file from FileList
      const fileToBeUploaded = e.target.files.item(0);
      setFileUploading(true);
      // Upload newly added file
      const fileName = await uploadFile(fileToBeUploaded);
      // Add property of AWS filename to uploaded file
      fileToBeUploaded['awsFileName'] = fileName;
      // Add files to state
      dispatch({
        type: 'ADD_FILE',
        payload: fileToBeUploaded
      })
      setFileUploading(false);
    } catch (err) {
      setFileUploading(false);
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

  const getBranchData = async () => {
    const { data } = await api.get(`/exam_cell/branch`);
    return data.active;
  }

  // useEffect hook to fetch branch details
  React.useEffect(() => {
    let mounted = true;
    getBranchData().then(data => {
      if (mounted) {
        setBranches([...data.map(branch => {
          return { ...branch, checked: false }
        })]);
      }
    })
    return () => mounted = false;
  }, [])

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNotice({ ...notice, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  const noticeValidation = (title, branch, year, sendEmailIn) => {
    let titleError = '', branchError = '', yearError = '', sendEmailInError = '';
    if (!title || title.length === 0) titleError = 'Title is required';
    if (branch.length === 0) branchError = 'Select at least one branch';
    if (year.length === 0) yearError = 'Select at least one year';
    if (sendEmailIn === '' || sendEmailIn < 0 || sendEmailIn > 120) sendEmailInError = 'Invalid input (in minutes)';

    // Return false if any error exists, to stop form from sending data
    if (titleError || branchError || yearError || sendEmailInError) {
      setFormErrors({ ...formErrors, titleError, branchError, yearError, sendEmailInError })
      return false;
    }
    return true;
  }

  // Handle on submit of form
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const noticeData = {
        title: notice.title,
        description: notice.description,
        sendNotification: notice.sendNotification === 'yes' ? true : false
      }

      if (noticeData.sendNotification) noticeData.sendEmailIn = notice.sendEmailIn;

      // Get array of branch ids
      const branchData = branches.filter(branch => branch.checked).map(branch => branch._id);
      // Get array of years
      const yearData = years.filter(year => year.checked).map(year => year.value);
      const fileData = state.map(file => file.awsFileName);

      if (!noticeValidation(noticeData.title, branchData, yearData, noticeData.sendEmailIn))
        return;

      await api.post("/exam_cell/notice", {
        ...noticeData,
        branch: branchData,
        year: yearData,
        files: fileData
      })
      // Set state to empty array
      dispatch({
        type: 'CLEAR_FILES'
      });
      // Redirect to dashboard
      navigate("/dashboard");
      reduxDispatch(setSnackbar(true, "success", "Posted announcement"));
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

  // Handle sendEmailIn change
  const handleSendEmailInChange = (e) => {
    if (e.target.value < 0) setNotice({ ...notice, sendEmailIn: 0 })
    else if (e.target.value > 120) setNotice({ ...notice, sendEmailIn: 120 })
    else setNotice({ ...notice, sendEmailIn: e.target.value })
  }

  // Handle branch checkbox change
  const handleChange = (e) => {
    setFormErrors({ ...formErrors, branchError: "" })
    // Change checked to e.target.checked when _id === e.target.name
    const updatedBranches = branches.map(branch => {
      if (branch._id !== e.target.name) return branch;
      else return { ...branch, checked: e.target.checked }
    })
    setBranches([...updatedBranches]);
  }

  // Handle year checkbox change
  const handleYearChange = (e) => {
    setFormErrors({ ...formErrors, yearError: "" })
    const updatedYears = years.map(year => {
      if (year.value !== Number(e.target.name)) return year;
      else return { ...year, checked: e.target.checked }
    })
    setYears([...updatedYears])
  }

  // Handle function for 'ALL' branches checkbox
  const setForAllBranches = (e) => {
    setFormErrors({ ...formErrors, branchError: "" })
    const updatedBranches = branches.map(branch => {
      return {
        ...branch, checked: e.target.checked
      }
    })
    setBranches([...updatedBranches])
  }

  // Handle function for 'ALL' years checkbox
  const setForAllYears = (e) => {
    setFormErrors({ ...formErrors, yearError: "" })
    const updatedYears = years.map(year => {
      return {
        ...year, checked: e.target.checked
      }
    })
    setYears([...updatedYears])
  }

  return <>
    <DashboardHeader heading={'Add Announcement'} backgroundColor={'#BBDBF2'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'..'} variant="outlined" startIcon={<HomeIcon />}>Home</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {/* Title */}
      <form onSubmit={onSubmit}>
        <Box sx={{ marginBottom: 1 }}>
          <Typography variant="h6">Title</Typography>
          <TextField
            variant="outlined"
            value={notice.title}
            onChange={handleFormChange}
            name="title"
            fullWidth
            required
            error={formErrors.titleError ? true : false}
            helperText={formErrors.titleError}
          />
        </Box>
        {/* For description */}
        {/* <RichTextEditor /> */}
        <Box sx={{ marginBottom: 1, marginTop: 2 }}>
          <Typography variant="h6">Description</Typography>
          <TextField
            multiline
            minRows={4}
            variant="outlined"
            value={notice.description}
            onChange={handleFormChange}
            name="description"
            fullWidth />
        </Box>
        <Box sx={{ marginBottom: 1, marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
          {/* Year */}
          <div>
            <Typography variant="h6">Year</Typography>
            <FormControl component="fieldset" variant="standard" error={formErrors.yearError ? true : false}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={years.map(year => year.checked).every(Boolean)} onChange={setForAllYears} name={'all'} key={'all'} />
                  }
                  label={'All'}
                />
                {
                  years.map(year => <FormControlLabel
                    control={
                      <Checkbox checked={year.checked} onChange={handleYearChange} name={String(year.value)} key={year.value} />
                    }
                    label={year.name}
                  />)
                }
              </FormGroup>
              <FormHelperText>{formErrors.yearError}</FormHelperText>
            </FormControl>
          </div>
          {/* Branch */}
          <div>
            <Typography variant="h6">Branch</Typography>
            <FormControl component="fieldset" variant="standard" error={formErrors.branchError ? true : false}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={branches.map(branch => branch.checked).every(Boolean)} onChange={setForAllBranches} name={'all'} key={'all'} />
                  }
                  label={'All'}
                />
                {
                  branches.map(branch => <FormControlLabel
                    control={
                      <Checkbox checked={branch.checked} onChange={handleChange} name={branch._id} key={branch._id} />
                    }
                    label={branch.name}
                  />)
                }
              </FormGroup>
              <FormHelperText>{formErrors.branchError}</FormHelperText>
            </FormControl>
          </div>
          {/* Send notification */}
          <div>
            <FormControl>
              <FormLabel>
                <Typography variant="h6">Send email notification?</Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={notice.sendNotification}
                onChange={(e) => { setNotice({ ...notice, sendNotification: e.target.value }) }}
              >
                <div style={{ display: 'flex' }}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </div>
              </RadioGroup>
            </FormControl>
            {
              notice.sendNotification === 'yes' && <div>
                <FormHelperText id="sendEmailIn">
                  Send emails in how many minutes from now?
                </FormHelperText>
                <Input
                  id="sendEmailIn"
                  sx={{
                    '& .MuiFormHelperText-root': {
                      m: 0,
                      marginTop: 1
                    }
                  }}
                  value={notice.sendEmailIn}
                  // If minutes < 0, set to 0 as it cannot be negative
                  onChange={handleSendEmailInChange}
                  type={"number"}
                  placeholder={'[0-120] minutes'}
                />
                <FormHelperText id="sendEmailIn" sx={{ color: 'red' }}>
                  {formErrors.sendEmailInError}
                </FormHelperText>
                <Typography variant="subtitle2" sx={{ margin: '0 auto', marginTop: 1, color: 'gray' }}>{`Emails will be sent at: `}</Typography>
                <Typography variant="subtitle1" sx={{ color: 'gray', margin: '0 auto' }}>{`${getTimeAfterMinutes(notice.sendEmailIn).join(" on ")}`}</Typography>
              </div>
            }
          </div>
        </Box>
        {/* File upload */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 1, marginTop: 2 }}>
          <Typography variant="h6">Attachments</Typography>
          <label htmlFor="contained-button-file">
            <FileInput id="contained-button-file" type="file" accept=".json,.csv,.txt,.text,application/json,text/csv,text/plain,application/pdf,.png,.jpg" onChange={e => onFileChange(e)} />
            <LoadingButton loading={fileUploading} variant="outlined" component="span" startIcon={<FileUploadIcon />}>
              Upload attachments
            </LoadingButton >
          </label>
        </Box>
        <Divider />
        {/* Attachments */}
        <Box sx={{ paddingTop: 2, display: 'flex', paddingBottom: 2, flexWrap: 'wrap' }}>
          {/* Attachments */}
          {
            state.length > 0 ? state.map(file => <UploadAttachmentItems key={file.awsFileName} awsFileName={file.awsFileName} dispatch={dispatch} removeFile={removeFile} />) : <Typography variant="subtitle1" sx={{ margin: '0 auto', color: 'gray' }}>No files uploaded.</Typography>
          }
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', marginTop: 1 }}>
          <Button variant="contained" type="submit">Add announcement</Button>
          <Button sx={{ marginRight: 1 }} variant="outlined" onClick={() => navigate("/dashboard")}>Cancel</Button>
        </Box>
      </form>
    </Box>
  </>
}

export default AddNotice;