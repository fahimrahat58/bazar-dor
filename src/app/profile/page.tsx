"use client";

import { useEffect, useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/app/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [signOutLoading, setSignOutLoading] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  const handleSignOut = async () => {
    if (signOutLoading) return;

    setSignOutLoading(true);
    const toastId = toast.loading("সাইন আউট করা হচ্ছে...");

    try {
      const { error } = await signOut();

      toast.dismiss(toastId);

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        setSignOutLoading(false);
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে!");
      router.replace("/sign-in");
      router.refresh();
    } catch {
      toast.dismiss(toastId);
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");
      setSignOutLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#f4f7f4] px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-3xl animate-pulse">
          <div className="mb-5 space-y-3 sm:mb-8">
            <div className="h-8 w-48 rounded-lg bg-gray-200 sm:h-9 sm:w-56" />
            <div className="h-4 w-full max-w-sm rounded bg-gray-200" />
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200 sm:h-16 sm:w-16" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-5 w-32 max-w-full rounded bg-gray-200" />
                  <div className="h-4 w-40 max-w-full rounded bg-gray-200" />
                </div>
              </div>

              <div className="h-11 w-full rounded-xl bg-gray-200 md:h-10 md:w-32" />
            </div>

            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
              <div className="h-5 w-16 rounded bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-10 rounded bg-gray-200" />
                <div className="h-11 w-full rounded-xl bg-gray-100 sm:h-12" />
              </div>

              <div className="h-11 w-full rounded-xl bg-gray-200 sm:h-12" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f4f7f4] px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5 sm:mb-6 md:mb-8">
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
            আপনার অ্যাকাউন্টের তথ্য দেখুন এবং আপডেট করুন।
          </p>
        </div>

        <section className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xl font-bold text-[#008a48] sm:h-16 sm:w-16">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                  {user.name || "নাম দেওয়া হয়নি"}
                </h2>

                <p className="break-all text-xs text-gray-500 sm:truncate sm:text-sm">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signOutLoading}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-10 md:w-auto"
            >
              {signOutLoading ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}

              {signOutLoading ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </button>
          </div>

          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            <h3 className="text-base font-bold text-gray-900">তথ্য</h3>

            <div className="space-y-2">
              <label
                htmlFor="profile-name"
                className="text-xs font-medium text-gray-500 sm:text-sm"
              >
                নাম
              </label>

              <input
                id="profile-name"
                type="text"
                readOnly
                value={user.name || ""}
                placeholder="নাম দেওয়া হয়নি"
                className="block w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none focus:border-[#008a48] sm:px-4"
              />
            </div>

            <button
              type="button"
              onClick={() => router.push("/update-profile")}
              className="mt-2 min-h-11 w-full cursor-pointer rounded-xl bg-[#008a48] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#00783e] active:scale-[0.98]"
            >
              আপডেট
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
