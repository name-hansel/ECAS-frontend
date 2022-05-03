import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route } from "react-router-dom";

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';

import Box from '@mui/material/Box';

// Components
import Sidebar from "../../components/Sidebar";
import { logout } from "../../redux/user/user.action";

import Home from "./Home";
import Quiz from "./Quiz";
import AddQuiz from './AddQuiz';

const FacultyDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user);

  return <Box sx={{ display: 'flex' }}>
    <Sidebar itemList={[{
      text: "Home",
      icon: <HomeIcon />,
      to: '/dashboard'
    }, {
      text: "Quiz",
      icon: <QuizIcon />,
      to: '/dashboard/quiz'
    }, {
      text: "Logout",
      icon: <LogoutIcon />,
      to: '',
      onClick: e => dispatch(logout())
    },
    ]} avatar={user.picture} name={[user.firstName, user.lastName].join(" ")} role={"Faculty"} />
    <Box
      component="main"
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/add" element={<AddQuiz />} />
      </Routes>
    </Box>
  </Box>
}

export default FacultyDashboard