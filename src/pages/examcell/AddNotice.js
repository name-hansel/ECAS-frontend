import React from 'react'
import { Link } from "react-router-dom"

import DashboardHeader from '../../components/DashboardHeader'
import Editor from "../../components/Editor"

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';

import HomeIcon from '@mui/icons-material/Home';

const AddNotice = () => {
  return <>
    <DashboardHeader heading={'Add Notice'} backgroundColor={'#BBDBF2'} />
    <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row-reverse' }}>
      <Button component={Link} to={'..'} variant="outlined" startIcon={<HomeIcon />}>Home</Button>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      {/* For description */}
      <Editor />
    </Box>
  </>
}

export default AddNotice