import React from 'react';
import { useDispatch } from 'react-redux';

import DashboardHeader from "../../components/DashboardHeader";
import QueryItem from "../../components/query/exam_cell/QueryItem";
import DeleteQuery from "../../components/query/exam_cell/DeleteQuery";
import AnswerQuery from "../../components/query/exam_cell/AnswerQuery";

import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

const Query = () => {
  const reduxDispatch = useDispatch();
  // Dialog for answering query
  const [open, setOpen] = React.useState(false);
  // Which query to be answered
  const [_id, setIdToBeAnswered] = React.useState(null);

  // Delete confirmation dialog
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  // Delete id for dialog
  const [idDelete, setIdDelete] = React.useState(null);

  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_QUERIES':
        return action.payload;
      case 'ADD_QUERY':
        return [action.payload, ...state]
      case 'DELETE_QUERY':
        return state.filter(q => q._id !== action.payload)
      // Used when answering / editing answer
      case 'EDIT_QUERY':
        return state.map(q => q._id == action.payload._id ? { ...q, 'answer': action.payload.answer } : q)
      default:
        throw new Error();
    }
  }

  const [loading, setLoading] = React.useState(true);
  const [state, dispatch] = React.useReducer(reducer, []);

  const getQuery = async () => {
    try {
      const { data } = await api.get(`/exam_cell/query`);
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

  const answerQuery = (_id) => {
    setOpen(true);
    setIdToBeAnswered(_id);
  }

  return <>
    <DashboardHeader heading={'Query'} backgroundColor={'#BBFF00'} />
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5">All Queries</Typography>
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        {
          loading ? <CircularProgress /> : (
            state.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2, color: 'gray' }}>No queries found.</Typography> : state.map(query => <QueryItem query={query} key={query._id} setDeleteOpen={setDeleteOpen} setIdDelete={setIdDelete} answerQuery={answerQuery} />)
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
    <AnswerQuery
      open={open}
      dispatch={dispatch}
      setOpen={setOpen}
      _id={_id}
      setIdToBeAnswered={setIdToBeAnswered}
    />
  </>
}

export default Query