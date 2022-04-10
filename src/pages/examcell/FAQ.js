import React from 'react';
import { useDispatch } from 'react-redux';

import DashboardHeader from "../../components/DashboardHeader";
import FAQTopic from "../../components/faq/exam_cell/FAQTopic";
import AddEditFAQTopic from "../../components/dialog/AddEditFAQTopic"

import api from "../../utils/api";
import { setSnackbar } from '../../redux/snackbar/snackbar.action';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';

const FAQ = () => {
  const reduxDispatch = useDispatch();

  // State to handle dialog box open status
  const [open, setOpen] = React.useState(false);

  // State to store which topic
  const [topicToBeEdited, setTopicToBeEdited] = React.useState(null);

  // Reducer for faqs (topic)
  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_FAQS':
        return action.payload
      case 'ADD_FAQ':
        return [...state, action.payload]
      case 'EDIT_FAQ':
        return state.map(faq => {
          if (faq._id === action.payload._id) return action.payload
          else return faq
        })
      case 'DELETE_FAQ':
        return state.filter(faq => faq._id !== action.payload)
      default:
        throw new Error();
    }
  }

  // State to handle loading
  const [loading, setLoading] = React.useState(true);

  // State containing notices already in database
  const [faqs, dispatch] = React.useReducer(reducer, []);

  const getFAQ = async () => {
    try {
      const { data } = await api.get(`/exam_cell/faq`);
      return data;
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", err.response.data.error));
      }
    }
  }

  const editTopic = async (_id) => {
    setOpen(true);
    setTopicToBeEdited(_id);
  }

  const deleteTopic = async (_id) => {
    try {
      await api.delete(`/exam_cell/faq/${_id}`);
      dispatch({
        type: 'DELETE_FAQ',
        payload: _id
      })
      reduxDispatch(setSnackbar(true, "success", "Deleted FAQ topic"));
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
        dispatch({
          type: 'LOAD_FAQS',
          payload: data
        });
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, [])

  return <>
    <DashboardHeader heading={'FAQ'} backgroundColor={'#DDEE66'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button onClick={() => setOpen(true)} variant="outlined" startIcon={<AddIcon />}>Add new FAQ topic</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {
        loading ? <CircularProgress /> : (
          faqs.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No FAQs found.</Typography> : faqs.map(faq => <FAQTopic deleteTopic={deleteTopic} editTopic={editTopic} faq={faq} key={faq._id} />)
        )
      }
    </Box>
    <AddEditFAQTopic
      open={open}
      setOpen={setOpen}
      dispatch={dispatch}
      setTopicToBeEdited={setTopicToBeEdited}
      _id={topicToBeEdited}
    />
  </>
}

export default FAQ