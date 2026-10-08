"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "@/app/lib/auth-client";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

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
      toast.error("পাসওয়ার্ড দিন");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
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

        toast.error(result.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়", {
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
        error instanceof Error ? error.message : "সাইন ইন করতে সমস্যা হয়েছে",
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

    const loadingToastId = toast.loading("Google দিয়ে সাইন ইন করা হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: `${callbackUrl}?auth=signin`,
        newUserCallbackURL: `${callbackUrl}?auth=signup`,
      });

      if (error) {
        toast.dismiss(loadingToastId);

        toast.error(
          error.message || "Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
          {
            duration: 3000,
          },
        );

        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("GOOGLE SIGN IN ERROR:", error);

      toast.dismiss(loadingToastId);

      toast.error(
        error instanceof Error
          ? error.message
          : "Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
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

    const loadingToastId = toast.loading("GitHub দিয়ে সাইন ইন করা হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "github",
        callbackURL: `${callbackUrl}?auth=signin`,
        newUserCallbackURL: `${callbackUrl}?auth=signup`,
      });

      if (error) {
        toast.dismiss(loadingToastId);

        toast.error(
          error.message || "GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
          {
            duration: 3000,
          },
        );

        setGithubLoading(false);
      }
    } catch (error) {
      console.error("GITHUB SIGN IN ERROR:", error);

      toast.dismiss(loadingToastId);

      toast.error(
        error instanceof Error
          ? error.message
          : "GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
        {
          duration: 3000,
        },
      );

      setGithubLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f4f6f4] px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            সাইন ইন
          </h1>
          <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm"
              >
                ইমেইল
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 sm:text-sm"
                >
                  পাসওয়ার্ড
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a19.014 19.014 0 014.198-5.122m3.84-1.636A9.97 9.97 0 0112 5c7 0 10 7 10 7a18.88 18.88 0 01-2.181 3.23M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading || githubLoading}
              className="w-full rounded-lg bg-[#008744] py-2.5 text-sm cursor-pointer font-semibold text-white transition hover:bg-[#00753b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "সাইন ইন করা হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-2 text-xs text-gray-400">
              অথবা
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading || githubLoading}
              className="flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
                  ? "চালিয়ে যাওয়া হচ্ছে..."
                  : "Google দিয়ে চালিয়ে যান"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={loading || googleLoading || githubLoading}
              className="flex items-center justify-center cursor-pointer gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                className="h-4 w-4 shrink-0 fill-current text-gray-900"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span className="truncate">
                {githubLoading
                  ? "চালিয়ে যাওয়া হচ্ছে..."
                  : "GitHub দিয়ে চালিয়ে যান"}
              </span>
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-gray-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-emerald-700 underline hover:text-emerald-800"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 underline hover:text-gray-800"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
