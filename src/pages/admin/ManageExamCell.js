import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import api from "../../utils/api"

import DashboardHeader from "../../components/DashboardHeader"

import { setSnackbar } from "../../redux/snackbar/snackbar.action"

// MUI components
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField'

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// TODO useReducer
// TODO edit exam cell

const ExamCell = () => {
  const dispatch = useDispatch();

  // Fetch data from API and store in state array
  const [examCellMembers, setExamCellMembers] = useState([]);

  // Initial state for dialog box data
  const initialExamCellMemberState = {
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  }

  // State to handle dialog data
  const [examCellMember, setExamCellMember] = useState(initialExamCellMemberState);

  // Initial state for form errors
  const initialFormErrorsState = {
    employeeIdError: "", firstNameError: "", lastNameError: "", emailError: "", phoneNumberError: ""
  }

  // Textfield errors
  const [formErrors, setFormErrors] = useState(initialFormErrorsState)

  // State to handle dialog box open status
  const [open, setOpen] = useState(false);

  // Set loading to true to show spinner
  // False once data is fetched
  const [loading, setLoading] = useState(true);

  // Async function to get exam cell member data 
  const getExamCellMembers = async () => {
    const { data } = await api.get("/admin/exam_cell/");
    return data;
  }

  // useEffect hook to populate state on load
  useEffect(() => {
    let mounted = true;
    getExamCellMembers().then(data => {
      if (mounted) {
        setExamCellMembers(data);
        setLoading(false)
      }
    })
    return () => mounted = false;
  }, [])

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      backgroundColor: '#eeeeee',
    },
    [`&.${tableCellClasses.body}`]: {
      // fontSize: 14,
    },
  }));

  // Function for validating exam cell details
  const examCellMemberValidation = () => {
    const { employeeId, firstName, lastName, email, phoneNumber } = examCellMember;

    let employeeIdError = "", firstNameError = "", lastNameError = "", emailError = "", phoneNumberError = "";

    if (!employeeId || employeeId.length === 0) employeeIdError = "Employee ID is required"
    if (!firstName || firstName.length === 0) firstNameError = "First Name is required"
    if (!lastName || lastName.length === 0) lastNameError = "Last Name is required"
    // TODO check pattern
    if (!email || email.length === 0) emailError = "Email is required"
    if (!phoneNumber || phoneNumber.length === 0) phoneNumberError = "Phone number is required"

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
      setExamCellMembers([...examCellMembers, data])
      setDialogClose();
      dispatch(setSnackbar(true, "success", "Added new Exam Cell Member successfully!"))
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
          dispatch(setSnackbar(true, "error", err.response.data.error))
        }
      }
    }
  }

  // Function to edit examcell member
  const editExamCellMember = (_id) => {
    console.log(_id)
  }

  // Function to delete examcell member
  const deleteExamCellMember = async (_id) => {
    try {
      await api.delete(`/admin/exam_cell/${_id}`)
      setExamCellMembers(examCellMembers.filter(ec => ec._id !== _id))
      dispatch(setSnackbar(true, "success", "Deleted Exam Cell Member successfully!"))
    } catch (err) {
      console.log(err)
    }
  }

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);
    // Clear any exam cell member details from dialog box
    setExamCellMember(initialExamCellMemberState)
    // Clear form errors
    setFormErrors(initialFormErrorsState)
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setExamCellMember({ ...examCellMember, [name]: value })
    // If the value of a field is changed, clear any errors associated with it
    setFormErrors({ ...formErrors, [`${name}Error`]: "" })
  }

  return (
    <>
      <DashboardHeader heading={"Manage Exam Cell"} backgroundColor={'#99CCD3'} />
      {
        loading ? (<CircularProgress />) : (
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ flexGrow: 0, marginTop: 2 }}
              onClick={() => setOpen(true)}>
              Add New Member
            </Button>

            <TableContainer sx={{ marginTop: 2 }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Employee ID</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone Number</StyledTableCell>
                    <StyledTableCell align="center">Edit</StyledTableCell>
                    <StyledTableCell align="center">Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Map through array of examcell members */}
                  {
                    examCellMembers.map((member) => (
                      <TableRow key={member.employeeId}>
                        <TableCell>{member.employeeId}</TableCell>
                        <TableCell>{[member.firstName, member.lastName].join(" ")}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phoneNumber}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => editExamCellMember(member._id)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => deleteExamCellMember(member._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>

            {/* Dialog to add new examcell member */}
            <Dialog open={open} onClose={setDialogClose}>
              <DialogTitle align="center">Add New Exam Cell Member</DialogTitle>
              <form onSubmit={addNewExamCellMember}>
                <DialogContent sx={{ p: 3 }} align="center">
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
                  <Button variant="outlined" onClick={addNewExamCellMember} type="submit">Add</Button>
                </DialogActions>
              </form>
            </Dialog>
          </Box>
        )
      }
    </>
  )
}

export default ExamCell;