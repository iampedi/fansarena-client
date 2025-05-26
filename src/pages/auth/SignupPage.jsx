import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import SignupForm from "@/components/SignupForm";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage({ className, ...props }) {
  return (
    <div
      className={cn("w-full max-w-sm px-5 md:max-w-3xl xl:px-0", className)}
      {...props}
    >
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
