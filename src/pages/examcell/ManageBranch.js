import DashboardHeader from '../../components/DashboardHeader';
import { useState, useEffect, useReducer } from 'react';
import api from '../../utils/api';

import AddEditExamCell from '../../components/dialog/AddEditExamCell';
import DeleteExamCell from '../../components/dialog/DeleteExamCell';

// MUI components
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import CircularProgress from '@mui/material/CircularProgress';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

const ManageBranch = () => {
  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: 'bold',
      backgroundColor: '#eeeeee',
    },
    [`&.${tableCellClasses.body}`]: {
      // fontSize: 14,
    },
  }));
  // State to handle dialog box open status
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <DashboardHeader heading={'Manage Branch'} backgroundColor={'#88EED3'} />

      <Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          sx={{ flexGrow: 0, marginTop: 2 }}
          onClick={() => setOpen(true)}
        >
          Add New Branch
        </Button>
        <Typography
          variant='h7'
          style={{
            color: 'black',
          }}
        >
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogContent sx={{ p: 5 }}>
              <TextField
                autoFocus
                margin='dense'
                id='code'
                label='Branch Code'
                type='text'
                variant='standard'
              />
              <br />
              <TextField
                autoFocus
                margin='dense'
                id='code'
                label='Branch '
                type='text'
                variant='standard'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Add</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
          <h3>Active Branches</h3>
          <TableContainer sx={{ marginTop: 2 }}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Branch Code</StyledTableCell>
                  <StyledTableCell>Branch</StyledTableCell>
                  <StyledTableCell align='center'>Edit</StyledTableCell>
                  <StyledTableCell align='center'>Archive</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>123</TableCell>
                  <TableCell>Computer</TableCell>
                  <TableCell align='center'>
                    <EditIcon />
                  </TableCell>
                  <TableCell align='center'>
                    <ArchiveIcon />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <h3>Archived Branches</h3>
          <TableContainer sx={{ marginTop: 2 }}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Branch Code</StyledTableCell>
                  <StyledTableCell>Branch</StyledTableCell>
                  <StyledTableCell align='center'>Edit</StyledTableCell>
                  <StyledTableCell align='center'>Unarchive</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>123</TableCell>
                  <TableCell>Computer</TableCell>
                  <TableCell align='center'>
                    <EditIcon />
                  </TableCell>
                  <TableCell align='center'>
                    <UnarchiveIcon />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>
      </Box>
    </>
  );
};

export default ManageBranch;
