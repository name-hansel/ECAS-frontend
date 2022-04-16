import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route } from "react-router-dom";

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

import Box from '@mui/material/Box';

// Pages
import Home from "./Home";
import ViewNotice from './ViewNotice';
import Query from './Query';
import MyQuery from './MyQuery';
import FAQ from './FAQ';

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
      text: "FAQ",
      icon: <LiveHelpIcon />,
      to: '/dashboard/faq'
    }, {
      text: "Query",
      icon: <QuestionAnswerIcon />,
      to: '/dashboard/query'
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
        <Route path="/notice/:_id" element={<ViewNotice />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/query" element={<Query />} />
        <Route path="/query/user" element={<MyQuery />} />
      </Routes>
    </Box>
  </Box>
}

export default StudentDashboard