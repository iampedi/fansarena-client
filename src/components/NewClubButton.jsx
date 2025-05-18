import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function NewClubButton() {
  const navigate = useNavigate();
  return <Button onClick={() => navigate("/admin/clubs/new")}>New Club</Button>;
}
