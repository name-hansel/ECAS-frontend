import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from "react-router-dom";

import api from "../../utils/api";
import { getFormattedTime, isSendEmailInOver } from '../../utils/format'
import { setSnackbar } from '../../redux/snackbar/snackbar.action';
import DashboardHeader from "../../components/DashboardHeader";
import AttachmentItems from '../../components/AttachmentItems';

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CircularProgress } from "@mui/material";

// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewNotice = () => {
  const params = useParams();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const _id = params._id;

  // State to handle loading
  const [loading, setLoading] = React.useState(true);

  // State to handle notice data
  const [notice, setNotice] = React.useState({});

  // State to store open status of delete dialog
  const [open, setOpen] = React.useState(false);

  const { title, description, branch, year, createdAt, updatedAt, attachments, sendNotification, sendEmailIn
  } = notice;

  const getTimeDifferenceInMinutes = () => {
    const timeNow = Date.parse(new Date());
    const noticeCreatedAt = Date.parse(createdAt);
    const differenceInMinutes = (timeNow - noticeCreatedAt) / (1000 * 60);
    return differenceInMinutes > sendEmailIn ? 'Emails have been sent and the notice is visible to students.' : 'Emails not sent yet and the notice is not visible to students.'
  }

  const getNotice = async () => {
    try {
      const { data } = await api.get(`/exam_cell/notice/${_id}`);
      return data;
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", 'Notice not found'));
        navigate('..');
      }
    }
  }

  const deleteNotice = async () => {
    try {
      await api.delete(`/exam_cell/notice/${_id}`);
      setOpen(false)
      reduxDispatch(setSnackbar(true, "success", "Deleted notice successfully!"))
      navigate('..');
    } catch (err) {
      reduxDispatch(setSnackbar(true, "error", err.response.data.error));
      setOpen(false)
    }
  }

  React.useState(() => {
    let mounted = true;
    getNotice().then(data => {
      if (mounted) {
        setNotice({ ...data })
        setLoading(false);
      }
    })
    return () => mounted = false;
  }, []);

  return <>
    <DashboardHeader heading={'View Notice'} backgroundColor={'#AA22BB'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'..'} variant="outlined" startIcon={<HomeIcon />}>Home</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {
        loading ? <CircularProgress /> : <Card variant="outlined" sx={{ p: 2, paddingBottom: 1, paddingTop: 1.5, marginBottom: 3 }}>
          {/* TITLE */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4">
              {title}
            </Typography>
            <Box sx={{ m: 1, textAlign: 'right' }}>
              <Typography variant="subtitle2">
                {`Posted ${getFormattedTime(createdAt)}`}
              </Typography>
              {
                updatedAt !== createdAt ? <Typography variant="subtitle2">
                  {`Updated ${getFormattedTime(updatedAt)}`}
                </Typography> : <></>
              }
            </Box>
          </Box>
          <Divider />
          {/* DESCRIPTION */}
          {
            description && description.length > 0 ? <>
              <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Typography variant="body1" align="justify">
                  {description}
                </Typography>
              </Box>
              <Divider />
            </> : <></>
          }
          {/* ATTACHMENTS */}
          {
            attachments && attachments.length > 0 ? <>
              <Box sx={{ paddingTop: 2, display: 'flex', paddingBottom: 2, flexWrap: 'wrap' }}>
                {
                  attachments.length > 0 && attachments.map(fileName => <AttachmentItems fileName={fileName} key={fileName} />)
                }
              </Box>
              <Divider />
            </> : <></>
          }
          <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1, paddingBottom: 1 }}>
            <Box>
              <Typography>
                {`For Year: ${year.length > 0 ? year.join(', ') : 'All'}`}
              </Typography>
              <Typography>
                {
                  `For Branches: ${branch.length > 0 ? branch.map(b => b.name).join(', ') : 'All'}`
                }
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignSelf: 'center', width: '10%' }}>
              {
                (!sendNotification || !isSendEmailInOver(createdAt, sendEmailIn)) ? <>
                  <IconButton
                  //onClick={() => navigate(`./notice/${_id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={e => setOpen(true)} >
                    <DeleteIcon />
                  </IconButton>
                </> : <></>
              }
            </Box>
          </Box>
          {
            sendNotification && <><Divider />
              <Box sx={{ paddingTop: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'gray' }}>{getTimeDifferenceInMinutes()}</Typography>
              </Box>
            </>
          }
        </Card>
      }
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Notice
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to remove this notice?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>No</Button>
          <Button variant="outlined" onClick={deleteNotice} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  </>
}

export default ViewNotice