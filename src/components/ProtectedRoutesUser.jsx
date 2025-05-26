// src/components/ProtectedRoutesUser.jsx
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoutesUser = ({ children }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/signin" replace />;
  }

  return children;
};

export default ProtectedRoutesUser;
