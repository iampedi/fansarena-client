// src/components/AuthButton.jsx
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";

export default function AuthButton() {
  const { logOut } = useAuth();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/", { state: { message: "Logout Successful." } });
  };

  return isLoggedIn ? (
    <TooltipWrapper tooltip={"Sign Out"}>
      <Button size={"icon"} onClick={handleLogout}>
        <LogOutIcon />
      </Button>
    </TooltipWrapper>
  ) : (
    <TooltipWrapper tooltip={"Sign In"}>
      <Button size={"icon"} onClick={() => navigate("/auth/signin")}>
        <LogInIcon />
      </Button>
    </TooltipWrapper>
  );
}
