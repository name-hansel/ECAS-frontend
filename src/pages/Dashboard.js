import { useSelector } from "react-redux"

import AdminDashboard from "./admin/AdminDashboard"
import ExamCellDashboard from "./examcell/ExamCellDashboard"
import StudentDashboard from "./student/StudentDashboard"
import FacultyDashboard from "./faculty/FacultyDashboard"

export default function Dashboard() {
  const userState = useSelector(state => state.userState)

  if (userState.user.role === "admin") return <AdminDashboard />
  if (userState.user.role === "exam_cell") return <ExamCellDashboard />
  if (userState.user.role === "student") return <StudentDashboard />
  if (userState.user.role === "faculty") return <FacultyDashboard />
}