import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function SignupForm() {
  return (
    <form className="p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="mb-4 flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-muted-foreground text-balance">
            your Fans Arena account.
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="What we can call you?"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <div className="text-center text-sm">
          Do you have an account?{" "}
          <Link
            to="/auth/signin"
            className="underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}
