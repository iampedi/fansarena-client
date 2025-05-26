// src/components/ProtectedLoginUser.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const ProtectedLoginUser = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("justLoggedIn");
    if (flag === "true") {
      setJustLoggedIn(true);
      sessionStorage.removeItem("justLoggedIn");
    }
  }, []);

  if (isLoading) return null;

  const isAuthPage = ["/auth/signin", "/auth/signup"].includes(
    location.pathname,
  );

  if (isLoggedIn && isAuthPage && !justLoggedIn) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedLoginUser;
