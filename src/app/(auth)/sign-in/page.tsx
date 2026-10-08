"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/app/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const rawCallbackUrl = searchParams.get("callbackUrl");

  const callbackUrl =
    rawCallbackUrl &&
    rawCallbackUrl.startsWith("/") &&
    !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    setLoading(true);

    const toastId = toast.loading("সাইন ইন করা হচ্ছে...");

    try {
      const { data, error } = await signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: true,
      });

      if (error) {
        toast.dismiss(toastId);
        toast.error(error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়");
        setLoading(false);
        return;
      }

      if (data) {
        toast.dismiss(toastId);

        sessionStorage.setItem("auth-success", "signin");

        router.replace(callbackUrl);
      }
    } catch (error) {
      console.error(error);

      toast.dismiss(toastId);
      toast.error("সাইন ইন করতে সমস্যা হয়েছে");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading || githubLoading || loading) return;

    setGoogleLoading(true);

    const toastId = toast.loading("Google দিয়ে সাইন ইন করা হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
        newUserCallbackURL: callbackUrl,
      });

      if (error) {
        toast.dismiss(toastId);
        toast.error(
          error.message || "Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
        );
        setGoogleLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);

      toast.dismiss(toastId);
      toast.error("Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে");
      setGoogleLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    if (googleLoading || githubLoading || loading) return;

    setGithubLoading(true);

    const toastId = toast.loading("GitHub দিয়ে সাইন ইন করা হচ্ছে...");

    try {
      const { error } = await signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
        newUserCallbackURL: callbackUrl,
      });

      if (error) {
        toast.dismiss(toastId);
        toast.error(
          error.message || "GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে",
        );
        setGithubLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);

      toast.dismiss(toastId);
      toast.error("GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে");
      setGithubLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-[#f4f6f5] px-3 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5">
      <div className="w-full max-w-md min-w-0 space-y-2.5 sm:space-y-3">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            সাইন ইন
          </h1>

          <p className="mx-auto mt-1 max-w-none whitespace-nowrap text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <div className="w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block cursor-pointer text-xs font-semibold text-gray-700"
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
                className="mt-1.5 block h-10 w-full min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 sm:h-11 sm:px-3.5 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block cursor-pointer text-xs font-semibold text-gray-700"
              >
                পাসওয়ার্ড
              </label>

              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="block h-10 w-full min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 pr-10 text-xs text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 sm:h-11 sm:px-3.5 sm:pr-11 sm:text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "পাসওয়ার্ড লুকান"
                      : "পাসওয়ার্ড দেখুন"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading || githubLoading}
              className="mt-1.5 flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-[#008a48] px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#00753d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:text-sm"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <div className="relative my-3 text-center sm:my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <span className="relative bg-white px-3 text-xs text-gray-400">
              অথবা
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={googleLoading || githubLoading || loading}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-2 text-xs font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3.01h3.87c2.27-2.09 3.56-5.17 3.56-8.66Z"
                />

                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3.01c-1.07.72-2.44 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
                />

                <path
                  fill="#FBBC05"
                  d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.94 1.15 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
                />
              </svg>

              <span className="truncate">
                {googleLoading
                  ? "Google দিয়ে সাইন ইন হচ্ছে..."
                  : "Google দিয়ে চালিয়ে যান"}
              </span>
            </button>

            <button
              onClick={handleGitHubSignIn}
              type="button"
              disabled={googleLoading || githubLoading || loading}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-2 text-xs font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-[#181717] sm:h-[18px] sm:w-[18px]"
                aria-hidden="true"
              >
                <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3Z" />
              </svg>

              <span className="truncate">
                {githubLoading
                  ? "GitHub দিয়ে সাইন ইন হচ্ছে..."
                  : "GitHub দিয়ে চালিয়ে যান"}
              </span>
            </button>
          </div>

          <div className="mt-3 text-center text-xs text-gray-600 sm:mt-4">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="cursor-pointer font-semibold text-emerald-700 underline"
            >
              সাইন আপ করুন
            </Link>
          </div>
        </div>

        <div className="pt-0 text-center">
          <Link
            href="/"
            className="cursor-pointer text-xs font-medium text-gray-600 underline transition-colors hover:text-gray-900"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}