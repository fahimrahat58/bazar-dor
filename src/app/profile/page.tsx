"use client";

import { useState } from "react";
import { LogOut, Check } from "lucide-react";

type UserProfile = {
  name: string;
  email: string;
  image?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    name: "rahat biswas",
    email: "rahat@gmail.com",
    image: "",
  });

  const [name, setName] = useState(user.name);
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [nameSuccess, setNameSuccess] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);

  // Handle Name Update
  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUser((prev) => ({ ...prev, name: name.trim() }));
    setNameSuccess(true);
    setTimeout(() => setNameSuccess(false), 3000);
  };

  // Handle Image URL Update
  const handleUpdateImage = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, image: imageUrl.trim() }));
    setImageSuccess(true);
    setTimeout(() => setImageSuccess(false), 3000);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    console.log("Signing out...");
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
        <div className="flex flex-col gap-4 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Avatar / Image */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#008a48] text-base font-bold text-white shadow-sm sm:h-14 sm:w-14 sm:text-lg md:h-16 md:w-16 md:text-xl">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}
              {!user.image && user.name.charAt(0).toLowerCase()}
            </div>

            {/* Name & Email */}
            <div className="flex flex-col min-w-0">
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
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 sm:w-auto sm:text-sm"
          >
            <LogOut size={15} className="sm:size-[16px]" />
            <span>সাইন আউট</span>
          </button>
        </div>

        {/* 2. Image URL Update Card */}
        <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 sm:text-base md:text-lg mb-3 sm:mb-4">
            প্রোফাইল ছবি পরিবর্তন করুন
          </h3>

          <form onSubmit={handleUpdateImage} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-xs font-bold text-gray-700 mb-1 sm:mb-1.5"
              >
                ছবি লিঙ্ক (Image URL)
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/15 sm:px-3.5 sm:py-2.5 sm:text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#008a48] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#00783e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#008a48]/20 sm:w-auto sm:text-sm"
              >
                ছবি আপডেট করুন
              </button>

              {imageSuccess && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <Check size={15} /> ছবি সফলভাবে আপডেট করা হয়েছে!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* 3. Name Update Card */}
        <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 sm:text-base md:text-lg mb-3 sm:mb-4">
            নাম হালনাগাদ করুন
          </h3>

          <form onSubmit={handleUpdateName} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-gray-700 mb-1 sm:mb-1.5"
              >
                নাম
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/15 sm:px-3.5 sm:py-2.5 sm:text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#008a48] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#00783e] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#008a48]/20 sm:w-auto sm:text-sm"
              >
                নাম হালনাগাদ করুন
              </button>

              {nameSuccess && (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <Check size={15} /> নাম সফলভাবে আপডেট করা হয়েছে!
                </span>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}