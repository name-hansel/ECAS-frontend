import { useDispatch } from "react-redux"

import { logout } from "../../redux/user/user.action"

export default function ExamCellDashboard() {
  const dispatch = useDispatch();
  return <>
    <h1>Examcell</h1>
    <button onClick={e => dispatch(logout())}>Logout</button>
  </>
}