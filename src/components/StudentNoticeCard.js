import React from 'react'

import AttachmentItems from './AttachmentItems';

import { getFormattedTime } from '../utils/format'

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const StudentNoticeCard = ({ notice }) => {
  // Get notice details
  const { title, description, branch, year, createdAt, updatedAt, attachments
  } = notice;

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
      </Box>
    </Card>
  )
}

export default StudentNoticeCard