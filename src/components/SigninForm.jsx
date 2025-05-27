// src/components/SigninForm.jsx
import { API_URL } from "@/config/api";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { AuthContext } from "@/contexts/AuthContext";

// Form Schema
const signinSchema = z.object({
  email: z.string().min(7, "Enter your email.").email("Invalid email format."),
  password: z.string().min(1, "Enter your password."),
});

const SigninForm = () => {
  const [serverError, setServerError] = useState("");
  const { storeToken, authenticateUser } = useAuth(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
      storeToken(res.data.token);
      const user = await authenticateUser();
      const rawFrom = location.state?.from?.pathname;
      const from = rawFrom && rawFrom !== "/auth/signin" ? rawFrom : null;

      const isComplete = [
        "name",
        "email",
        "gender",
        "continent",
        "country",
        "city",
        "favoriteClub",
      ].every((field) => Boolean(user[field]));

      if (isComplete) {
        sessionStorage.setItem("justLoggedIn", "true");
        navigate(from || "/", { state: { message: "Login Successful." } });
      } else {
        navigate("/profile", {
          state: { message: "Please complete your profile." },
        });
      }
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
};

export default SigninForm;
