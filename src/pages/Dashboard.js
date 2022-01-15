import { useSelector } from "react-redux"

import AdminDashboard from "./admin/AdminDashboard"
import ExamCellDashboard from "./examcell/ExamCellDashboard"

export default function Dashboard() {
  const userState = useSelector(state => state.userState)

  if (userState.user.role === "admin") return <AdminDashboard />
  if (userState.user.role === "exam_cell") return <ExamCellDashboard />
}