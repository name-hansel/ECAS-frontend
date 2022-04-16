import React from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';

import DeleteQuery from '../../components/dialog/DeleteQuery';
import DashboardHeader from "../../components/DashboardHeader";

import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import QueryItem from '../../components/query/student/QueryItem';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MyQuery = () => {
  const reduxDispatch = useDispatch();

  // Delete confirmation dialog
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  // Delete id for dialog
  const [idDelete, setIdDelete] = React.useState(null);

  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_QUERIES':
        return action.payload;
      case 'ADD_QUERY':
        return [...state, action.payload]
      case 'DELETE_QUERY':
        return state.filter(sa => sa._id !== action.payload)
      default:
        throw new Error();
    }
  }

  const [loading, setLoading] = React.useState(true);
  const [state, dispatch] = React.useReducer(reducer, []);

  const getQuery = async () => {
    try {
      const { data } = await api.get(`/student/query/user`);
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
    getQuery().then(data => {
      if (mounted) {
        dispatch({
          type: 'LOAD_QUERIES',
          payload: data
        })
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])

  return <>
    <DashboardHeader heading={'My Queries'} backgroundColor={'#BBFF00'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'../query'} variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mx: 2 }} >Back</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5">My Queries</Typography>
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        {
          loading ? <CircularProgress /> : (
            state.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2, color: 'gray' }}>No queries found.</Typography> : state.map(query => <QueryItem query={query} key={query._id} setDeleteOpen={setDeleteOpen} setIdDelete={setIdDelete} />)
          )
        }
      </Box>
    </Box>
    <DeleteQuery
      open={deleteOpen}
      setOpen={setDeleteOpen}
      dispatch={dispatch}
      _id={idDelete}
    />
  </>
}

export default MyQuery