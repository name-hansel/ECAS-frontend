import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom"

export default function RequireAuth({ children, role }) {
  const userState = useSelector((state) => state.userState)

  return userState.isAuthenticated ? children : <Navigate to="/" replace />;
}