// src/pages/auth/SignupPage.jsx
import { Link } from "react-router-dom";
import SignupForm from "@/components/SignupForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm px-5 md:max-w-3xl">
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SignupForm />

          <div className="hidden bg-[url('/images/signup-img.webp')] md:flex"></div>
        </CardContent>
      </Card>
      <Button variant="link" className="mx-auto mt-4 flex" asChild>
        <Link to={"/"}>
          <ArrowLeft /> Back to site
        </Link>
      </Button>
    </div>
  );
}
