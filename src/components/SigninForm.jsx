import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function SigninForm() {
  return (
    <form className="p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="mb-4 flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-muted-foreground text-balance">
            to your Fans Arene account.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/signup"
            className="underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}
