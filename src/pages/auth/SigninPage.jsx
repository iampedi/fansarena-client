// src/pages/auth/SigninPage.jsx
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

import SigninForm from "@/components/SigninForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const SigninPage = ({ className, ...props }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
    }
  }, [location]);

  return (
    <div className={cn("w-full max-w-sm md:max-w-3xl", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SigninForm />

          <div className="hidden bg-[url('/images/signin-img.webp')] md:flex"></div>
        </CardContent>
      </Card>
      <Button variant="link" className="mx-auto mt-4 flex" asChild>
        <Link to={"/"}>
          <ArrowLeft /> Back to site
        </Link>
      </Button>
    </div>
  );
};

export default SigninPage;
