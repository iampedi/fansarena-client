// src/components/SignupForm.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/config/api";
import useAuth from "@/hooks/useAuth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.string().email("Invalid email format."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/\d/, "Password must contain at least one number."),
});

export default function SignupForm() {
  const { storeToken, authenticateUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  /* ---------- Define Form ---------- */
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  /* ---------- Submit Form ---------- */
  const onSubmit = async (values) => {
    setServerError("");
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong.");
        return;
      }

      storeToken(data.token);
      await authenticateUser();
      navigate("/profile", {
        state: { message: "User Created Successfully." },
      });
    } catch (err) {
      setServerError("Network error. Please try again.");
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-6 md:p-10"
      >
        <div className="mb-4 flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="text-muted-foreground text-balance">
            your Fans Arena account.
          </p>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="What we can call you?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Server error */}
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        {/* Submit button */}
        <Button type="submit" className="w-full">
          Sign Up
        </Button>

        {/* Login link */}
        <div className="text-center text-sm">
          Do you have an account?{" "}
          <Link
            to="/auth/signin"
            className="underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}
