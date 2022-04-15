import React from 'react';
import { styled } from '@mui/system';

import { getFormattedDate } from "../utils/format";

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const ModifiedPaper = styled(Paper)({
  padding: 6,
  paddingLeft: 8,
  paddingRight: 8,
  marginRight: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const SeatingArrangementJob = ({ sa, setId, setOpen }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return <Card variant="outlined" sx={{ p: 2, paddingTop: 1.5, paddingBottom: 1.5, marginBottom: 3 }}>
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: showDetails ? 1 : 0 }}>
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
        <Button sx={{ marginLeft: 2 }} variant="outlined" onClick={() => setShowDetails(!showDetails)}>{
          showDetails ? "Hide Details" : "Show details"
        }</Button>
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
    </Box>
    {
      showDetails ? <>
        <Divider />
        <Box sx={{ display: 'flex', marginTop: 2 }}>
          <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/seating/${sa.studentFile}`} underline="hover" target="_blank" rel="noreferrer">
            <ModifiedPaper variant="outlined" elevation={0}>
              <PersonIcon sx={{ marginRight: 1 }} />
              <Typography variant="subtitle1">{sa.studentFile}</Typography>
            </ModifiedPaper>
          </Link>
          <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/seating/${sa.courseFile}`} underline="hover" target="_blank" rel="noreferrer">
            <ModifiedPaper variant="outlined" elevation={0}>
              <BookIcon sx={{ marginRight: 1 }} />
              <Typography variant="subtitle1">{sa.courseFile}</Typography>
            </ModifiedPaper>
          </Link>
          <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/seating/${sa.roomFile}`} underline="hover" target="_blank" rel="noreferrer">
            <ModifiedPaper variant="outlined" elevation={0}>
              <MeetingRoomIcon sx={{ marginRight: 1 }} />
              <Typography variant="subtitle1">{sa.roomFile}</Typography>
            </ModifiedPaper>
          </Link>
        </Box>
      </> : null
    }
  </Card>
}

export default SeatingArrangementJob