import React from 'react';

import { getFormattedDate } from "../../../utils/format";
import semesterYearMapping from '../../../utils/semester';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const QueryItem = ({ query, setDeleteOpen, setIdDelete, answerQuery }) => {
  const askedByName = [query.askedBy.firstName, query.askedBy.lastName].join(" ")
  const askedByDetails = [semesterYearMapping[query.askedBy.currentSemester - 1], query.askedBy.branch.name].join(" - ");

  return <Card sx={{ my: 1.5 }} elevation={0} variant="outlined">
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <CardContent sx={{ display: 'flex', pb: query.answer ? 0 : 2 }}>
        <Avatar sx={{ width: 64, height: 64 }}>{`${query.askedBy.firstName[0] + query.askedBy.lastName[0]}`}</Avatar>
        <Box sx={{ marginLeft: 2 }}>
          <Typography variant="h6">{query.question}</Typography>
          <Typography sx={{ color: 'gray' }} variant="caption">{`Asked on: ${getFormattedDate(query.createdAt)}`}</Typography>
          <Typography sx={{ color: 'gray' }} variant="caption" display="block">{`Asked by: ${askedByName} (${askedByDetails})`}</Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ mx: 1 }}>
        <Button variant="outlined" onClick={() => {
          answerQuery(query._id)
        }}>
          {
            query.answer ? "Edit answer" : "Answer"
          }
        </Button>
        <IconButton onClick={() => {
          setDeleteOpen(true);
          setIdDelete(query._id);
        }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Box>
    {
      query.answer && <CardContent sx={{ mb: 0, pb: 0, mx: 1 }}>
        <Typography textAlign="justify" variant="body1">{query.answer}</Typography>
      </CardContent>
    }
  </Card>
}

export default QueryItem