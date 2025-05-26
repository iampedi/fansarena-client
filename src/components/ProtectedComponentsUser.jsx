// src/components/ProtectedComponentsUser.jsx
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";
import Protected from "@/pages/Protected";

const ProtectedComponentsUser = ({ children }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Protected />;
  }

  return children;
};

export default ProtectedComponentsUser;
