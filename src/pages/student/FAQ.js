import React from 'react';
import { useDispatch } from 'react-redux';

import DashboardHeader from "../../components/DashboardHeader";
import FAQTopic from "../../components/faq/student/FAQTopic"

import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const FAQ = () => {
  const reduxDispatch = useDispatch();
  // State to handle loading
  const [loading, setLoading] = React.useState(true);

  // State to handle faq data
  const [faqs, setFAQ] = React.useState([]);

  const getFAQ = async () => {
    try {
      const { data } = await api.get(`/student/faq`);
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
    getFAQ().then(data => {
      if (mounted) {
        setFAQ([...data]);
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])

  return <>
    <DashboardHeader heading={'FAQ'} backgroundColor={'#DDEE66'} />
    <Box sx={{ marginTop: 2 }}>
      {
        loading ? <CircularProgress /> : (
          faqs.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No FAQs found.</Typography> : faqs.map(faq => <FAQTopic faq={faq} key={faq._id} />)
        )
      }
    </Box>
  </>
}

export default FAQ