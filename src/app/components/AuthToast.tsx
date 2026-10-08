"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthToast() {
  const pathname = usePathname();

  useEffect(() => {
    const authSuccess = sessionStorage.getItem("auth-success");

    const params = new URLSearchParams(window.location.search);
    const authType = params.get("auth");
    const message = params.get("message");

    if (message === "login-required") {
      toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন!", {
        duration: 3000,
      });

      window.history.replaceState({}, "", pathname);

      return;
    }

    if (authSuccess === "signin") {
      sessionStorage.removeItem("auth-success");

      toast.success("সাইন ইন সফল হয়েছে!", {
        duration: 3000,
      });

      return;
    }

    if (authSuccess === "signup") {
      sessionStorage.removeItem("auth-success");

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
        duration: 3000,
      });

      return;
    }

    if (authSuccess === "signout") {
      sessionStorage.removeItem("auth-success");

      toast.success("সফলভাবে সাইন আউট হয়েছে!", {
        duration: 3000,
      });

      return;
    }

    if (authType === "signup") {
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
        duration: 3000,
      });

      window.history.replaceState({}, "", pathname);

      return;
    }

    if (authType === "signin") {
      toast.success("সাইন ইন সফল হয়েছে!", {
        duration: 3000,
      });

      window.history.replaceState({}, "", pathname);
    }
  }, [pathname]);

  return null;
}
