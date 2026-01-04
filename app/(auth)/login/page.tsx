"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  identifier: z.string().min(1, "이메일 또는 사용자명을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일/사용자명 또는 비밀번호가 올바르지 않습니다");
      } else {
        // Fetch session to get user role for proper redirect
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/projects");
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <>
      {/* Logo / Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 dark:bg-white/5">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-2 font-display">
          Novel Writer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-sans">
          Welcome back to your workspace.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Identifier Field (Email or Username) */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="identifier"
            className="text-slate-900 dark:text-white text-sm font-medium"
          >
            이메일 또는 사용자명
          </Label>
          <div className="relative">
            <Input
              id="identifier"
              type="text"
              placeholder="이메일 또는 사용자명 입력"
              className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2533] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3.5 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 shadow-sm h-auto"
              {...register("identifier")}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          {errors.identifier && (
            <p className="text-red-500 text-xs">{errors.identifier.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="password"
              className="text-slate-900 dark:text-white text-sm font-medium"
            >
              Password
            </Label>
            <Link
              href="#"
              className="text-primary text-xs font-sans font-medium hover:underline hover:text-blue-400 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2533] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3.5 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 shadow-sm h-auto"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center transition-colors"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-lg bg-primary hover:bg-blue-600 text-white font-bold h-12 px-6 transition-all duration-200 active:scale-[0.98] shadow-md shadow-primary/20"
        >
          {isLoading ? "Signing in..." : "Log In"}
        </Button>
      </form>

      {/* Social Login Divider */}
      <div className="relative my-8">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background-light dark:bg-background-dark px-4 text-xs text-slate-500 dark:text-slate-400 font-sans uppercase tracking-wider">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1c2533] h-12 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">
            Google
          </span>
        </Button>
        <Button
          type="button"
          onClick={() => handleSocialLogin("kakao")}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] h-12 px-4 hover:bg-[#FDD835] transition-colors duration-200"
        >
          <svg className="h-5 w-5 text-[#3C1E1E]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3C6.48 3 2 6.48 2 10.76c0 2.66 1.76 5.01 4.43 6.4-.19.7-.68 2.53-.78 2.92-.12.45.17.44.36.32 2.63-1.76 3.73-2.55 4.9-3.23.11.01.21.02.32.02 5.52 0 10-3.48 10-7.76S16.52 3 12 3z" />
          </svg>
          <span className="text-sm font-medium text-[#3C1E1E] font-sans">
            Kakao
          </span>
        </Button>
      </div>

      {/* Footer Signup Link */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-sans">
          New here?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline hover:text-blue-400 transition-colors"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </>
  );
}
