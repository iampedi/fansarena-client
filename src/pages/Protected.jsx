import { Button } from "@/components/ui/button";
import { SignInIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

// src/pages/Protected.jsx
const Protected = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-2/3 flex-col items-center justify-center gap-6">
      <p className="text-center text-xl">
        You must be logged in to access this page.
      </p>
      <Button onClick={() => navigate("/auth/signin")}>
        <SignInIcon /> Sign In
      </Button>
    </div>
  );
};

export default Protected;
