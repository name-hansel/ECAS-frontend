import React from 'react';

import { getFormattedDate } from "../utils/format"

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';

const SeatingArrangementJob = ({ sa }) => {
  return <Card variant="outlined" sx={{ p: 2, paddingBottom: 1, paddingTop: 1.5, marginBottom: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <Typography variant="h6">{sa.title}</Typography>
      <Typography variant="subtitle1">Exam Date: {getFormattedDate(sa.dateOfExam)}</Typography>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        !sa.complete ? <Typography sx={{ color: 'gray' }}>In progress</Typography> : sa.failed ? <Typography sx={{ color: 'red' }}>Failed</Typography> : <Typography sx={{ color: 'green' }}>Completed</Typography>
      }
      <IconButton sx={{ marginLeft: 2 }}>
        <DeleteIcon />
      </IconButton>
    </div>
  </Card>
}

export default SeatingArrangementJob