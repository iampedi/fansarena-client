// src/components/ProtectedRoutesAdmin.jsx
import useAuth from "@/hooks/useAuth";
import NotFoundPage from "@/pages/NotFound";
import Loader from "@/components/Loader";

const ProtectedRoutesAdmin = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (!user || !user.isAdmin) return <NotFoundPage />;

  return children;
};

export default ProtectedRoutesAdmin;
