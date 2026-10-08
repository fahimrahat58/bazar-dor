"use client";

import { useEffect, useState } from "react";
import { LogOut, UserRound, Mail, Pencil, LoaderCircle } from "lucide-react";
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

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <LoaderCircle className="animate-spin" size={20} />
          প্রোফাইল লোড হচ্ছে...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f4] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-semibold text-[#008a48]">
            আমার অ্যাকাউন্ট
          </p>

          <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য দেখুন এবং প্রয়োজনে আপডেট করুন।
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:rounded-3xl">
          <div className="h-24 bg-gradient-to-r from-[#008a48] to-[#49b77c] sm:h-32" />

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#e4f5eb] text-3xl font-bold text-[#008a48] shadow-sm sm:h-28 sm:w-28 sm:rounded-3xl">
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
              </div>

              <button
                type="button"
                onClick={() => router.push("/update-profile")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#008a48] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#00783e] active:scale-[0.98] sm:mb-1 sm:w-auto"
              >
                <Pencil size={16} />
                প্রোফাইল আপডেট
              </button>
            </div>

            <div className="mt-5 border-b border-gray-100 pb-5">
              <h2 className="break-words text-xl font-black text-gray-900 sm:text-2xl">
                {user.name || "নাম দেওয়া হয়নি"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user.email}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">
                অ্যাকাউন্টের তথ্য
              </h3>

              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#008a48] shadow-sm">
                  <UserRound size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">
                    সম্পূর্ণ নাম
                  </p>
                  <p className="mt-1 break-words text-sm font-bold text-gray-900">
                    {user.name || "নাম দেওয়া হয়নি"}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#008a48] shadow-sm">
                  <Mail size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">
                    ইমেইল ঠিকানা
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signOutLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {signOutLoading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <LogOut size={17} />
                )}
                {signOutLoading ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
