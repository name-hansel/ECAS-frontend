import { useState, useEffect, useReducer } from "react"
import api from "../../utils/api"

import DashboardHeader from "../../components/DashboardHeader"
import AddEditBranch from "../../components/dialog/AddEditBranch";
import ArchiveUnarchiveBranch from "../../components/dialog/ArchiveUnarchiveBranch";

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

const ManageBranch = () => {
  // State containing branches already in database
  const [state, dispatch] = useReducer(reducer, {
    active: [],
    archived: []
  });

  // Reducer for branches
  function reducer(state, action) {
    let branch = null;

    switch (action.type) {
      case 'LOAD_BRANCHES':
        return action.payload
      case 'ADD_BRANCH':
        return {
          archived: state.archived,
          active: [...state.active, action.payload]
        }
      case 'EDIT_BRANCH':
        return {
          archived: state.archived,
          active: state.active.map(b => {
            if (b._id === action.payload._id) return action.payload
            else return b
          })
        }
      case 'ARCHIVE_BRANCH':
        return {
          active: state.active.filter(b => {
            if (b._id !== action.payload) return true;
            branch = b;
            return false
          }),
          archived: [...state.archived, branch]
        }
      case 'UNARCHIVE_BRANCH':
        return {
          archived: state.archived.filter(b => {
            if (b._id !== action.payload) return true;
            branch = b;
            return false
          }),
          active: [...state.active, branch]
        }
      default:
        throw new Error();
    }
  }

  // State to store which member we are editing
  const [memberToBeEditedId, setMemberToBeEditedId] = useState(null);

  // State to handle dialog box open status
  const [open, setOpen] = useState(false);

  // Set loading to true to show spinner
  // False once data is fetched
  const [loading, setLoading] = useState(true);

  // State to store _id of branch to archive/unarchive
  const [deleteId, setDeleteId] = useState("");

  // State to store name of branch to archive/unarchive
  const [deleteName, setDeleteName] = useState("");

  // State to handle archive/unarchive confirmation dialog open status
  const [deleteOpen, setDeleteOpen] = useState(false);

  // State to check if archive or unarchive
  const [archive, setArchive] = useState(true);

  // Function to edit branch
  const editBranch = (_id) => {
    setMemberToBeEditedId(_id);
    setOpen(true);
  }

  // Async function to get branch data 
  const getBranches = async () => {
    const { data } = await api.get("/exam_cell/branch/");
    return data;
  }

  // useEffect hook to populate state on load
  useEffect(() => {
    let mounted = true;
    getBranches().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_BRANCHES',
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

  return (
    <>
      <DashboardHeader heading={'Manage Branch'} backgroundColor={'#88EED3'} />
      {
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {
            loading ? <CircularProgress /> :
              <>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ flexGrow: 0, marginTop: 2, alignSelf: 'flex-end' }}
                  onClick={() => setOpen(true)}>
                  Add New Branch
                </Button>
                {/* Active branches */}
                <Box sx={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>
                  <Typography variant='h5'>
                    Active Branches
                  </Typography>
                  {
                    state.active.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No active branches</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Sr. No.</StyledTableCell>
                            <StyledTableCell>Code</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                            <StyledTableCell align="center">Archive</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Map through array of active branches */}
                          {
                            state.active.map((branch, index) => (
                              <TableRow key={branch.code}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{branch.code}</TableCell>
                                <TableCell>{branch.name}</TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => editBranch(branch._id)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setDeleteId(branch._id)
                                      setDeleteName(branch.name)
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
                    Archived Branches
                  </Typography>
                  {
                    state.archived.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No archived branches</Typography> : <TableContainer sx={{ marginTop: 2, width: '100%' }}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Sr. No.</StyledTableCell>
                            <StyledTableCell>Code</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="center">Unarchive</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Map through array of active branches */}
                          {
                            state.archived.map((branch, index) => (
                              <TableRow key={branch.code}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{branch.code}</TableCell>
                                <TableCell>{branch.name}</TableCell>
                                <TableCell align="center">
                                  <IconButton onClick={() => {
                                    setDeleteId(branch._id)
                                    setDeleteName(branch.name)
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
                  <ArchiveUnarchiveBranch
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    name={deleteName}
                    dispatch={dispatch}
                    _id={deleteId}
                    archive={archive}
                  />
                  <AddEditBranch
                    open={open}
                    setOpen={setOpen}
                    dispatch={dispatch}
                    setBranchToBeEdited={setMemberToBeEditedId}
                    _id={memberToBeEditedId}
                  />
                </Box>
              </>
          }
        </Box>
      }
    </>
  );
};

export default ManageBranch;
