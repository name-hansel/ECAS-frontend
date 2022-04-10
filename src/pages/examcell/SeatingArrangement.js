import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

import DashboardHeader from "../../components/DashboardHeader";
import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';
import SeatingArrangementJob from '../../components/SeatingArrangementJob';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider'

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const SeatingArrangement = () => {
  const reduxDispatch = useDispatch();
  // State to track current SA (Seating arrangement) from database
  const [sa, setSA] = React.useState({
    complete: [],
    inProgress: []
  });

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
        setSA(data);
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
        getSeatingArrangements().then(data => setSA(data))
        console.log(sa)
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
                  sa.inProgress.length === 0 ? <Typography sx={{ color: '#dedede' }} textAlign="center" variant="subtitle2">
                    No seating arrangement generation in progress.
                  </Typography> :
                    <>
                      {

                        sa.inProgress.map(job => <SeatingArrangementJob sa={job} />)

                      }
                    </>
                }
              </Box>
            </Box>
            <Box sx={{ marginTop: 3 }}>
              <Typography variant="h5">
                Completed
              </Typography>
              <Divider />
              <Box sx={{ marginTop: 2 }}>
                {
                  sa.complete.length === 0 ? <Typography sx={{ color: '#dedede' }} textAlign="center" variant="subtitle2">
                    No seating arrangement generation completed.
                  </Typography> : <>
                    {
                      sa.complete.map(job => <SeatingArrangementJob sa={job} />)
                    }
                  </>
                }
              </Box>
            </Box>
          </>
      }
    </Box>
  </>
}

export default SeatingArrangement