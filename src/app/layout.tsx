import type { Metadata } from "next";
import { Suspense } from "react";

import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import AuthToast from "./components/AuthToast";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn">
      <body className="flex min-h-screen flex-col">
        <Toaster position="top-center" reverseOrder={false} />

        <Suspense fallback={null}>
          <AuthToast />
        </Suspense>

        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
