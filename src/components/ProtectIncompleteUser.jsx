// src/components/ProtectedIncompletesUser.jsx
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { Button } from "./ui/button";
import { UserRoundPenIcon } from "lucide-react";

const ProtectedIncompletesUser = ({ children }) => {
  const { user, isLoggedIn, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  const isProfileComplete =
    isLoggedIn &&
    user &&
    user.name &&
    user.email &&
    user.gender &&
    user.continent &&
    user.country &&
    user.city &&
    user.favoriteClubs;

  if (!isProfileComplete) {
    return (
      <div className="mx-auto flex w-2/3 flex-col items-center justify-center gap-6">
        <p className="text-center text-xl">
          You need to complete your profile and choose your favorite club to
          access this page.
        </p>
        <Button onClick={() => navigate("/profile")}>
          <UserRoundPenIcon /> Go To Profile
        </Button>
      </div>
    );
  }

  return children;
};

export default ProtectedIncompletesUser;
