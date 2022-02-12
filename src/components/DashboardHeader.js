import React from 'react'
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';

const DashboardHeader = ({ heading, backgroundColor }) => {
  return (
    <Paper elevation={1} style={{
      backgroundColor
    }}>
      <Typography variant="h5" style={{
        textAlign: "right",
        margin: '80px 20px 10px 60px',
        color: 'white'
      }}>{heading}</Typography>
    </Paper >
  )
}

export default DashboardHeader