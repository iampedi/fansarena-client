// src/components/LogoutButton.jsx
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton({ icon }) {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  return icon ? (
    <Button onClick={handleLogout}>
      <LogOutIcon />
    </Button>
  ) : (
    <Button onClick={handleLogout}>Log out</Button>
  );
}
