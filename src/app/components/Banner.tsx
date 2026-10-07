"use client";

import bannerimg from "../../../public/bazar-hero.png";
import Image from "next/image";
import Link from "next/link";
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

  return (
    <section className="w-full pt-4 pb-2 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm sm:p-9 md:p-11 lg:p-12">
          <div className="grid min-h-[330px] grid-cols-1 items-center gap-8 md:min-h-[350px] md:grid-cols-12 lg:min-h-[370px]">
            {/* LEFT CONTENT */}
            <div className="flex flex-col items-start md:col-span-7 lg:col-span-8">
              {/* DATE BADGE */}
              <div className="mb-3.5 inline-flex items-center rounded-full bg-[#e8ecef] px-3.5 py-1 text-xs font-medium text-[#008a48] sm:text-sm">
                {currentDate || "বুধবার, ৭ অক্টোবর, ২০২৬"}
              </div>

              {/* HEADING */}
              <h1 className="text-2xl font-black leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-[42px]">
                আজকের বাজারের দাম এক নজরে
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-3 max-w-2xl text-xs font-medium leading-relaxed text-gray-600 sm:text-sm md:text-base">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
                বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক
                জায়গায়।
              </p>

              {/* BUTTON */}
              <div className="mt-6 sm:mt-7">
                <Link
                  href="#all-products"
                  className="inline-flex items-center justify-center rounded-lg bg-[#008a48] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#00753d] sm:text-sm"
                >
                  সব পণ্য দেখুন
                </Link>
              </div>
            </div>

            {/* RIGHT BANNER IMAGE */}
            <div className="flex items-center justify-center md:col-span-5 lg:col-span-4">
              <div className="relative h-52 w-full max-w-[280px] sm:h-60 sm:max-w-[320px] md:h-64 md:max-w-none lg:h-72">
                <Image
                  src={bannerimg}
                  alt="বাজার দর ফলমূল ও সবজি ঝুড়ি"
                  fill
                  priority
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