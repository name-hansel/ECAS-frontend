import { useDispatch } from "react-redux"
import { Routes, Route } from "react-router-dom"

// Pages
import ExamCell from "./ExamCell"
import ChangePassword from "./ChangePassword"

// Components
import AdminSidebar from "../../components/AdminSidebar";

import { logout } from "../../redux/user/user.action"

export default function AdminDashboard() {
  const dispatch = useDispatch();
  return <>
    <AdminSidebar />
    <Routes>
      <Route path="/exam-cell" element={<ExamCell />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
    <button onClick={e => dispatch(logout())}>Logout</button>
  </>
}