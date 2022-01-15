import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Navigate } from "react-router-dom";

import Landing from "./pages/Landing"
import { loadUser } from "./redux/user/user.action"

export default function App() {
  const userState = useSelector((state) => state.userState)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser())
  }, [])

  if (userState.loading) return <h1>Loading</h1>

  return userState.isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />;
}
