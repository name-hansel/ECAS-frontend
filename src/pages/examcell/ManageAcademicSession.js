import * as React from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

const ManageAcademicSession = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <DashboardHeader
        heading={'Manage Academic Session'}
        backgroundColor={'#99EED3'}
      />
      <div style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h3>Current Academic Year: 2021-2022</h3>
        <h3>Current Academic Term: Even</h3>

        <div style={{ paddingTop: '10vh' }}>
          <Button
            variant='contained'
            onClick={handleClickOpen}
            color='success'
            size='medium'
          >
            Add New Session
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Session</DialogTitle>

            <DialogContent>
              <Box
                component='form'
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete='off'
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div>
                    <DatePicker
                      views={['year']}
                      label='From'
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                    />

                    <DatePicker
                      views={['year']}
                      label='To'
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} helperText={null} />
                      )}
                    />
                  </div>
                </LocalizationProvider>

                <FormControl>
                  <FormLabel id='demo-row-radio-buttons-group-label'>
                    Session
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby='demo-row-radio-buttons-group-label'
                    name='row-radio-buttons-group'
                  >
                    <FormControlLabel
                      value='Odd'
                      control={<Radio />}
                      label='Odd'
                    />
                    <FormControlLabel
                      value='Even'
                      control={<Radio />}
                      label='Even'
                      style={{ paddingLeft: '10vh' }}
                    />
                  </RadioGroup>
                </FormControl>

                <div>
                  <FormControl>
                    <FormLabel id='demo-row-radio-buttons-group-label'>
                      Current
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby='demo-row-radio-buttons-group-label'
                      name='row-radio-buttons-group'
                    >
                      <FormControlLabel
                        value='Yes'
                        control={<Radio />}
                        label='Yes'
                      />
                      <FormControlLabel
                        value='No'
                        control={<Radio />}
                        label='No'
                        style={{ paddingLeft: '11vh' }}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Save</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ManageAcademicSession;
