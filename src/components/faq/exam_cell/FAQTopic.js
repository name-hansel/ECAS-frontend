import React from 'react'

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

// Accordion
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const FAQTopic = ({ faq, deleteTopic, editTopic }) => {
  return <Card variant="outlined" sx={{ p: 2, marginBottom: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h5">{faq.topic}</Typography>
      <Stack direction="row" spacing={1}>
        <IconButton aria-label="add">
          <AddIcon />
        </IconButton>
        <IconButton aria-label="edit" onClick={() => editTopic(faq._id)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => deleteTopic(faq._id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {
        faq.questionAndAnswers.length === 0 ? <Typography variant='subtitle2' sx={{ margin: '0 auto', marginTop: 2 }}>No questions found in this topic.</Typography> : faq.questionAndAnswers.map((qna, index) => <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            <Typography variant="subtitle1">{qna.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2">
              {qna.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
        )
      }
    </Box>
  </Card>
}

export default FAQTopic