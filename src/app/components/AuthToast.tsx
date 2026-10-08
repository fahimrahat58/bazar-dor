
"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AuthToast() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const authType = params.get("auth");
    const message = params.get("message");

    if (message === "login-required") {
      toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন!", {
        duration: 3000,
      });

      window.history.replaceState(
        {},
        "",
        window.location.pathname,
      );

      return;
    }

    if (authType === "signup") {
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
        duration: 3000,
      });

      window.history.replaceState(
        {},
        "",
        window.location.pathname,
      );

      return;
    }

    if (authType === "signin") {
      toast.success("সাইন ইন সফল হয়েছে!", {
        duration: 3000,
      });

      window.history.replaceState(
        {},
        "",
        window.location.pathname,
      );
    }
  }, []);

  return null;
}
