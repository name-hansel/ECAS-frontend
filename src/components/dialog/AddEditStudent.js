import React from 'react'
import { useDispatch } from 'react-redux';

import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action';
import { validateEmail, validateDomain, validatePhoneNumber } from '../../utils/validation';

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddEditStudent = ({
  open, setOpen, dispatch, _id, setStudentToBeEdited
}) => {
  const reduxDispatch = useDispatch();

  // Initial state for dialog box data
  const initialStudentState = {
    admissionNumber: '',
    firstName: '',
    lastName: '',
    branch: '',
    currentSemester: '',
    currentDivision: '',
    email: '',
    phoneNumber: ''
  }

  // Initial state for errors
  const initialFormErrorsState = {
    admissionNumberError: '',
    firstNameError: '',
    middleNameError: '',
    lastNameError: '',
    branchError: '',
    currentSemesterError: '',
    currentDivisionError: '',
    emailError: '',
    phoneNumberError: ''
  }

  // State to handle branch data
  const [branches, setBranches] = React.useState([]);

  // State to handle dialog data
  const [student, setStudent] = React.useState(initialStudentState);

  // Text field errors
  const [formErrors, setFormErrors] = React.useState(initialFormErrorsState);

  // State to handle loading
  const [loading, setLoading] = React.useState(_id ? true : false);

  // Get student details by id to fill dialog when updating
  const getStudent = async (_id) => {
    const { data } = await api.get(`/exam_cell/student/${_id}`);
    return data;
  }

  // Get branch data for adding/editing students
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
    // Which means user wants to add new member instead of editing an existing member
    if (!_id) return

    let mounted = true;
    getStudent(_id).then(data => {
      if (mounted) {
        // Set branch in dropdown
        setStudent({ ...data, branch: data.branch._id });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [_id])

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);

    // Clear any exam cell member details from dialog box
    setStudent(initialStudentState);

    // Clear form errors
    setFormErrors(initialFormErrorsState);

    // Clear member to be edited ID
    setStudentToBeEdited(null);
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  // Validate student details
  const studentValidation = () => {
    if (formErrors.admissionNumberError || formErrors.firstNameError || formErrors.lastNameError || formErrors.branchError || formErrors.currentSemesterError || formErrors.currentDivisionError || formErrors.emailError || formErrors.phoneNumberError)
      return false;

    const { admissionNumber, firstName, lastName, branch, currentSemester, currentDivision, email, phoneNumber } = student;

    let admissionNumberError = "", firstNameError = "", lastNameError = "", branchError = "", currentSemesterError = "", currentDivisionError = "", emailError = "", phoneNumberError = "";

    if (!admissionNumber || admissionNumber.length === 0) admissionNumberError = "Admission number is required"
    if (!firstName || firstName.length === 0) firstNameError = "First Name is required"
    if (!lastName || lastName.length === 0) lastNameError = "Last Name is required"
    if (!branch || branch.length === 0) branchError = "Branch is required"
    if (!currentSemester || currentSemester.length === 0) currentSemesterError = "Current semester is required"
    if (!currentDivision || currentDivision.length === 0) currentDivisionError = "Current division is required"
    if (!email || email.length === 0) emailError = "Email is required"
    if (!validateEmail(email) || !validateDomain(email, "student.mes.ac.in")) emailError = "Invalid email/Domain should be 'student.mes.ac.in'"
    if (!phoneNumber || phoneNumber.length === 0) phoneNumberError = "Phone number is required"
    if (!validatePhoneNumber(phoneNumber)) phoneNumberError = "Invalid phone number"

    // Return false if any error exists, to stop form from sending data
    if (admissionNumberError || firstNameError || lastNameError || branchError || currentSemesterError || currentDivisionError || emailError || phoneNumberError) {
      setFormErrors({ ...formErrors, admissionNumberError, firstNameError, lastNameError, branchError, currentSemesterError, currentDivisionError, emailError, phoneNumberError })
      return false;
    }

    return true;
  }

  // Function to handle onSubmit form to add new student
  const addStudent = async (e) => {
    try {
      e.preventDefault();
      if (!studentValidation()) {
        return
      }
      const { data } = await api.post("/exam_cell/student", {
        ...student
      })
      dispatch({
        type: 'ADD_STUDENT',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Added new student successfully!"))
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

  // Function to handle onSubmit form to edit student
  const editStudent = async (e) => {
    try {
      e.preventDefault();
      if (!studentValidation()) {
        return
      }
      const { data } = await api.put(`/exam_cell/student/${_id}`, {
        ...student
      })
      dispatch({
        type: 'EDIT_STUDENT',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Updated student successfully!"))
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
          _id ? "Edit Student" : "Add New Student"
        }
      </DialogTitle>
      <form onSubmit={_id ? editStudent : addStudent}>
        <DialogContent>
          <TextField
            sx={{ m: 1 }}
            label="Admission Number"
            variant="standard"
            value={student.admissionNumber}
            onChange={handleFormChange}
            name="admissionNumber"
            error={formErrors.admissionNumberError ? true : false}
            helperText={formErrors.admissionNumberError}
          />
          <TextField
            sx={{ m: 1 }}
            label="First Name"
            variant="standard"
            value={student.firstName}
            onChange={handleFormChange}
            name="firstName"
            error={formErrors.firstNameError ? true : false}
            helperText={formErrors.firstNameError}
          />
          <TextField
            sx={{ m: 1 }}
            label="Middle Name"
            variant="standard"
            value={student.middleName}
            onChange={handleFormChange}
            name="middleName"
            error={formErrors.middleNameError ? true : false}
            helperText={formErrors.middleNameError}
          />
          <TextField
            sx={{ m: 1 }}
            label="Last Name"
            variant="standard"
            value={student.lastName}
            onChange={handleFormChange}
            name="lastName"
            error={formErrors.lastNameError ? true : false}
            helperText={formErrors.lastNameError}
          />
          <FormControl sx={{ m: 1, width: 0.5 }}>
            <InputLabel id="branch">Branch</InputLabel>
            <Select
              labelId="branch"
              value={student.branch}
              label="Branch"
              onChange={handleFormChange}
              name="branch"
            >
              {
                branches.map(branch => <MenuItem key={branch._id} value={branch._id}>{branch.name}</MenuItem>)
              }
            </Select>
          </FormControl>
          <TextField
            sx={{ m: 1 }}
            label="Current Semester"
            variant="standard"
            value={student.currentSemester}
            onChange={handleFormChange}
            name="currentSemester"
            error={formErrors.currentSemesterError ? true : false}
            helperText={formErrors.currentSemesterError}
          />
          <TextField
            sx={{ m: 1 }}
            label="Current Division"
            variant="standard"
            value={student.currentDivision}
            onChange={handleFormChange}
            name="currentDivision"
            error={formErrors.currentDivisionError ? true : false}
            helperText={formErrors.currentDivisionError}
          />
          <TextField
            sx={{ m: 1 }}
            label="Email"
            variant="standard"
            value={student.email}
            onChange={handleFormChange}
            name="email"
            error={formErrors.emailError ? true : false}
            helperText={formErrors.emailError}
          />
          <TextField
            sx={{ m: 1 }}
            label="Phone Number"
            variant="standard"
            value={student.phoneNumber}
            onChange={handleFormChange}
            name="phoneNumber"
            error={formErrors.phoneNumberError ? true : false}
            helperText={formErrors.phoneNumberError}
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

export default AddEditStudent