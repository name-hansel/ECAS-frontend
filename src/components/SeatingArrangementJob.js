import React from 'react';

import { getFormattedDate } from "../utils/format";

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

const SeatingArrangementJob = ({ sa, setId, setOpen }) => {
  return <Card variant="outlined" sx={{ p: 2, paddingBottom: 1, paddingTop: 1.5, marginBottom: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <Typography variant="h6">{sa.title}</Typography>
      <Typography variant="subtitle1">Exam Date: {getFormattedDate(sa.dateOfExam)}</Typography>
      <Typography variant="subtitle1">{
        !sa.complete && !sa.failed ? <Typography sx={{ color: 'gray' }}>In progress</Typography> : sa.failed ? <Typography sx={{ color: 'red' }}>Failed</Typography> : <Stack direction="row" spacing={2}>
          <Typography sx={{ color: 'green', marginTop: '2px' }}>Completed</Typography>
          {/* Download seating arrangement */}
          <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/seating/${sa.solutionFile}`} target="_blank" rel="noreferrer">
            Download
          </Link>
        </Stack>
      }</Typography>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>

      <Button sx={{ marginLeft: 2 }} variant="outlined">View Details</Button>
      {
        sa.complete || sa.failed ? <IconButton onClick={() => {
          setId(sa._id)
          setOpen(true)
        }} sx={{ marginLeft: 2 }}>
          <DeleteIcon />
        </IconButton> : <IconButton onClick={() => {
          setId(sa._id)
          setOpen(true)
        }} sx={{ marginLeft: 2 }}>
          <CancelIcon />
        </IconButton>
      }
    </div>
  </Card>
}

export default SeatingArrangementJob