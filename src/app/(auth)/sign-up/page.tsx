"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/app/lib/auth-client";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("ইমেইল অ্যাড্রেসটি আবশ্যক");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে");
        return;
      }

      if (data) {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      toast.error("Google দিয়ে সাইন আপ করতে সমস্যা হয়েছে");
      setGoogleLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);

    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      toast.error("GitHub দিয়ে সাইন আপ করতে সমস্যা হয়েছে");
      setGithubLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#f4f6f5] px-3 py-5 sm:px-5 sm:py-6 md:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-3.5 sm:space-y-4">
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mx-auto mt-1 max-w-sm text-[10px] leading-relaxed text-gray-500 sm:text-xs">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </div>

        <div className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label
                htmlFor="name"
                className="block cursor-pointer text-[11px] font-semibold text-gray-700 sm:text-xs"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="যেমন: রহিম উদ্দিন"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="mt-1.5 block h-10 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 sm:h-11 sm:px-3.5 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block cursor-pointer text-[11px] font-semibold text-gray-700 sm:text-xs"
              >
                ইমেইল
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="mt-1.5 block h-10 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 sm:h-11 sm:px-3.5 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block cursor-pointer text-[11px] font-semibold text-gray-700 sm:text-xs"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="mt-1.5 block h-10 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 sm:h-11 sm:px-3.5 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block cursor-pointer text-[11px] font-semibold text-gray-700 sm:text-xs"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="আবার লিখুন"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="mt-1.5 block h-10 w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 sm:h-11 sm:px-3.5 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-10 w-full cursor-pointer rounded-xl bg-[#008a48] px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#00753d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:text-sm"
            >
              {loading
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <span className="relative bg-white px-2.5 text-[10px] text-gray-400 sm:text-xs">
              অথবা
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={googleLoading || githubLoading}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-2 text-[11px] font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:text-xs"
            >
              <svg
                className="h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />

                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />

                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />

                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>

              <span className="truncate">
                {googleLoading
                  ? "Google দিয়ে সাইন আপ হচ্ছে..."
                  : "Google দিয়ে চালিয়ে যান"}
              </span>
            </button>

            <button
              onClick={handleGitHubSignIn}
              type="button"
              disabled={googleLoading || githubLoading}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-2 text-[11px] font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:text-xs"
            >
              <svg
                className="h-3.5 w-3.5 shrink-0 fill-current text-gray-900"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>

              <span className="truncate">
                {githubLoading
                  ? "GitHub দিয়ে সাইন আপ হচ্ছে..."
                  : "GitHub দিয়ে চালিয়ে যান"}
              </span>
            </button>
          </div>

          <div className="mt-4 text-center text-[11px] text-gray-600 sm:text-xs">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/sign-in"
              className="cursor-pointer font-semibold text-emerald-700 underline transition-colors hover:text-emerald-800"
            >
              সাইন ইন করুন
            </Link>
          </div>
        </div>

        <div className="pt-0.5 text-center">
          <Link
            href="/"
            className="cursor-pointer text-[11px] font-medium text-gray-600 underline transition-colors hover:text-gray-900 sm:text-xs"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}