"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "@/app/lib/auth-client";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("ইমেইল অ্যাড্রেসটি আবশ্যক");
      return;
    }

    if (!formData.password) {
      toast.error("পাসওয়ার্ড দিন");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (loading || googleLoading || githubLoading) {
      return;
    }

    setLoading(true);

    const loadingToastId = toast.loading("সাইন ইন করা হচ্ছে...");

    try {
      const result = await signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: true,
      });

      if (result.error) {
        toast.dismiss(loadingToastId);

        toast.error(result.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়", {
          duration: 3000,
        });

        setLoading(false);
        return;
      }

      toast.dismiss(loadingToastId);

      window.location.href = `${callbackUrl}?auth=signin`;
    } catch (error) {
      console.error("SIGN IN ERROR:", error);

      toast.dismiss(loadingToastId);

      toast.error(
        error instanceof Error ? error.message : "সাইন ইন করতে সমস্যা হয়েছে",
        {
          duration: 3000,
        },
      );

      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading || githubLoading || loading) {
      return;
    }

    setGoogleLoading(true);

    const loadingToastId = toast.loading("Google দিয়ে সাইন ইন করা হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: `${callbackUrl}?auth=signin`,
        newUserCallbackURL: `${callbackUrl}?auth=signup`,
      });

      if (error) {
        toast.dismiss(loadingToastId);

        toast.error(error.message || "Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে", {
          duration: 3000,
        });

        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("GOOGLE SIGN IN ERROR:", error);

      toast.dismiss(loadingToastId);

      toast.error(
        error instanceof Error
          ? error.message
          : "Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
        {
          duration: 3000,
        },
      );

      setGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    if (googleLoading || githubLoading || loading) {
      return;
    }

    setGithubLoading(true);

    const loadingToastId = toast.loading("GitHub দিয়ে সাইন ইন করা হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "github",
        callbackURL: `${callbackUrl}?auth=signin`,
        newUserCallbackURL: `${callbackUrl}?auth=signup`,
      });

      if (error) {
        toast.dismiss(loadingToastId);

        toast.error(error.message || "GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে", {
          duration: 3000,
        });

        setGithubLoading(false);
      }
    } catch (error) {
      console.error("GITHUB SIGN IN ERROR:", error);

      toast.dismiss(loadingToastId);

      toast.error(
        error instanceof Error
          ? error.message
          : "GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
        {
          duration: 3000,
        },
      );

      setGithubLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            সাইন ইন করুন
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="আপনার ইমেইল"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="আপনার পাসওয়ার্ড"
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-green-700 hover:underline"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading || githubLoading}
            className="w-full rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "সাইন ইন করা হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs text-gray-400">অথবা</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading || githubLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-base font-bold">G</span>

            {googleLoading
              ? "Google দিয়ে সাইন ইন হচ্ছে..."
              : "Google দিয়ে সাইন ইন করুন"}
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={loading || googleLoading || githubLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-base font-bold">GitHub</span>

            {githubLoading
              ? "GitHub দিয়ে সাইন ইন হচ্ছে..."
              : "GitHub দিয়ে সাইন ইন করুন"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>

        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-800 hover:underline"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
