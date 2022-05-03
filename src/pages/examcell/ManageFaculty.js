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
import AddEditFaculty from "../../components/dialog/AddEditFaculty";
import ArchiveUnarchiveFaculty from "../../components/dialog/ArchiveUnarchiveFaculty";

const ManageFaculty = () => {
  const [loading, setLoading] = React.useState(true);

  // State containing faculty already in database
  const [state, dispatch] = React.useReducer(reducer, {
    active: [],
    archived: []
  });

  // Reducer for faculty
  function reducer(state, action) {
    let faculty = null;

    switch (action.type) {
      case 'LOAD_FACULTY':
        return action.payload
      case 'ADD_FACULTY':
        return {
          archived: state.archived,
          active: [...state.active, action.payload]
        }
      case 'EDIT_FACULTY':
        return {
          archived: state.archived,
          active: state.active.map(f => {
            if (f._id === action.payload._id) return action.payload
            else return f
          })
        }
      case 'ARCHIVE_FACULTY':
        return {
          active: state.active.filter(f => {
            if (f._id !== action.payload) return true;
            faculty = f;
            return false
          }),
          archived: [...state.archived, faculty]
        }
      case 'UNARCHIVE_FACULTY':
        return {
          archived: state.archived.filter(c => {
            if (c._id !== action.payload) return true;
            faculty = c;
            return false
          }),
          active: [...state.active, faculty]
        }
      default:
        throw new Error();
    }
  }

  // State to store which faculty we are editing
  const [facultyToBeEditedId, setFacultyToBeEditedId] = React.useState(null);

  // State to handle dialog box open status
  const [open, setOpen] = React.useState(false);

  // State to store _id of faculty to archive/unarchive
  const [deleteId, setDeleteId] = React.useState("");

  // State to store name of faculty to archive/unarchive
  const [deleteName, setDeleteName] = React.useState("");

  // State to handle archive/unarchive confirmation dialog open status
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  // State to check if archive or unarchive
  const [archive, setArchive] = React.useState(true);

  // Function to edit faculty
  const editFaculty = (_id) => {
    setFacultyToBeEditedId(_id);
    setOpen(true);
  }

  // Async function to get faculty data 
  const getFaculty = async () => {
    const { data } = await api.get("/exam_cell/faculty/");
    return data;
  }

  // useEffect hook to populate state on load
  React.useEffect(() => {
    let mounted = true;
    getFaculty().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_FACULTY',
          payload: data
        });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, []);

  // Table styles
  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      backgroundColor: '#eeeeee',
    }
  }));

  return <>
    <DashboardHeader heading={"Manage Faculty"} backgroundColor={'#77AAB3'} />
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
                Add New Faculty
              </Button>
              {/* Active faculty */}
              <Box sx={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>
                <Typography variant='h5'>
                  Active Faculty
                </Typography>
                {
                  state.active.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No active faculty</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Sr. No.</StyledTableCell>
                          <StyledTableCell>Emp. No.</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Email</StyledTableCell>
                          <StyledTableCell>Department</StyledTableCell>
                          <StyledTableCell align="center">Edit</StyledTableCell>
                          <StyledTableCell align="center">Archive</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map through array of active faculty */}
                        {
                          state.active.map((faculty, index) => (
                            <TableRow key={faculty._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{faculty.employeeId}</TableCell>
                              <TableCell>{[faculty.firstName, faculty.lastName].join(" ")}</TableCell>
                              <TableCell>{faculty.email}</TableCell>
                              <TableCell>{faculty.department}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => editFaculty(faculty._id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => {
                                    setDeleteId(faculty._id)
                                    setDeleteName(
                                      [faculty.firstName, faculty.middleName, faculty.lastName].join(" ")
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
              {/* Archived faculty */}
              <Box sx={{ display: 'inline-flex', flexDirection: 'column', width: '100%', marginTop: 3 }}>
                <Typography variant='h5'>
                  Archived Faculty
                </Typography>
                {
                  state.archived.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No archived faculty</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Sr. No.</StyledTableCell>
                          <StyledTableCell>Emp. No.</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Email</StyledTableCell>
                          <StyledTableCell>Department</StyledTableCell>
                          <StyledTableCell align="center">Unarchive</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Map through array of active students */}
                        {
                          state.archived.map((faculty, index) => (
                            <TableRow key={faculty._id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{faculty.employeeId}</TableCell>
                              <TableCell>{[faculty.firstName, faculty.lastName].join(" ")}</TableCell>
                              <TableCell>{faculty.email}</TableCell>
                              <TableCell>{faculty.department}</TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => {
                                    setDeleteId(faculty._id)
                                    setDeleteName(
                                      [faculty.firstName, faculty.middleName, faculty.lastName].join(" ")
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
                <AddEditFaculty
                  open={open}
                  setOpen={setOpen}
                  dispatch={dispatch}
                  setFacultyToBeEdited={setFacultyToBeEditedId}
                  _id={facultyToBeEditedId}
                />
                <ArchiveUnarchiveFaculty
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

export default ManageFaculty;
