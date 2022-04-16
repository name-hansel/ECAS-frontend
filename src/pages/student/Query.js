import React from 'react';
import { useDispatch } from 'react-redux';

import DashboardHeader from "../../components/DashboardHeader";
import AddQuery from '../../components/dialog/AddQuery';
import DeleteQuery from '../../components/dialog/DeleteQuery';

import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import QueryItem from '../../components/query/student/QueryItem';

import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

const Query = () => {
  const reduxDispatch = useDispatch();
  // Add query dialog
  const [open, setOpen] = React.useState(false);
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
      const { data } = await api.get(`/student/query`);
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
    <DashboardHeader heading={'Query'} backgroundColor={'#EECC66'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button variant="outlined" onClick={() => setOpen(true)} startIcon={<AddIcon />}>Ask query</Button>
      <Button variant="outlined" startIcon={<PersonIcon />} sx={{ mx: 2 }} >My Queries</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5">All queries</Typography>
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        {
          loading ? <CircularProgress /> : (
            state.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2, color: 'gray' }}>No queries found.</Typography> : state.map(query => <QueryItem query={query} key={query._id} setDeleteOpen={setDeleteOpen} setIdDelete={setIdDelete} />)
          )
        }
      </Box>
    </Box>
    <AddQuery
      open={open}
      setOpen={setOpen}
      dispatch={dispatch}
    />
    <DeleteQuery
      open={deleteOpen}
      setOpen={setDeleteOpen}
      dispatch={dispatch}
      _id={idDelete}
    />
  </>
}

export default Query