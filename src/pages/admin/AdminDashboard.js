import { useDispatch } from "react-redux"

import { logout } from "../../redux/user/user.action"

export default function AdminDashboard() {
  const dispatch = useDispatch();
  return <>
    <h1>Hello admin</h1>
    <button onClick={e => dispatch(logout())}>Logout</button>
  </>
}