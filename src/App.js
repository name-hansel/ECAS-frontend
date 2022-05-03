import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

// Actions
import { loadUser } from "./redux/user/user.action"

// Components
import Snackbar from "./components/Snackbar"
import RequireAuth from "./components/routing/RequireAuth"

// Pages
import Landing from "./pages/Landing"
import AdminLogin from "./pages/admin/AdminLogin"
import Dashboard from "./pages/Dashboard"

export default function App() {
  const userState = useSelector((state) => state.userState)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser())
  }, [])

  if (userState.loading) return <CircularProgress style={{
    position: 'absolute',
    height: '100px',
    width: '100px',
    top: '50%',
    left: '50%',
    marginLeft: '-50px',
    marginTop: '-50px',
  }} />

  return (
    <>
      <Snackbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/dashboard/*"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )

}
