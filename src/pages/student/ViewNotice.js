import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from "react-router-dom";

import DashboardHeader from "../../components/DashboardHeader";
import AttachmentItems from '../../components/AttachmentItems';

import api from "../../utils/api";
import { getFormattedTime } from '../../utils/format'
import { setSnackbar } from '../../redux/snackbar/snackbar.action';

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CircularProgress } from "@mui/material";

import HomeIcon from '@mui/icons-material/Home';

const ViewNotice = () => {
  const params = useParams();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const _id = params._id;

  // State to handle loading
  const [loading, setLoading] = React.useState(true);

  // State to handle notice data
  const [notice, setNotice] = React.useState({});

  const { title, description, branch, year, createdAt, updatedAt, attachments
  } = notice;

  const getNotice = async () => {
    try {
      const { data } = await api.get(`/student/notice/${_id}`);
      return data;
    } catch (err) {
      if (err.response) {
        reduxDispatch(setSnackbar(true, "error", 'Notice not found'));
        navigate('..');
      }
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
          </Box>
        </Card>
      }
    </Box>
  </>
}

export default ViewNotice