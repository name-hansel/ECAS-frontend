import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

import DashboardHeader from '../../components/DashboardHeader'
// import Editor from "../../components/Editor"
import UploadAttachmentItems from '../../components/UploadAttachmentItems';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import HomeIcon from '@mui/icons-material/Home';

const Input = styled('input')({
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

  // Notice state
  const [notice, setNotice] = React.useState({
    title: '',
    description: '',
    sendNotification: 'yes'
  })

  // TODO add checkbox for all branches and years
  // TODO Do not allow empty branch or year

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
    await api.delete(`/exam_cell/notice/document/${awsFileName}`);
    dispatch({
      type: 'REMOVE_FILE',
      payload: awsFileName
    })
  }

  const onFileChange = async (e) => {
    // Extract file from FileList
    const fileToBeUploaded = e.target.files.item(0);

    // Upload newly added file
    const fileName = await uploadFile(fileToBeUploaded);

    // Add property of AWS filename to uploaded file
    fileToBeUploaded['awsFileName'] = fileName;

    // Add files to state
    dispatch({
      type: 'ADD_FILE',
      payload: fileToBeUploaded
    })
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
    // setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  const onSubmit = async (e) => {
    try {
      // TODO validation
      e.preventDefault();
      const noticeData = {
        title: notice.title,
        description: notice.description,
        sendNotification: notice.sendNotification === 'yes' ? true : false
      }
      // Get array of branch ids
      const branchData = branches.filter(branch => branch.checked).map(branch => branch._id);
      // Get array of years (1,2,3,4)
      const yearData = years.filter(year => year.checked).map(year => year.value);
      const fileData = state.map(file => file.awsFileName);

      await api.post("/exam_cell/notice", {
        ...noticeData,
        branch: branchData,
        year: yearData,
        files: fileData
      })

      // Set state to empty array
      dispatch({
        type: 'CLEAR_FILES'
      })
      // Redirect to dashboard
      navigate("/dashboard")
    } catch (err) {
      reduxDispatch(setSnackbar(true, "error", err.response.data.error))
    }
  }

  // Handle branch checkbox change
  const handleChange = (e) => {
    // Change checked to e.target.checked when _id === e.target.name
    const updatedBranches = branches.map(branch => {
      if (branch._id !== e.target.name) return branch;
      else return { ...branch, checked: e.target.checked }
    })
    setBranches([...updatedBranches]);
  }

  // Handle year checkbox change
  const handleYearChange = (e) => {
    const updatedYears = years.map(year => {
      if (year.value !== Number(e.target.name)) return year;
      else return { ...year, checked: e.target.checked }
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
            fullWidth />
        </Box>
        {/* For description */}
        {/* <Editor /> */}
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
          {/* Branch */}
          <div>
            <Typography variant="h6">Branch</Typography>
            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                {
                  branches.map(branch => <FormControlLabel
                    control={
                      <Checkbox checked={branch.checked} onChange={handleChange} name={branch._id} key={branch._id} />
                    }
                    label={branch.name}
                  />)
                }
              </FormGroup>
            </FormControl>
          </div>
          {/* Year */}
          <div>
            <Typography variant="h6">Year</Typography>
            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                {
                  years.map(year => <FormControlLabel
                    control={
                      <Checkbox checked={year.checked} onChange={handleYearChange} name={String(year.value)} key={year.value} />
                    }
                    label={year.name}
                  />)
                }
              </FormGroup>
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
          </div>
        </Box>
        {/* File upload */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 1, marginTop: 2 }}>
          <Typography variant="h6">Attachments</Typography>
          <label htmlFor="contained-button-file">
            <Input id="contained-button-file" type="file" accept=".json,.csv,.txt,.text,application/json,text/csv,text/plain,application/pdf,.png,.jpg" onChange={e => onFileChange(e)} />
            <Button variant="contained" component="span" startIcon={<FileUploadIcon />}>
              Upload attachments
            </Button>
          </label>
        </Box>
        <Divider />
        {/* Attachments */}
        <Box sx={{ paddingTop: 2, display: 'flex', paddingBottom: 2 }}>
          {/* Attachments */}
          {
            state.length > 0 ? state.map(file => <UploadAttachmentItems key={file.awsFileName} awsFileName={file.awsFileName} dispatch={dispatch} removeFile={removeFile} />) : <Typography variant="subtitle1" sx={{ margin: '0 auto', color: 'gray' }}>No files uploaded.</Typography>
          }
        </Box>
        <Button variant="outlined" type="submit">Add announcement</Button>
      </form>
    </Box>
  </>
}

export default AddNotice;