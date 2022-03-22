import React from 'react'
import { Link } from "react-router-dom"

import api from "../../utils/api"

import DashboardHeader from "../../components/DashboardHeader"
import NoticeCard from '../../components/NoticeCard'

// MUI components
import { Box, CircularProgress } from "@mui/material"
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add';

const Home = () => {
  // Reducer for notices
  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_NOTICES':
        return action.payload
      case 'ADD_BRANCH':
        return [...state, action.payload]
      case 'EDIT_NOTICE':
        return state.map(notice => {
          if (notice._id === action.payload._id) return action.payload
          else return notice
        })
      case 'DELETE_NOTICE':
        return state.filter(notice => notice._id !== action.payload)
      default:
        throw new Error();
    }
  }

  // State containing notices already in database
  const [state, dispatch] = React.useReducer(reducer, []);

  // State to track if data is loading
  const [loading, setLoading] = React.useState(true);

  // Function to get all notices
  const getNotices = async () => {
    const { data } = await api.get("/exam_cell/notice/");
    return data;
  }

  // useEffect hook to populate state on load
  React.useEffect(() => {
    let mounted = true;
    getNotices().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_NOTICES',
          payload: data
        });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])

  return <>
    <DashboardHeader heading={'Home'} backgroundColor={'#88AAD3'} />
    {/* Button to add new notice, search, filter */}
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'./notice/add'} variant="outlined" startIcon={<AddIcon />}>Add new announcement</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {
        loading ? <CircularProgress /> : (
          state.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No announcements found.</Typography> : state.map((notice) => <NoticeCard
            notice={notice}
            dispatch={dispatch}
            key={notice._id}
          />)
        )
      }
    </Box>
  </>
}

export default Home