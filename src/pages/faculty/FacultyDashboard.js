import React from 'react'
import { useDispatch } from "react-redux"

import { logout } from "../../redux/user/user.action"

const FacultyDashboard = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={e => dispatch(logout())}>Logout</button>
    </div>
  )
}

export default FacultyDashboard