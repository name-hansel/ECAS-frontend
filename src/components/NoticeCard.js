import React from 'react'

import AttachmentItems from './AttachmentItems';
import DeleteNotice from './dialog/DeleteNotice';

import { getFormattedTime } from '../utils/format'

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NoticeCard = ({ notice, dispatch }) => {
  // Get notice details
  const { _id, title, description, branch, year, createdAt, updatedAt, attachments
  } = notice;

  // State to store open status of delete dialog
  const [open, setOpen] = React.useState(false);

  return (
    <Card variant="outlined" sx={{ p: 2, marginBottom: 3 }}>
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
          <Box sx={{ paddingTop: 2, display: 'flex', paddingBottom: 2 }}>
            {
              attachments.length > 0 && attachments.map(fileName => <AttachmentItems fileName={fileName} key={fileName} />)
            }
          </Box>
          <Divider />
        </> : <></>
      }
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 1 }}>
        <Box>
          <Typography>
            {`For Years: ${year.length > 0 ? year.join(', ') : 'All'}`}
          </Typography>
          <Typography>
            {
              `For Branches: ${branch.length > 0 ? branch.map(b => b.name).join(', ') : 'All'}`
            }
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignSelf: 'center', width: '10%' }}>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton onClick={e => setOpen(true)} >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <DeleteNotice open={open} setOpen={setOpen} dispatch={dispatch} _id={_id} />
    </Card>
  )
}

export default NoticeCard