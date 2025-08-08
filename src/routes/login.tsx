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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className="flex items-center justify-center mb-2">
            <CheckSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold ml-2">TaskBoard</span>
          </div>
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className={errors.username ? "border-destructive" : ""}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={errors.password ? "border-destructive" : "" }
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground mb-2">Demo credentials:</p>
            <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
              <p className="font-medium">Username: emilys</p>
              <p className="font-medium">Password: emilyspass</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
