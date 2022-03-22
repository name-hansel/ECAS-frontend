import React from 'react'

import { Box, CircularProgress } from "@mui/material"
import Typography from '@mui/material/Typography'

import StudentNoticeCard from '../../components/StudentNoticeCard'
import DashboardHeader from "../../components/DashboardHeader"
import api from "../../utils/api"

const Home = () => {
  // State containing notices already in database
  const [notices, setNotices] = React.useState([]);

  // State to track if data is loading
  const [loading, setLoading] = React.useState(true);

  // Function to get all notices
  const getNotices = async () => {
    const { data } = await api.get("/student/notice");
    return data;
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
    <DashboardHeader heading={'Home'} backgroundColor={'#88AAD3'} />
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