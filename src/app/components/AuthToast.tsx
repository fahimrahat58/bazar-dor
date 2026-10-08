"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AuthToast() {
  useEffect(() => {
    const showAuthToast = () => {
      const authSuccess = sessionStorage.getItem("auth-success");

      const params = new URLSearchParams(window.location.search);
      const authType = params.get("auth");
      const message = params.get("message");

      if (message === "login-required") {
        toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন!", {
          duration: 3000,
        });

        window.history.replaceState({}, "", "/sign-in");

        return;
      }

      if (authSuccess) {
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

        if (authSuccess === "signout") {
          toast.success("সফলভাবে সাইন আউট হয়েছে!", {
            duration: 3000,
          });
        }

        return;
      }

      if (authType === "signup") {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
          duration: 3000,
        });

        window.history.replaceState({}, "", "/");
      }

      if (authType === "signin") {
        toast.success("সাইন ইন সফল হয়েছে!", {
          duration: 3000,
        });

        window.history.replaceState({}, "", "/");
      }
    };

    const timer = setTimeout(() => {
      showAuthToast();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}