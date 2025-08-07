import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type RootState } from "../store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, CheckSquare } from "lucide-react";
import { useLoginMutation } from "../store/api/authApi";
import { setCredentials } from "../store/slices/authSlice";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    const state = context.store.getState() as RootState;
    if (state.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: LoginPage,
});

interface LoginForm {
  username: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: {
            id: result.id,
            username: result.username,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            image: result.image,
          },
          token: result.accessToken,
        })
      );

      navigate({ to: "/" });
    } catch (err: any) {
      setError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckSquare className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              TaskBoard
            </span>
          </div>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                className="bg-none"
              />
              {errors.username && (
                <p className="text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Demo credentials:</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
              Username: emilys
              <br />
              Password: emilyspass
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
