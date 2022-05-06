import React from 'react'
import { styled } from '@mui/system';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import DownloadIcon from '@mui/icons-material/Download';

const ModifiedPaper = styled(Paper)({
  padding: 6,
  paddingLeft: 8,
  paddingRight: 8,
  marginRight: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const QuizItem = ({ quiz }) => {
  return <Card variant="outlined" sx={{ p: 2, paddingTop: 1.5, paddingBottom: 1.5, marginBottom: 3 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h6">{quiz.title}</Typography>
        <Typography variant="subtitle1">Course: {quiz.course.name}</Typography>
        <Typography variant="subtitle2">Faculty: {`${quiz.faculty.firstName} ${quiz.faculty.lastName}`}</Typography>
      </Box>
      <Link href={`${process.env.REACT_APP_BASE_URL}/api/public/quiz/${quiz.resultFile}`} underline="hover" target="_blank" rel="noreferrer">
        <ModifiedPaper sx={{ px: 3 }} variant="outlined" elevation={0}>
          <DownloadIcon sx={{ marginRight: 1 }} />
          <Typography variant="subtitle1">Download Result</Typography>
        </ModifiedPaper>
      </Link>
    </Box>
  </Card>
}

export default QuizItem