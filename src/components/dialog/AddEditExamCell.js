import React from 'react'
import { useDispatch } from 'react-redux'

import api from "../../utils/api"
import { validateDomain, validateEmail, validatePhoneNumber } from "../../utils/validation"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddEditExamCell = ({
  open, setOpen, dispatch, _id, setMemberToBeEditedId
}) => {
  const reduxDispatch = useDispatch();

  // Initial state for form errors
  const initialFormErrorsState = {
    employeeIdError: "", firstNameError: "", lastNameError: "", emailError: "", phoneNumberError: ""
  }

  // Textfield errors
  const [formErrors, setFormErrors] = React.useState(initialFormErrorsState)

  // Initial state for dialog box data
  const initialExamCellMemberState = {
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  }

  // State to handle dialog data
  const [examCellMember, setExamCellMember] = React.useState(initialExamCellMemberState);

  const [loading, setLoading] = React.useState(_id ? true : false);

  // Get examcell member details by id to fill dialog when updating
  const getExamCellMember = async (_id) => {
    const { data } = await api.get(`/admin/exam_cell/${_id}`);
    return data;
  }

  React.useEffect(() => {
    // No ID is passed to dialog
    // Which means user wants to add new member instead of editing an existing member
    if (!_id) return
    let mounted = true;
    getExamCellMember(_id).then(data => {
      if (mounted) {
        setExamCellMember({ ...data })
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [_id])

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);

    // Clear any exam cell member details from dialog box
    setExamCellMember(initialExamCellMemberState);

    // Clear form errors
    setFormErrors(initialFormErrorsState);

    // Clear member to be edited ID
    setMemberToBeEditedId(null);
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setExamCellMember({ ...examCellMember, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  // Function for validating exam cell details
  const examCellMemberValidation = () => {
    const { employeeId, firstName, lastName, email, phoneNumber } = examCellMember;

    let employeeIdError = "", firstNameError = "", lastNameError = "", emailError = "", phoneNumberError = "";

    if (!employeeId || employeeId.length === 0) employeeIdError = "Employee ID is required"
    if (!firstName || firstName.length === 0) firstNameError = "First Name is required"
    if (!lastName || lastName.length === 0) lastNameError = "Last Name is required"
    if (!email || email.length === 0) emailError = "Email is required"
    if (!validateEmail(email) || !validateDomain(email, "mes.ac.in")) emailError = "Invalid email"
    if (!phoneNumber || phoneNumber.length === 0) phoneNumberError = "Phone number is required"
    if (!validatePhoneNumber(phoneNumber)) phoneNumberError = "Invalid phone number"

    // Return false if any error exists, to stop form from sending data
    if (employeeIdError || firstNameError || lastNameError || emailError || phoneNumberError) {
      setFormErrors({ ...formErrors, employeeIdError, firstNameError, lastNameError, emailError, phoneNumberError })
      return false;
    }

    return true;
  }

  // Function to handle onSubmit form to add new exam cell member
  const addNewExamCellMember = async (e) => {
    try {
      e.preventDefault();
      if (!examCellMemberValidation()) {
        return
      }
      const { data } = await api.post("/admin/exam_cell", {
        ...examCellMember
      })
      dispatch({
        type: 'ADD_EXAM_CELL_MEMBER',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Added new Exam Cell Member successfully!"))
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

  // Function to handle onSubmit form to edit an exam cell member
  const editExamCellMember = async (e) => {
    try {
      e.preventDefault();
      if (!examCellMemberValidation()) {
        return
      }
      const { data } = await api.put(`/admin/exam_cell/${_id}`, {
        ...examCellMember
      })
      dispatch({
        type: 'EDIT_EXAM_CELL_MEMBER',
        payload: data
      })
      setDialogClose();
      reduxDispatch(setSnackbar(true, "success", "Updated Exam Cell Member successfully!"))
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
    loading ? <></> : <Dialog open={open} onClose={setDialogClose}>
      <DialogTitle>
        {
          _id ? "Edit Exam Cell Member" : "Add New Exam Cell Member"
        }
      </DialogTitle>
      <form onSubmit={_id ? editExamCellMember : addNewExamCellMember}>
        <DialogContent>
          <TextField
            label="Employee ID"
            variant="standard"
            value={examCellMember.employeeId}
            onChange={handleFormChange}
            name="employeeId"
            error={formErrors.employeeIdError ? true : false}
            helperText={formErrors.employeeIdError}
          />
          <TextField
            label="First Name"
            variant="standard"
            value={examCellMember.firstName}
            onChange={handleFormChange}
            name="firstName"
            error={formErrors.firstNameError ? true : false}
            helperText={formErrors.firstNameError}
          />
          <TextField
            label="Last Name"
            variant="standard"
            value={examCellMember.lastName}
            onChange={handleFormChange}
            name="lastName"
            error={formErrors.lastNameError ? true : false}
            helperText={formErrors.lastNameError}
          />
          <TextField
            label="Email"
            variant="standard"
            value={examCellMember.email}
            onChange={handleFormChange}
            name="email"
            error={formErrors.emailError ? true : false}
            helperText={formErrors.emailError}
          />
          <TextField
            label="Phone Number"
            variant="standard"
            value={examCellMember.phoneNumber}
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

export default AddEditExamCell