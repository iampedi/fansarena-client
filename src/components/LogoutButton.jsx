// src/components/LogoutButton.jsx
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  return <Button onClick={handleLogout}>Log out</Button>;
}
