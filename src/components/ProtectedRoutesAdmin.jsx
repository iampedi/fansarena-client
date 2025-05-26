// src/components/ProtectedRoutesAdmin.jsx
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import NotFoundPage from "@/pages/NotFound";

const ProtectedRoutesAdmin = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Loading...</div>;
  if (!user || !user.isAdmin) return <NotFoundPage />;

  return children;
};

export default ProtectedRoutesAdmin;
