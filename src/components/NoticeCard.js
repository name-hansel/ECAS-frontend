import React from 'react'
import { useNavigate } from "react-router-dom";

import AttachmentItems from './AttachmentItems';

import { getFormattedTime, isSendEmailInOver } from '../utils/format'

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const NoticeCard = ({ notice, setOpen, open, setId }) => {
  // Get notice details
  const { _id, title, description, branch, year, createdAt, updatedAt, attachments, sendNotification, sendEmailIn
  } = notice;
  const navigate = useNavigate();

  const getTimeDifferenceInMinutes = () => {
    const timeNow = Date.parse(new Date());
    const noticeCreatedAt = Date.parse(createdAt);
    const differenceInMinutes = (timeNow - noticeCreatedAt) / (1000 * 60);
    return differenceInMinutes > sendEmailIn ? 'Emails have been sent and the notice is visible to students.' : 'Emails not sent yet and the notice is not visible to students.'
  }

  return (
    <Card variant="outlined" sx={{ p: 2, paddingBottom: 1, paddingTop: 1.5, marginBottom: 3 }}>
      {/* TITLE */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ cursor: 'pointer' }} variant="h4" onClick={() => navigate(`./notice/${_id}`)}>
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
        {
          (!sendNotification || !isSendEmailInOver(createdAt, sendEmailIn)) ? <>
            <IconButton onClick={e => {
              setId(_id)
              setOpen(true)
            }} >
              <DeleteIcon />
            </IconButton>
          </> : <></>
        }
      </Box>
      {
        sendNotification && <><Divider />
          <Box sx={{ paddingTop: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'gray' }}>{getTimeDifferenceInMinutes()}</Typography>
          </Box>
        </>
      }
    </Card>
  )
}

export default NoticeCard