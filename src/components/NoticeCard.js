import React from 'react'

import AttachmentItems from './AttachmentItems';

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const NoticeCard = ({ title, description, branch, semester }) => {
  return (
    <Card variant="outlined" sx={{ p: 2, marginBottom: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          {title}
        </Typography>
        <Typography variant="subtitle2">
          09:00AM, 13 March 2022
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <Typography variant="body1">
          {description}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ paddingTop: 2, display: 'flex', paddingBottom: 2 }}>
        <AttachmentItems />
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 2 }}>
        <Box>
          <Typography>
            {`For Semesters: ${semester.length > 0 ? semester.join(', ') : 'All'}`}
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
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  )
}

export default NoticeCard