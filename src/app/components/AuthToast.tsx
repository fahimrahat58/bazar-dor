"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AuthToast() {
  useEffect(() => {
    const authSuccess = sessionStorage.getItem("auth-success");

    if (!authSuccess) return;

    sessionStorage.removeItem("auth-success");

    if (authSuccess === "signin") {
      toast.success("সাইন ইন সফল হয়েছে!", {
        duration: 3000,
      });
    }

    if (authSuccess === "signup") {
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
        duration: 3000,
      });
    }
  }, []);

  return null;
}