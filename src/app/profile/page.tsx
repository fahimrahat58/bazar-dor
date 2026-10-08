"use client";

import { useEffect, useState } from "react";
import { LogOut, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut, updateUser, useSession } from "@/app/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [nameSuccess, setNameSuccess] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);

  const [nameLoading, setNameLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImageUrl(user.image || "");
    }
  }, [user]);

  // Session loading
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f4f7f4]/60 py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-500">
              প্রোফাইল লোড হচ্ছে...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f4f7f4]/60 py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-bold text-gray-900">
              আপনাকে আগে সাইন ইন করতে হবে
            </h1>

            <button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="mt-4 rounded-lg bg-[#008a48] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#00783e] active:scale-95"
            >
              সাইন ইন করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Name Update
  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }

    if (trimmedName === user.name) {
      toast.error("নামে কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setNameLoading(true);

    try {
      const { error } = await updateUser({
        name: trimmedName,
      });

      if (error) {
        toast.error(error.message || "নাম আপডেট করা যায়নি");
        return;
      }

      setNameSuccess(true);

      toast.success("নাম সফলভাবে আপডেট করা হয়েছে!");

      setTimeout(() => {
        setNameSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Name update error:", error);
      toast.error("নাম আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setNameLoading(false);
    }
  };

  // Handle Image URL Update
  const handleUpdateImage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const trimmedImage = imageUrl.trim();

    if (trimmedImage && !/^https?:\/\/.+/i.test(trimmedImage)) {
      toast.error("সঠিক Image URL দিন");
      return;
    }

    if (trimmedImage === (user.image || "")) {
      toast.error("ছবিতে কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setImageLoading(true);

    try {
      const { error } = await updateUser({
        image: trimmedImage || undefined,
      });

      if (error) {
        toast.error(error.message || "প্রোফাইল ছবি আপডেট করা যায়নি");
        return;
      }

      setImageSuccess(true);

      toast.success("ছবি সফলভাবে আপডেট করা হয়েছে!");

      setTimeout(() => {
        setImageSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Image update error:", error);
      toast.error("প্রোফাইল ছবি আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setImageLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    if (signOutLoading) return;

    setSignOutLoading(true);

    const toastId = toast.loading("সাইন আউট করা হচ্ছে...");

    try {
      const { error } = await signOut();

      if (error) {
        toast.dismiss(toastId);
        toast.error(error.message || "সাইন আউট করতে সমস্যা হয়েছে");
        setSignOutLoading(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("সফলভাবে সাইন আউট হয়েছে!");

      router.replace("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);

      toast.dismiss(toastId);
      toast.error("সাইন আউট করতে সমস্যা হয়েছে");

      setSignOutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4]/60 py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
        
        {/* Page Title */}
        <div className="px-1">
          <h1 className="text-xl font-black text-gray-900 sm:text-2xl md:text-3xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* 1. Profile Summary Card */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:p-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            
            {/* Avatar / Image */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#008a48] text-base font-bold text-white shadow-sm sm:h-14 sm:w-14 sm:text-lg md:h-16 md:w-16 md:text-xl">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>

            {/* Name & Email */}
            <div className="flex min-w-0 flex-col">
              <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg md:text-xl">
                {user.name}
              </h2>

              <p className="truncate text-xs font-medium text-gray-400 sm:text-sm">
                {user.email}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signOutLoading}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition-all hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
          >
            <LogOut size={15} className="sm:size-[16px]" />

            <span>
              {signOutLoading ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </span>
          </button>
        </div>

        {/* 2. Image URL Update Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <h3 className="mb-3 text-sm font-bold text-gray-900 sm:mb-4 sm:text-base md:text-lg">
            প্রোফাইল ছবি পরিবর্তন করুন
          </h3>

          <form
            onSubmit={handleUpdateImage}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <label
                htmlFor="imageUrl"
                className="mb-1 block text-xs font-bold text-gray-700 sm:mb-1.5"
              >
                ছবি লিঙ্ক (Image URL)
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/15 sm:px-3.5 sm:py-2.5 sm:text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="submit"
                disabled={imageLoading}
                className="w-full rounded-lg bg-[#008a48] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#00783e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#008a48]/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
              >
                {imageLoading ? "আপডেট হচ্ছে..." : "ছবি আপডেট করুন"}
              </button>

              {imageSuccess && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <Check size={15} />
                  ছবি সফলভাবে আপডেট করা হয়েছে!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* 3. Name Update Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
          <h3 className="mb-3 text-sm font-bold text-gray-900 sm:mb-4 sm:text-base md:text-lg">
            নাম হালনাগাদ করুন
          </h3>

          <form
            onSubmit={handleUpdateName}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-xs font-bold text-gray-700 sm:mb-1.5"
              >
                নাম
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/15 sm:px-3.5 sm:py-2.5 sm:text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="submit"
                disabled={nameLoading}
                className="w-full rounded-lg bg-[#008a48] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#00783e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#008a48]/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
              >
                {nameLoading ? "আপডেট হচ্ছে..." : "নাম হালনাগাদ করুন"}
              </button>

              {nameSuccess && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <Check size={15} />
                  নাম সফলভাবে আপডেট করা হয়েছে!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}