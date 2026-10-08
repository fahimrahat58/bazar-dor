import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] w-full items-center justify-center bg-[#f9fafb] px-4 py-10 sm:min-h-[80vh] sm:px-6 lg:px-8">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 shadow-sm sm:mb-6 sm:h-24 sm:w-24">
          <ShoppingBag
            className="h-9 w-9 text-emerald-600 sm:h-12 sm:w-12"
            strokeWidth={1.8}
          />
        </div>

        <span className="mb-3 rounded-full bg-emerald-100/60 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-emerald-600 sm:mb-4 sm:text-xs">
          ৪০৪ - এরর
        </span>

        <h1 className="mb-2.5 text-xl font-bold leading-tight text-gray-900 sm:mb-3 sm:text-2xl md:text-3xl">
          পাতাটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mb-6 max-w-[300px] text-xs leading-5 text-gray-500 sm:mb-8 sm:max-w-sm sm:text-sm sm:leading-6 md:text-base">
          আপনি যে পণ্য বা পাতাটি খুঁজছেন সেটি সরানো হয়েছে বা কখনো ছিল না।
        </p>

        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#059669] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#047857] sm:w-auto sm:px-6 sm:text-sm"
          >
            হোম পেজে ফিরে যান
          </Link>

          <Link
            href="/compare"
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-5 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-200 sm:w-auto sm:px-6 sm:text-sm"
          >
            বাজার তুলনা দেখুন
          </Link>
        </div>
      </div>
    </main>
  );
}