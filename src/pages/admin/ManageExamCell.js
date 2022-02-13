import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import api from "../../utils/api"

import DashboardHeader from "../../components/DashboardHeader"
import AddEditExamCell from "../../components/dialog/AddEditExamCell"

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

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// TODO useReducer
// TODO edit exam cell

const ExamCell = () => {
  const dispatch = useDispatch();

  // Fetch data from API and store in state array
  const [examCellMembers, setExamCellMembers] = useState([]);

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
      dispatch(setSnackbar(true, "success", "Deleted Exam Cell Member successfully!"))
    } catch (err) {
      console.log(err)
    }
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

            <AddEditExamCell
              open={open}
              setOpen={setOpen}
              setExamCellMembers={setExamCellMembers}
              examCellMembers={examCellMembers} />
          </Box>
        )
      }
    </>
  )
}

export default ExamCell;