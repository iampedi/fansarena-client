// src/components/ProtectedRoutesAdmin.jsx
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import NotFoundPage from "@/pages/NotFound";
import Loader from "./Loader";

const ProtectedRoutesAdmin = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loader />;

  if (!user || !user.isAdmin) return <NotFoundPage />;

  return children;
};

export default ProtectedRoutesAdmin;
