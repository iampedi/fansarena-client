// src/components/SigninForm.jsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/config/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

// Form Schema
const signinSchema = z.object({
  email: z.string().min(7, "Enter your email.").email("Invalid email format."),
  password: z.string().min(1, "Enter your password."),
});

export default function SigninForm() {
  const [serverError, setServerError] = useState("");
  const { storeToken, authenticateUser } = useAuth();
  const navigate = useNavigate();

  // Form
  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit
  const onSubmit = async (values) => {
    setServerError("");

    try {
      const res = await axios.post(`${API_URL}/auth/signin`, values);
      const data = res.data;

      storeToken(data.token);
      await authenticateUser();
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.error || "Network error. Please try again.",
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-6 md:p-10"
      >
        <div className="mb-4 flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-muted-foreground text-balance">
            to your Fans Arena account.
          </p>
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
          Sign In
        </Button>

        {/* Login link */}
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/signup"
            className="underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
