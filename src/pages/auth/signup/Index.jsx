import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import SignupForm from "@/components/SignupForm";

export default function SignupPage({ className, ...props }) {
  return (
    <div className={cn("w-full max-w-sm md:max-w-3xl", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SignupForm />

          <div className="hidden bg-[url('/images/signup-img.webp')] md:flex"></div>
        </CardContent>
      </Card>
    </div>
  );
}
