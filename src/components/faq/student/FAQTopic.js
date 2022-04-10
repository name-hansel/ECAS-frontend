import React from 'react'

// MUI components
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Accordion
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQTopic = ({ faq }) => {
  return <Card variant="outlined" sx={{ p: 2, marginBottom: 3 }}>
    <Typography variant="h4" textAlign="center">{faq.topic}</Typography>
    <Box sx={{ marginTop: 2 }}>
      {
        faq.questionAndAnswers.map((qna, index) => <Accordion>
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