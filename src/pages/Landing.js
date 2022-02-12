import { useSelector, useDispatch } from "react-redux"
import { Navigate, useSearchParams, useNavigate } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CoPresentIcon from '@mui/icons-material/CoPresent';

import Header from '../components/Header';
import './LoginCard.css';
import { setSnackbar } from "../redux/snackbar/snackbar.action"

export default function Landing() {
  const userState = useSelector(state => state.userState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if error is present in query
  const [searchParams] = useSearchParams();

  // Check if user is already logged in/authenticated
  // If yes, redirect to dashboard
  if (userState.isAuthenticated) return <Navigate to="/dashboard" />

  // Check search params for error
  // If error is present, show snackbar alert
  const error = searchParams.get("error")
  if (error && error === "user_not_found") dispatch(setSnackbar(true, "error", "User with associated email address not found"))

  // Form Google OAuth URL for different roles
  // For student, only `student.mes.ac.in` domain is allowed
  // For faculty and exam cell, `mes.ac.in` domain is allowed
  const getGoogleOAuthURL = (role) => {
    const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`
    const hd = role === "student" ? "student.mes.ac.in" : "mes.ac.in"
    const options = {
      redirect_uri: `${process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL}/${role}`,
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: 'code',
      prompt: 'consent',
      hd,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(" ")
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
  }

  const iconDivStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }

  return <Box
    component="main"
    sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}
  >
    <Header />
    <Typography variant="h5" style={{ textAlign: 'center' }}>
      Login with MES account as...
    </Typography>
    {/* Box containing icons and labels */}
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', margin: '8% 10%' }}>
      {/* Student */}
      <a href={getGoogleOAuthURL("student")}>
        <div className="icon-text" style={iconDivStyles}>
          <SchoolIcon
            className='btn'
            sx={{ fontSize: 100 }}
            style={{ cursor: 'pointer' }}
          />
          <Typography variant="h5">Student</Typography>
        </div>
      </a>
      {/* Exam Cell */}
      <a href={getGoogleOAuthURL("exam_cell")}>
        <div className="icon-text" style={iconDivStyles}>
          <ApartmentIcon
            className='btn'
            sx={{ fontSize: 100 }}
            style={{ cursor: 'pointer' }}
          />
          <Typography variant="h5">Exam Cell</Typography>
        </div>
      </a>
      {/* Faculty */}
      <a href={getGoogleOAuthURL("faculty")}>
        <div className="icon-text" style={iconDivStyles}>
          <CoPresentIcon
            className='btn'
            sx={{ fontSize: 100 }}
            style={{ cursor: 'pointer' }}
          />
          <Typography variant="h5">Faculty</Typography>
        </div>
      </a>
    </Box>
    {/* Admin login button */}
    <Button
      variant='contained'
      color='success'
      size='large'
      startIcon={<AdminPanelSettingsIcon />}
      style={{ position: 'absolute', bottom: '20px', right: '20px' }}
      onClick={() => navigate("/admin-login")}
    >
      Admin Login
    </Button>
  </Box>
}