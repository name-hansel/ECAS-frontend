import { useDispatch, useSelector } from "react-redux"
import { Box } from "@mui/material"
import { Routes, Route } from "react-router-dom";

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import ClassIcon from '@mui/icons-material/Class';
import ApartmentIcon from "@mui/icons-material/Apartment";
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home'

// Pages
import Home from "./Home"
import ManageBranch from "./ManageBranch"
import ManageCourse from "./ManageCourse"
import ManageFaculty from "./ManageFaculty"
import ManageStudent from "./ManageStudent"
import AddNotice from "./AddNotice";
import ViewNotice from "./ViewNotice"
// import EditNotice from "./EditNotice";

// Components
import Sidebar from "../../components/Sidebar";

import { logout } from "../../redux/user/user.action"

export default function ExamCellDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState.user)

  return <Box sx={{ display: 'flex' }}>
    <Sidebar itemList={[{
      text: "Home",
      icon: <HomeIcon />,
      to: '/dashboard'
    }, {
      text: "Branch",
      icon: <MergeTypeIcon />,
      to: '/dashboard/branch'
    }, {
      text: "Course",
      icon: <ClassIcon />,
      to: '/dashboard/course'
    }, {
      text: "Student",
      icon: <SchoolIcon />,
      to: '/dashboard/student'
    }, {
      text: "Faculty",
      icon: <ApartmentIcon />,
      to: '/dashboard/faculty'
    }, {
      text: "Logout",
      icon: <LogoutIcon />,
      to: '',
      onClick: e => dispatch(logout())
    },
    ]} avatar={user.picture} name={[user.firstName, user.lastName].join(" ")} role={"Exam Cell"} />
    <Box
      component="main"
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/notice/:_id/edit" element={<EditNotice />} /> */}
        <Route path="/notice/:_id" element={<ViewNotice />} />
        <Route path="/notice/add" element={<AddNotice />} />
        <Route path="/branch" element={<ManageBranch />} />
        <Route path="/course" element={<ManageCourse />} />
        <Route path="/faculty" element={<ManageFaculty />} />
        <Route path="/student" element={<ManageStudent />} />
      </Routes>
    </Box>
  </Box>
}