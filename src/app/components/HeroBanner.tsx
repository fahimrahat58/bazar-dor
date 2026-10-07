"use client";

import bannerimg from "../../../public/bazar-hero.png";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroBanner() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);

    setCurrentDate(formattedDate);
  }, []);

  const handleAllProducts = () => {
    const section = document.getElementById("all-products");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="w-full pt-3 pb-2 sm:pt-4 md:pt-5">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8 xl:px-12">
        <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 md:p-6 lg:p-7 xl:p-8">
          <div className="grid min-h-[280px] grid-cols-1 items-center gap-4 sm:min-h-[300px] sm:gap-5 md:min-h-[320px] md:grid-cols-12 md:gap-5 lg:min-h-[330px] lg:gap-6">
            {/* LEFT CONTENT */}
            <div className="flex min-w-0 flex-col items-start md:col-span-7 lg:col-span-8">
              {/* DATE BADGE */}
              <div className="mb-2 inline-flex max-w-full items-center rounded-full bg-[#e8ecef] px-2.5 py-1 text-[9px] font-medium text-[#008a48] sm:mb-2.5 sm:px-3 sm:text-[10px] md:text-xs lg:text-sm">
                <span className="truncate">
                  {currentDate || "বুধবার, ৭ অক্টোবর, ২০২৬"}
                </span>
              </div>

              {/* HEADING */}
              <h1 className="max-w-xl text-lg font-black leading-tight tracking-tight text-gray-900 sm:text-xl md:text-2xl lg:text-3xl xl:text-[38px]">
                আজকের বাজারের দাম এক নজরে
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-2 max-w-2xl text-[9px] font-medium leading-relaxed text-gray-600 sm:mt-2.5 sm:text-[10px] md:text-xs lg:text-sm xl:text-base">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
                বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক
                জায়গায়।
              </p>

              {/* BUTTON */}
              <div className="mt-3 sm:mt-4 md:mt-5">
                <button
                  type="button"
                  onClick={handleAllProducts}
                  className="inline-flex items-center justify-center rounded-lg bg-[#008a48] px-3.5 py-2 text-[9px] font-bold text-white shadow-sm transition hover:bg-[#00753d] sm:px-4 sm:py-2.5 sm:text-[10px] md:px-5 md:text-xs lg:text-sm"
                >
                  সব পণ্য দেখুন
                </button>
              </div>
            </div>

            {/* RIGHT BANNER IMAGE */}
            <div className="flex min-w-0 items-center justify-center md:col-span-5 lg:col-span-4">
              <div className="relative h-36 w-full max-w-[200px] sm:h-44 sm:max-w-[240px] md:h-52 md:max-w-[280px] lg:h-56 lg:max-w-[320px] xl:h-60 xl:max-w-[360px]">
                <Image
                  src={bannerimg}
                  alt="বাজার দর ফলমূল ও সবজি ঝুড়ি"
                  fill
                  priority
                  sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, (max-width: 1024px) 280px, (max-width: 1280px) 320px, 360px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}