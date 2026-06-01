import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useAuthModal } from "../context/AuthModalContext";

const ProtectedRoute = () => {
  const { token } = useAuth();
  const { handleLoginModal } = useAuthModal();

   useEffect(() => {
    if (!token) {
       handleLoginModal();
    }
  }, [token, handleLoginModal]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />; // renders child routes
};

export default ProtectedRoute;