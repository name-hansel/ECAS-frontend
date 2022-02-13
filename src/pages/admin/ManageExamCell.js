import { useState, useEffect, useReducer } from "react"
import api from "../../utils/api"

import DashboardHeader from "../../components/DashboardHeader"
import AddEditExamCell from "../../components/dialog/AddEditExamCell"
import DeleteExamCell from "../../components/dialog/DeleteExamCell"

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

const ExamCell = () => {
  // State containing exam cell members already in database
  const [state, dispatch] = useReducer(reducer, []);

  // Reducer for exam cell members
  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_EXAM_CELL_MEMBERS':
        return action.payload
      case 'ADD_EXAM_CELL_MEMBER':
        return [...state, action.payload]
      case 'EDIT_EXAM_CELL_MEMBER':
        return state.map(ec => {
          if (ec._id === action.payload._id) return action.payload
          else return ec
        })
      case 'DELETE_EXAM_CELL_MEMBER':
        return state.filter(ec => ec._id !== action.payload)
      default:
        throw new Error();
    }
  }

  // State to store which member we are editing
  const [memberToBeEditedId, setMemberToBeEditedId] = useState(null);

  // State to handle dialog box open status
  const [open, setOpen] = useState(false);

  // State to handle delete confirmation dialog open status
  const [deleteOpen, setDeleteOpen] = useState(false);

  // State to store name of EC member to delete
  const [deleteName, setDeleteName] = useState("");

  // State to store _id of EC member to delete
  const [deleteId, setDeleteId] = useState("");

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
        dispatch({
          type: 'LOAD_EXAM_CELL_MEMBERS',
          payload: data
        });
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
    setMemberToBeEditedId(_id);
    setOpen(true);
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
                    state.map((member) => (
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
                          <IconButton onClick={() => {
                            setDeleteName([member.firstName, member.lastName].join(" "))
                            setDeleteId(member._id)
                            setDeleteOpen(true)
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <DeleteExamCell
              open={deleteOpen}
              setOpen={setDeleteOpen}
              name={deleteName}
              dispatch={dispatch}
              _id={deleteId}
            />
            <AddEditExamCell
              open={open}
              setOpen={setOpen}
              dispatch={dispatch}
              setMemberToBeEditedId={setMemberToBeEditedId}
              _id={memberToBeEditedId}
            />
          </Box>
        )
      }
    </>
  )
}

export default ExamCell;