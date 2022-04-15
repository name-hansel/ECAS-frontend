import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

import DashboardHeader from "../../components/DashboardHeader";
import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';
import SeatingArrangementJob from '../../components/SeatingArrangementJob';
import DeleteSA from '../../components/dialog/DeleteSA';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider'

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const SeatingArrangement = () => {
  const reduxDispatch = useDispatch();

  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_SA':
        return action.payload
      case 'ADD_SA':
        return [...state, action.payload]
      case 'DELETE_SA':
        return state.filter(sa => sa._id !== action.payload)
      default:
        throw new Error();
    }
  }

  // _id for delete dialog
  const [id, setId] = React.useState(null);

  // State for opening/closing delete dialog
  const [open, setOpen] = React.useState(false);

  // State containing notices already in database
  const [state, dispatch] = React.useReducer(reducer, []);

  // State to track if data is loading
  const [loading, setLoading] = React.useState(true);

  const getSeatingArrangements = async () => {
    try {
      const { data } = await api.get("/exam_cell/seating");
      return data;
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error));
      }
    }
  }

  // useEffect hook to populate state on load
  React.useEffect(() => {
    let mounted = true;
    getSeatingArrangements().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_SA',
          payload: data
        });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])


  return <>
    <DashboardHeader heading="Seating Arrangement" backgroundColor={'#eeaa66'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'./add'} variant="outlined" startIcon={<AddIcon />}>Generate Seating Arrangement</Button>
      <Button variant="outlined" sx={{ marginRight: 2 }} startIcon={<RefreshIcon />} onClick={() => {
        // Get data again
        getSeatingArrangements().then(data => {
          dispatch({
            type: 'LOAD_SA',
            payload: data
          })
        })
      }}>Refresh</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {
        loading ? <CircularProgress /> :
          <>
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="h5">
                In Progress
              </Typography>
              <Divider />
              <Box sx={{ marginTop: 2 }} >
                {
                  state.filter(sa => !sa.complete && !sa.failed).length === 0 ? <Typography sx={{ color: '#dedede' }} textAlign="center" variant="subtitle2">
                    No seating arrangement generation in progress.
                  </Typography> :
                    <>
                      {
                        state.filter(sa => !sa.complete && !sa.failed).map(job => <SeatingArrangementJob sa={job} setId={setId} setOpen={setOpen} />)
                      }
                    </>
                }
              </Box>
            </Box>
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h5">
                Finished
              </Typography>
              <Divider />
              <Box sx={{ marginTop: 2 }}>
                {
                  state.filter(sa => sa.complete || sa.failed).length === 0 ? <Typography sx={{ color: '#dedede' }} textAlign="center" variant="subtitle2">
                    No seating arrangement generation completed.
                  </Typography> : <>
                    {
                      state.filter(sa => sa.complete || sa.failed).map(job => <SeatingArrangementJob sa={job} setId={setId} setOpen={setOpen} />)
                    }
                  </>
                }
              </Box>
            </Box>
          </>
      }
    </Box>
    <DeleteSA
      open={open}
      setOpen={setOpen}
      dispatch={dispatch}
      _id={id}
    />
  </>
}

export default SeatingArrangement