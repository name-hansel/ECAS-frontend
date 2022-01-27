import { useSelector, useDispatch } from "react-redux"
import { Link } from '@mui/material';
import { Link as RouterLink, Navigate, useSearchParams } from "react-router-dom";

import { setSnackbar } from "../redux/snackbar/snackbar.action"

export default function Landing() {
  const userState = useSelector(state => state.userState);
  const dispatch = useDispatch();

  // Check if error is present in query
  const [searchParams] = useSearchParams();
  if (searchParams.get("error")) dispatch(setSnackbar(true, "error", searchParams.get("error")))

  if (userState.isAuthenticated) return <Navigate to="/dashboard" />

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

  return <>
    <h5>Login with Google as -</h5>
    <a href={getGoogleOAuthURL("student")}>Student</a><br />
    <a href={getGoogleOAuthURL("exam_cell")}>ExamCell</a><br />
    <a href={getGoogleOAuthURL("faculty")}>Faculty</a>
    <br />
    <Link component={RouterLink} to="/admin-login" variant="body1" >
      Admin Login
    </Link >
  </>
}