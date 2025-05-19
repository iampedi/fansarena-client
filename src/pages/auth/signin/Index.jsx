import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import SigninForm from "@/components/SigninForm";

export default function SigninPage({ className, ...props }) {
  return (
    <div className={cn("w-full max-w-sm md:max-w-3xl", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SigninForm />

          <div className="hidden bg-[url('/images/signin-img.webp')] md:flex"></div>
        </CardContent>
      </Card>
    </div>
  );
}
