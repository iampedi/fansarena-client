// src/pages/auth/SigninPage.jsx
import { Link } from "react-router-dom";

import SigninForm from "@/components/SigninForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const SigninPage = () => {
  return (
    <div className="w-full max-w-sm px-5 md:max-w-3xl">
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SigninForm />

          <div className="hidden bg-[url('/images/signin-img.webp')] bg-cover bg-center md:flex"></div>
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
