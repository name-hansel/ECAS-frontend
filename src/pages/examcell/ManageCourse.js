import React from "react";

import api from "../../utils/api"

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
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import DashboardHeader from "../../components/DashboardHeader"
import AddEditCourse from "../../components/dialog/AddEditCourse";
import ArchiveUnarchiveCourse from "../../components/dialog/ArchiveUnarchiveCourse";
const ManageCourse = () => {
  const [loading, setLoading] = React.useState(true);

  // State containing courses already in database
  const [state, dispatch] = React.useReducer(reducer, {
    active: [],
    archived: []
  });

  // Reducer for courses
  function reducer(state, action) {
    let course = null;

    switch (action.type) {
      case 'LOAD_COURSES':
        return action.payload
      case 'ADD_COURSE':
        return {
          archived: state.archived,
          active: [...state.active, action.payload]
        }
      case 'EDIT_COURSE':
        return {
          archived: state.archived,
          active: state.active.map(c => {
            if (c._id === action.payload._id) return action.payload
            else return c
          })
        }
      case 'ARCHIVE_COURSE':
        return {
          active: state.active.filter(c => {
            if (c._id !== action.payload) return true;
            course = c;
            return false
          }),
          archived: [...state.archived, course]
        }
      case 'UNARCHIVE_COURSE':
        return {
          archived: state.archived.filter(c => {
            if (c._id !== action.payload) return true;
            course = c;
            return false
          }),
          active: [...state.active, course]
        }
      default:
        throw new Error();
    }
  }

  // State to store which course we are editing
  const [courseToBeEditedId, setCourseToBeEditedId] = React.useState(null);

  // State to handle dialog box open status
  const [open, setOpen] = React.useState(false);

  // State to store _id of course to archive/unarchive
  const [deleteId, setDeleteId] = React.useState("");

  // State to store name of course to archive/unarchive
  const [deleteName, setDeleteName] = React.useState("");

  // State to handle archive/unarchive confirmation dialog open status
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // State to check if archive or unarchive
  const [archive, setArchive] = React.useState(true);

  // Function to edit course
  const editCourse = (_id) => {
    setCourseToBeEditedId(_id);
    setOpen(true);
  }

  // Async function to get course data 
  const getCourses = async () => {
    const { data } = await api.get("/exam_cell/course/");
    return data;
  }

  // useEffect hook to populate state on load
  React.useEffect(() => {
    let mounted = true;
    getCourses().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_COURSES',
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
    }
  }));

  return <>
    <DashboardHeader heading={"Manage Course"} backgroundColor={'#0A2B48'} />
    {
      <Box sx={{ display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {
          loading ? <CircularProgress /> :
            <>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{ flexGrow: 0, marginTop: 2, alignSelf: 'flex-end' }}
                onClick={() => setOpen(true)}
              >
                Add New Course
              </Button>
              {/* Active courses */}
              <Box sx={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant='h5'>
                  Active Courses
                </Typography>
                {
                  state.active.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No active courses</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Sr. No.</StyledTableCell>
                          <StyledTableCell>Code</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Semester</StyledTableCell>
                          <StyledTableCell>Branch</StyledTableCell>
                          <StyledTableCell align="center">Mandatory?</StyledTableCell>
                          <StyledTableCell align="center">Edit</StyledTableCell>
                          <StyledTableCell align="center">Archive</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map through array of active branches */}
                        {
                          state.active.map((course, index) => (
                            <TableRow key={course.code}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{course.code}</TableCell>
                              <TableCell>{course.name}</TableCell>
                              <TableCell>{course.semester}</TableCell>
                              <TableCell>{course.branch.name}</TableCell>
                              <TableCell align="center">{course.mandatory ? 'Mandatory' : 'Optional'}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => editCourse(course._id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => {
                                    setDeleteId(course._id)
                                    setDeleteName(course.name)
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
              {/* Archived branches */}
              <Box sx={{ display: 'inline-flex', flexDirection: 'column', width: '100%', marginTop: 3 }}>
                <Typography variant='h5'>
                  Archived Courses
                </Typography>
                {
                  state.archived.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No archived courses</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Sr. No.</StyledTableCell>
                          <StyledTableCell>Code</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Semester</StyledTableCell>
                          <StyledTableCell>Branch</StyledTableCell>
                          <StyledTableCell align="center">Mandatory?</StyledTableCell>
                          <StyledTableCell align="center">Unarchive</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map through array of archived courses */}
                        {
                          state.archived.map((course, index) => (
                            <TableRow key={course.code}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{course.code}</TableCell>
                              <TableCell>{course.name}</TableCell>
                              <TableCell>{course.semester}</TableCell>
                              <TableCell>{course.branch.name}</TableCell>
                              <TableCell align="center">{course.mandatory ? 'Mandatory' : 'Optional'}</TableCell>
                              <TableCell align="center">
                                <IconButton onClick={() => {
                                  setDeleteId(course._id)
                                  setDeleteName(course.name)
                                  setDeleteOpen(true)
                                  setArchive(false)
                                }}>
                                  <UnarchiveIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                }
                <AddEditCourse
                  open={open}
                  setOpen={setOpen}
                  dispatch={dispatch}
                  setCourseToBeEdited={setCourseToBeEditedId}
                  _id={courseToBeEditedId}
                />
                <ArchiveUnarchiveCourse
                  open={deleteOpen}
                  setOpen={setDeleteOpen}
                  name={deleteName}
                  dispatch={dispatch}
                  _id={deleteId}
                  archive={archive}
                />
              </Box>
            </>
        }
      </Box>
    }
  </>
};

export default ManageCourse;
