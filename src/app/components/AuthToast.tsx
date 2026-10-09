"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    const authType = searchParams.get("auth");

    if (message === "login-required") {
      toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন!", {
        duration: 4000,
        id: "login-required",
      });
    } else if (authType === "signup") {
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
        duration: 3000,
        id: "signup-success",
      });
    } else if (authType === "signin") {
      toast.success("সাইন ইন সফল হয়েছে!", {
        duration: 3000,
        id: "signin-success",
      });
    }
  }, [searchParams]);

  return null;
}
