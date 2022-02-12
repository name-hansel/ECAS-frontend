import { useState, useEffect } from "react"
import api from "../../utils/api"

import DashboardHeader from "../../components/DashboardHeader"

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

// TODO add validation
// TODO useReducer
// TODO snackbar
// TODO edit exam cell

const ExamCell = () => {
  // Fetch data from API and store in state array
  const [examCellMembers, setExamCellMembers] = useState([]);

  // State to handle dialog data
  const [examCellMember, setExamCellMember] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });

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

  // Function to edit examcell member
  const editExamCellMember = (_id) => {
    console.log(_id)
  }

  // Function to delete examcell member
  const deleteExamCellMember = async (_id) => {
    try {
      await api.delete(`/admin/exam_cell/${_id}`)
      setExamCellMembers(examCellMembers.filter(ec => ec._id !== _id))
    } catch (err) {
      console.log(err)
    }
  }

  // Handle closing dialog box (set open to false) and clear state
  const setDialogClose = () => {
    setOpen(false);
    setExamCellMember({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: ""
    })
  }

  // Function to handle form change to update state
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setExamCellMember({ ...examCellMember, [name]: value })
  }

  // Function to handle onSubmit form to add new exam cell member
  const addNewExamCellMember = async (e) => {
    try {
      e.preventDefault();
      const { data } = await api.post("/admin/exam_cell", {
        ...examCellMember
      })
      setExamCellMembers([...examCellMembers, data])
      setDialogClose();
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <DashboardHeader heading={"Manage Exam Cell"} backgroundColor={'#99CCD3'} />
      {
        loading ? (<CircularProgress />) : (
          <Box>
            <TableContainer sx={{ marginTop: 3 }}>
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ flexGrow: 0, marginTop: 2 }}
              onClick={() => setOpen(true)}>
              Add New Member
            </Button>

            {/* Dialog to add new examcell member */}
            <Dialog open={open} onClose={setDialogClose}>
              <DialogTitle>Add New Exam Cell Member</DialogTitle>
              <form onSubmit={addNewExamCellMember}>
                <DialogContent>
                  <TextField id="standard-basic" label="Employee ID" variant="standard" value={examCellMember.employeeId} onChange={handleFormChange} name="employeeId" />
                  <TextField id="standard-basic" label="First Name" variant="standard" value={examCellMember.firstName} onChange={handleFormChange} name="firstName" />
                  <TextField id="standard-basic" label="Last Name" variant="standard" value={examCellMember.lastName} onChange={handleFormChange} name="lastName" />
                  <TextField id="standard-basic" label="Email" variant="standard" value={examCellMember.email} onChange={handleFormChange} name="email" />
                  <TextField id="standard-basic" label="Phone Number" variant="standard" value={examCellMember.phoneNumber} onChange={handleFormChange} name="phoneNumber" />
                </DialogContent>
                <DialogActions>
                  <Button onClick={setDialogClose}>Cancel</Button>
                  <Button onClick={addNewExamCellMember} type="submit">Add</Button>
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