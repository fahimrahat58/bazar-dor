"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateUser, useSession } from "@/app/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImageUrl(user.image || "");
    }

    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [user, isPending, router]);

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }

    if (trimmedName === user?.name) {
      toast.error("নামে কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setNameLoading(true);

    try {
      const { error } = await updateUser({ name: trimmedName });

      if (error) {
        toast.error(error.message || "নাম আপডেট করা যায়নি");
        return;
      }

      toast.success("নাম সফলভাবে আপডেট হয়েছে!");
    } catch {
      toast.error("নাম আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setNameLoading(false);
    }
  };

  const handleUpdateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedImage = imageUrl.trim();

    if (trimmedImage && !/^https?:\/\/\S+$/i.test(trimmedImage)) {
      toast.error("সঠিক Image URL দিন");
      return;
    }

    if (trimmedImage === (user?.image || "")) {
      toast.error("ছবিতে কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setImageLoading(true);

    try {
      const { error } = await updateUser({
        image: trimmedImage || undefined,
      });

      if (error) {
        toast.error(error.message || "ছবি আপডেট করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!");
    } catch {
      toast.error("প্রোফাইল ছবি আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setImageLoading(false);
    }
  };

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-gray-500">
        <LoaderCircle size={20} className="animate-spin" />
        প্রোফাইল লোড হচ্ছে...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f4] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-[#008a48]"
        >
          <ArrowLeft size={18} />
          প্রোফাইলে ফিরে যান
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            প্রোফাইল আপডেট করুন
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            আপনার নাম ও প্রোফাইল ছবির তথ্য পরিবর্তন করুন।
          </p>
        </div>

        <div className="mb-5 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e4f5eb] text-xl font-bold text-[#008a48]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name || "Profile"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              name.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <div className="min-w-0">
            <p className="break-words font-bold text-gray-900">
              {name || "নাম দেওয়া হয়নি"}
            </p>
            <p className="break-all text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <section className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={handleUpdateName} className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              নাম পরিবর্তন করুন
            </h2>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                আপনার নাম
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/15"
              />
            </div>

            <button
              type="submit"
              disabled={nameLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#008a48] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00783e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {nameLoading ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {nameLoading ? "আপডেট হচ্ছে..." : "নাম আপডেট করুন"}
            </button>
          </form>

          <div className="border-t border-gray-100" />

          <form onSubmit={handleUpdateImage} className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              প্রোফাইল ছবি পরিবর্তন করুন
            </h2>

            <div>
              <label
                htmlFor="imageUrl"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                ছবির URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/15"
              />

              <p className="mt-2 text-xs leading-5 text-gray-500">
                একটি সরাসরি ছবির URL দিন। ছবি সরাতে ইনপুট খালি রেখে আপডেট করুন।
              </p>
            </div>

            <button
              type="submit"
              disabled={imageLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#008a48] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00783e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {imageLoading ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Check size={17} />
              )}
              {imageLoading ? "আপডেট হচ্ছে..." : "ছবি আপডেট করুন"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
