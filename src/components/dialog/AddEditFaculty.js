import React from 'react'
import { useDispatch } from 'react-redux';

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action';
import { validateEmail, validateDomain } from '../../utils/validation';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddEditFaculty = ({
  open, setOpen, dispatch, _id, setFacultyToBeEdited
}) => {
  const reduxDispatch = useDispatch();

  // Initial state for dialog box data
  const initialFacultyState = {
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    department: ""
  }

  // Initial state for errors
  const initialFormErrorsState = {
    employeeIdError: '',
    firstNameError: '',
    lastNameError: '',
    emailError: '',
    departmentError: ''
  }

  // State to handle dialog data
  const [faculty, setFaculty] = React.useState(initialFacultyState);

  // Text field errors
  const [formErrors, setFormErrors] = React.useState(initialFormErrorsState);

  // State to handle loading
  const [loading, setLoading] = React.useState(_id ? true : false);

  // Get faculty details by id to fill dialog when updating
  const getFaculty = async (_id) => {
    const { data } = await api.get(`/exam_cell/faculty/${_id}`);
    return data;
  }

  React.useEffect(() => {
    // No ID is passed to dialog
    // Which means user wants to add new member instead of editing an existing member
    if (!_id) return

    let mounted = true;
    getFaculty(_id).then(data => {
      if (mounted) {
        // Set branch in dropdown
        setFaculty({ ...data });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [_id])

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);

    // Clear any exam cell member details from dialog box
    setFaculty(initialFacultyState);

    // Clear form errors
    setFormErrors(initialFormErrorsState);

    // Clear member to be edited ID
    setFacultyToBeEdited(null);
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFaculty({ ...faculty, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  // Validate faculty details
  const facultyValidation = () => {
    let employeeIdError = "", firstNameError = "", lastNameError = "", emailError = "", departmentError = "";

    if (!faculty.employeeId || faculty.employeeId.length === 0) employeeIdError = "Employee ID is required"
    if (!faculty.firstName || faculty.firstName.length === 0) firstNameError = "First Name is required"
    if (!faculty.lastName || faculty.lastName.length === 0) lastNameError = "Last Name is required"
    if (!faculty.email || faculty.email.length === 0) emailError = "Email is required"
    if (!validateEmail(faculty.email) || !validateDomain(faculty.email, "mes.ac.in")) emailError = "Invalid email/Domain should be 'mes.ac.in'"
    if (!faculty.department || faculty.department.length === 0) departmentError = "Department is required"

    // Return false if any error exists, to stop form from sending data
    if (employeeIdError || firstNameError || lastNameError || emailError || departmentError) {
      setFormErrors({ ...formErrors, employeeIdError, firstNameError, lastNameError, departmentError, emailError })
      return false;
    }
    return true;
  }

  // Function to handle onSubmit form to add new faculty
  const addFaculty = async (e) => {
    try {
      e.preventDefault();
      if (!facultyValidation()) {
        return
      }
      const { data } = await api.post("/exam_cell/faculty", {
        ...faculty
      })
      dispatch({
        type: 'ADD_FACULTY',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Added new faculty successfully!"))
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

  // Function to handle onSubmit form to edit faculty
  const editFaculty = async (e) => {
    try {
      e.preventDefault();
      if (!facultyValidation()) {
        return
      }
      const { data } = await api.put(`/exam_cell/faculty/${_id}`, {
        ...faculty
      })
      dispatch({
        type: 'EDIT_FACULTY',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Updated faculty successfully!"))
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
          _id ? "Edit Faculty" : "Add New Faculty"
        }
      </DialogTitle>
      <form onSubmit={_id ? editFaculty : addFaculty}>
        <DialogContent>
          <TextField
            label="Employee ID"
            variant="standard"
            value={faculty.employeeId}
            onChange={handleFormChange}
            name="employeeId"
            error={formErrors.employeeIdError ? true : false}
            helperText={formErrors.employeeIdError}
          />
          <TextField
            label="First Name"
            variant="standard"
            value={faculty.firstName}
            onChange={handleFormChange}
            name="firstName"
            error={formErrors.firstNameError ? true : false}
            helperText={formErrors.firstNameError}
          />
          <TextField
            label="Last Name"
            variant="standard"
            value={faculty.lastName}
            onChange={handleFormChange}
            name="lastName"
            error={formErrors.lastNameError ? true : false}
            helperText={formErrors.lastNameError}
          />
          <TextField
            label="Email"
            variant="standard"
            value={faculty.email}
            onChange={handleFormChange}
            name="email"
            error={formErrors.emailError ? true : false}
            helperText={formErrors.emailError}
          />
          <TextField
            label="Department"
            variant="standard"
            value={faculty.department}
            onChange={handleFormChange}
            name="department"
            error={formErrors.departmentError ? true : false}
            helperText={formErrors.departmentError}
          />
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
    </Dialog>
  )
}

export default AddEditFaculty