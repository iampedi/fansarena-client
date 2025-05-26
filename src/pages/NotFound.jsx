import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

// src/pages/NotFound.jsx
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="flex items-center gap-4 text-3xl font-bold">
          Page Not Found
        </h1>

        <img src="/images/not-found-page.webp" className="w-72" />
        <Button onClick={() => navigate("/")}>
          <HomeIcon /> Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
