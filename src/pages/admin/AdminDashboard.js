import { useDispatch } from "react-redux"
import { Routes, Route, useNavigate } from "react-router-dom"
import Box from '@mui/material/Box';

// Icons
import GroupIcon from '@mui/icons-material/Group';
import PasswordIcon from '@mui/icons-material/Password';
import LogoutIcon from '@mui/icons-material/Logout';

// Pages
import ExamCell from "./ExamCell"
import ChangePassword from "./ChangePassword"

// Components
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header"

import { logout } from "../../redux/user/user.action"

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return <Box sx={{ display: 'flex' }}>
    <Sidebar itemList={[
      {
        text: "Exam Cell",
        icon: <GroupIcon />,
        onClick: () => navigate("./exam-cell")
      },
      {
        text: "Change Password",
        icon: <PasswordIcon />,
        onClick: () => navigate("./change-password")
      }, {
        text: "Logout",
        icon: <LogoutIcon />,
        onClick: e => dispatch(logout())
      }
    ]} name={"Admin"} avatar={""} />
    <Box
      component="main"
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}
    >
      {/* <Header /> */}
      <Box>
        <Routes>
          <Route path="/" element={<ExamCell />} />
          <Route path="/exam-cell" element={<ExamCell />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </Box>
    </Box>
  </Box>
}