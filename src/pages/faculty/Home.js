import React from 'react'
import { useDispatch } from 'react-redux';

import { Box, CircularProgress } from "@mui/material"
import Typography from '@mui/material/Typography'

import StudentNoticeCard from '../../components/StudentNoticeCard'
import DashboardHeader from "../../components/DashboardHeader"
import api from "../../utils/api"
import { setSnackbar } from '../../redux/snackbar/snackbar.action'

const Home = () => {
  const reduxDispatch = useDispatch();

  // State containing notices already in database
  const [notices, setNotices] = React.useState([]);

  // State to track if data is loading
  const [loading, setLoading] = React.useState(true);

  // Function to get all notices
  const getNotices = async () => {
    try {
      const { data } = await api.get("/faculty/notice");
      return data;
    } catch (err) {
      setLoading(false);
      reduxDispatch(setSnackbar(true, "error", err.response.data.error));
    }
  }

  // useEffect hook to populate state on load
  React.useEffect(() => {
    let mounted = true;
    getNotices().then(data => {
      if (mounted) {
        setNotices([...data]);
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])

  return <>
    <DashboardHeader heading={'Home'} backgroundColor={'#006400'} />
    <Box sx={{ marginTop: 2 }}>
      {
        loading ? <CircularProgress /> : (
          notices.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No announcements found.</Typography> : notices.map((notice) => <StudentNoticeCard
            key={notice._id}
            notice={notice}
          />)
        )
      }
    </Box>
  </>
}

export default Home