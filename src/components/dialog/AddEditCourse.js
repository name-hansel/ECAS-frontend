import React from 'react'
import { useDispatch } from 'react-redux';

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action';

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddEditCourse = ({
  open, setOpen, dispatch, _id, setCourseToBeEdited
}) => {
  const reduxDispatch = useDispatch();

  // Initial state for dialog box data
  const initialCourseState = {
    code: "",
    name: "",
    semester: "",
    branch: "",
    mandatory: "mandatory"
  }

  // Initial state for errors
  const initialFormErrorsState = {
    codeError: "",
    nameError: "",
    semesterError: "",
    branchError: "",
    mandatoryError: ""
  }

  // State to handle branch data
  // Course belongs to a branch
  const [branches, setBranches] = React.useState([]);

  // State to handle dialog data
  const [course, setCourse] = React.useState(initialCourseState);

  // Text field errors
  const [formErrors, setFormErrors] = React.useState(initialFormErrorsState);

  // State to handle loading
  const [loading, setLoading] = React.useState(_id ? true : false);

  // Get course details by id to fill dialog when updating
  const getCourse = async (_id) => {
    const { data } = await api.get(`/exam_cell/course/${_id}`);
    return data;
  }

  // Get branch data for adding/editing courses
  const getBranch = async () => {
    const { data } = await api.get('/exam_cell/branch');
    return data.active
  }

  React.useEffect(() => {
    // Get branch data
    getBranch().then(data => {
      setBranches([...data])
    })

    // No ID is passed to dialog
    // Which means user wants to add new course instead of editing an existing course
    if (!_id) return

    let mounted = true;
    getCourse(_id).then(data => {
      if (mounted) {
        // Set branch in dropdown
        setCourse({ ...data, branch: data.branch._id, mandatory: data.mandatory ? "mandatory" : "optional" });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [_id])

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);

    // Clear any exam cell member details from dialog box
    setCourse(initialCourseState);

    // Clear form errors
    setFormErrors(initialFormErrorsState);

    // Clear member to be edited ID
    setCourseToBeEdited(null);
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  const handleMandatoryChange = (e) => {
    setCourse({ ...course, mandatory: e.target.value })
  }

  // Validate course details
  const courseValidation = () => {
    let codeError = "", nameError = "", semesterError = "", branchError = "";

    if (!course.code || course.code.length === 0) codeError = "Course code is required";
    if (!course.name || course.name.length === 0) nameError = "Course name is required";
    if (!course.branch || course.branch.length === 0) branchError = "Branch is required"
    if (!course.semester || course.semester.length === 0) semesterError = "Semester is required"
    if (course.semester < 0 || course.semester > 8) semesterError = "Invalid semester"

    // Return false if any error exists to stop form from sending data
    if (codeError || nameError || semesterError || branchError) {
      setFormErrors({ ...formErrors, codeError, nameError, semesterError, branchError })
      return false;
    }
    return true;
  }

  // Function to handle onSubmit form to add new course
  const addCourse = async (e) => {
    try {
      let mandatoryStatus = course.mandatory === 'mandatory';
      e.preventDefault();
      if (!courseValidation()) {
        return
      }
      const { data } = await api.post("/exam_cell/course", {
        ...course, mandatory: mandatoryStatus
      })
      dispatch({
        type: 'ADD_COURSE',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Added new course successfully!"))
    }
    catch (err) {
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

  // Function to handle onSubmit form to edit course
  const editCourse = async (e) => {
    try {
      e.preventDefault();
      if (!courseValidation()) {
        return
      }
      const { data } = await api.put(`/exam_cell/course/${_id}`, {
        ...course
      })
      dispatch({
        type: 'EDIT_COURSE',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Updated course successfully!"))
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
    loading ? <></> : <Dialog fullWidth open={open} onClose={setDialogClose}>
      <DialogTitle>
        {
          _id ? "Edit Course" : "Add New Course"
        }
      </DialogTitle>
      <form onSubmit={_id ? editCourse : addCourse}>
        <DialogContent>
          <TextField
            sx={{ m: 1 }}
            label="Code"
            variant="standard"
            value={course.code}
            onChange={handleFormChange}
            name="code"
            error={formErrors.codeError ? true : false}
            helperText={formErrors.codeError}
          />
          <TextField
            label="Name"
            sx={{ m: 1 }}
            variant="standard"
            value={course.name}
            onChange={handleFormChange}
            name="name"
            error={formErrors.nameError ? true : false}
            helperText={formErrors.nameError}
          />
          <TextField
            label="Semester"
            sx={{ m: 1 }}
            variant="standard"
            value={course.semester}
            onChange={handleFormChange}
            name="semester"
            error={formErrors.semesterError ? true : false}
            helperText={formErrors.semesterError}
          />
          <FormControl sx={{ width: 0.5, m: 1 }}>
            <InputLabel id="branch">Branch</InputLabel>
            <Select
              labelId="branch"
              value={course.branch}
              label="Branch"
              onChange={handleFormChange}
              name="branch"
            >
              {
                branches.map(branch => <MenuItem key={branch._id} value={branch._id}>{branch.name}</MenuItem>)
              }
            </Select>
            <FormHelperText>{formErrors.branchError}</FormHelperText>
          </FormControl>
          {/* Mandatory or optional */}
          <FormControl sx={{ m: 1 }}>
            <FormLabel id="demo-radio-buttons-group-label">Mandatory or Optional Course</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={'mandatory'}
              name="radio-buttons-group"
              value={course.mandatory === 'mandatory' ? 'mandatory' : 'optional'}
              onChange={handleMandatoryChange}
            >
              <FormControlLabel value={'mandatory'} control={<Radio />} label="Mandatory" />
              <FormControlLabel value={'optional'} control={<Radio />} label="Optional" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={setDialogClose}>Cancel</Button>
          <Button variant="outlined" type="submit">
            {
              _id ? "Edit" : "Add"
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog >
  )
}

export default AddEditCourse