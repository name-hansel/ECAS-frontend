import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route } from "react-router-dom";

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home'

import Box from '@mui/material/Box';

// Pages
import Home from "./Home"

// Components
import Sidebar from "../../components/Sidebar";

import { logout } from "../../redux/user/user.action"

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);

  return <Box sx={{ display: 'flex' }}>
    <Sidebar itemList={[{
      text: "Home",
      icon: <HomeIcon />,
      to: '/dashboard'
    }, {
      text: "Logout",
      icon: <LogoutIcon />,
      to: '',
      onClick: e => dispatch(logout())
    },
    ]} avatar={user.picture} name={[user.firstName, user.lastName].join(" ")} role={"Student"} />
    <Box
      component="main"
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Box>
  </Box>
}

export default StudentDashboard