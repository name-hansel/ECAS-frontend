import { useState, useEffect, useReducer } from "react"
import api from "../../utils/api"

import DashboardHeader from "../../components/DashboardHeader"
import AddEditStudent from "../../components/dialog/AddEditStudent";
import ArchiveUnarchiveStudent from "../../components/dialog/ArchiveUnarchiveStudent";

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
import Typography from '@mui/material/Typography'

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'

const ManageStudent = () => {
  // Reducer for students
  function reducer(state, action) {
    let student = null;

    switch (action.type) {
      case 'LOAD_STUDENTS':
        return action.payload
      case 'ADD_STUDENT':
        return {
          archived: state.archived,
          active: [...state.active, action.payload]
        }
      case 'EDIT_STUDENT':
        return {
          archived: state.archived,
          active: state.active.map(b => {
            if (b._id === action.payload._id) return action.payload
            else return b
          })
        }
      case 'ARCHIVE_STUDENT':
        return {
          active: state.active.filter(b => {
            if (b._id !== action.payload) return true;
            student = b;
            return false
          }),
          archived: [...state.archived, student]
        }
      case 'UNARCHIVE_STUDENT':
        return {
          archived: state.archived.filter(b => {
            if (b._id !== action.payload) return true;
            student = b;
            return false
          }),
          active: [...state.active, student]
        }
      default:
        throw new Error();
    }
  }

  // Set loading to true to show spinner
  // False once data is fetched
  const [loading, setLoading] = useState(true);

  // State containing students already in database
  const [state, dispatch] = useReducer(reducer, {
    active: [],
    archived: []
  });

  // State to handle dialog box open status
  const [open, setOpen] = useState(false);

  // State to store which member we are editing
  const [memberToBeEditedId, setMemberToBeEditedId] = useState(null);

  // State to store _id of student to archive/unarchive
  const [deleteId, setDeleteId] = useState("");

  // State to store name of student to archive/unarchive
  const [deleteName, setDeleteName] = useState("");

  // State to handle archive/unarchive confirmation dialog open status
  const [deleteOpen, setDeleteOpen] = useState(false);

  // State to check if archive or unarchive
  const [archive, setArchive] = useState(true);

  // Function to edit student
  const editStudent = (_id) => {
    setMemberToBeEditedId(_id);
    setOpen(true);
  }

  // Async function to get exam cell member data 
  const getStudents = async () => {
    const { data } = await api.get("/exam_cell/student/");
    return data;
  }

  // useEffect hook to populate state on load
  useEffect(() => {
    let mounted = true;
    getStudents().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_STUDENTS',
          payload: data
        });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])

  // Table styles
  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      backgroundColor: '#eeeeee',
    },
    [`&.${tableCellClasses.body}`]: {
      // fontSize: 14,
    },
  }));

  return <>
    <DashboardHeader heading={"Manage Students"} backgroundColor={'#99EEB3'} />
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {
        loading ? <CircularProgress /> : <>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ flexGrow: 0, marginTop: 2, alignSelf: 'flex-end' }}
            onClick={() => setOpen(true)}
          >
            Add New Student
          </Button>
          {/* Active students */}
          <Box sx={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant='h5'>
              Active Students
            </Typography>
            {
              state.active.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No active students</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Adm. No.</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Branch</StyledTableCell>
                      <StyledTableCell>Class</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Ph. No.</StyledTableCell>
                      <StyledTableCell align="center">Edit</StyledTableCell>
                      <StyledTableCell align="center">Archive</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Map through array of active students */}
                    {
                      state.active.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell>{student.admissionNumber}</TableCell>
                          <TableCell>{[student.firstName, student.middleName, student.lastName].join(" ")}</TableCell>
                          <TableCell>{student.branch.name}</TableCell>
                          <TableCell>{[`Sem ${student.currentSemester}`, student.currentDivision].join(" - ")}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phoneNumber}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => editStudent(student._id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => {
                                setDeleteId(student._id)
                                setDeleteName(
                                  [student.firstName, student.middleName, student.lastName].join(" ")
                                )
                                setDeleteOpen(true)
                                setArchive(true)
                              }}
                            >
                              <ArchiveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            }
          </Box>

          {/* Archived students */}
          <Box sx={{ display: 'inline-flex', flexDirection: 'column', width: '100%', marginTop: 3 }}>
            <Typography variant='h5'>
              Archived Students
            </Typography>
            {
              state.archived.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No archived students</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Adm. No.</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Branch</StyledTableCell>
                      <StyledTableCell>Class</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Ph. No.</StyledTableCell>
                      <StyledTableCell align="center">Unarchive</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Map through array of active students */}
                    {
                      state.archived.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell>{student.admissionNumber}</TableCell>
                          <TableCell>{[student.firstName, student.middleName, student.lastName].join(" ")}</TableCell>
                          <TableCell>{student.branch.name}</TableCell>
                          <TableCell>{[`Sem ${student.currentSemester}`, student.currentDivision].join(" - ")}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phoneNumber}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => {
                                setDeleteId(student._id)
                                setDeleteName(
                                  [student.firstName, student.middleName, student.lastName].join(" ")
                                )
                                setDeleteOpen(true)
                                setArchive(false)
                              }}
                            >
                              <UnarchiveIcon
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            }
            <ArchiveUnarchiveStudent
              open={deleteOpen}
              setOpen={setDeleteOpen}
              name={deleteName}
              dispatch={dispatch}
              _id={deleteId}
              archive={archive}
            />
            <AddEditStudent
              open={open}
              setOpen={setOpen}
              dispatch={dispatch}
              setStudentToBeEdited={setMemberToBeEditedId}
              _id={memberToBeEditedId}
            />
          </Box>
        </>
      }
    </Box>
  </>
};

export default ManageStudent;
