// src/components/ProtectedComponentsUser.jsx
import useAuth from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
// UI Imports
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";

const ProtectedComponentsUser = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto flex w-2/3 flex-col items-center justify-center gap-6">
        <p className="text-center text-xl">
          You must be logged in to access this page.
        </p>
        <Button
          onClick={() =>
            navigate("/auth/signin", {
              state: { from: location },
              replace: true,
            })
          }
        >
          <LogInIcon /> Sign In
        </Button>
      </div>
    );
  }

  return children;
};

export default ProtectedComponentsUser;
