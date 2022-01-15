import { useState } from "react"
import { Link } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

export default function Landing() {
  const [role, setRole] = useState(null);

  const getGoogleOAuthURL = () => {
    const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`
    const options = {
      redirect_uri: `${process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL}/${role}`,
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: 'code',
      prompt: 'consent',
      hd: "mes.ac.in",
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(" ")
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
  }

  return <>
    {/* THREE ICONS */}
    <button onClick={e => setRole("student")}>Student</button>
    <button onClick={e => setRole("exam_cell")}>Exam Cell</button>
    <button onClick={e => setRole("faculty")}>Faculty</button>
    {role ? <a href={getGoogleOAuthURL()}>Login with Google</a> : null}
    < Link component={RouterLink} to="/admin-login" variant="body1" >
      Admin Login
    </Link >
  </>
}