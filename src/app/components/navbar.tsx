"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const CATEGORY_API =
  "https://api.api-store.workers.dev/api/bazardor/categories";

export default function Navbar() {
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORY_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Category fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);

    setCurrentDate(formattedDate);

    return () => controller.abort();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-11 xl:px-14">
        <div className="flex h-[62px] items-center justify-between sm:h-[66px]">
          <Link
            href="/"
            onClick={() => setMobileMenu(false)}
            className="flex shrink-0 items-center gap-2 sm:gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#008a48] shadow-sm sm:h-10 sm:w-10">
              <ShoppingCart
                size={20}
                strokeWidth={2.2}
                className="text-white sm:size-[21px]"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-[18px] font-black leading-tight tracking-tight text-gray-900 sm:text-[20px] md:text-[21px]">
                বাজার দর
              </span>

              {currentDate && (
                <span className="mt-0.5 text-[9px] font-medium leading-tight text-gray-500 sm:text-[10px]">
                  {currentDate}
                </span>
              )}
            </div>
          </Link>

          <div className="hidden items-center gap-1 sm:flex sm:gap-1.5">
            <Link
              href="/sign-in"
              className="rounded-md px-2.5 py-1.5 text-xs font-bold text-gray-800 transition hover:bg-gray-50 hover:text-[#008a48] md:px-3 md:text-sm"
            >
              সাইন ইন
            </Link>

            <Link
              href="/sign-up"
              className="rounded-md bg-[#008a48] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#00783e] md:px-4 md:py-2 md:text-sm"
            >
              সাইন আপ
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 sm:hidden"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <div className="hidden border-t border-gray-100 bg-white sm:block">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-11 xl:px-14">
          <nav className="scrollbar-none flex h-[42px] items-center gap-1 overflow-x-auto">
            {loading
              ? Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-7 w-16 shrink-0 animate-pulse rounded-md bg-gray-100"
                  />
                ))
              : categories.map((category) => {
                  const isActive = pathname === `/category/${category.slug}`;

                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-bold transition-all md:px-3 md:text-[13px] ${
                        isActive
                          ? "bg-[#008a48] text-white shadow-sm"
                          : "text-gray-800 hover:bg-green-50 hover:text-[#008a48]"
                      }`}
                    >
                      <span className="text-sm leading-none md:text-[15px]">
                        {category.icon}
                      </span>

                      <span>{category.nameBn}</span>
                    </Link>
                  );
                })}
          </nav>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white shadow-md sm:hidden">
          <div className="mx-auto w-full max-w-7xl px-5 py-3 sm:px-7">
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((category) => {
                const isActive = pathname === `/category/${category.slug}`;

                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={() => setMobileMenu(false)}
                    className={`flex min-h-[40px] items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-bold transition ${
                      isActive
                        ? "bg-[#008a48] text-white shadow-sm"
                        : "bg-gray-50 text-gray-800 hover:bg-green-50 hover:text-[#008a48]"
                    }`}
                  >
                    <span className="text-sm">{category.icon}</span>

                    <span>{category.nameBn}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-gray-100 pt-3">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenu(false)}
                className="rounded-md border border-gray-200 px-3 py-2 text-center text-xs font-bold text-gray-800 transition hover:bg-gray-50"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMobileMenu(false)}
                className="rounded-md bg-[#008a48] px-3 py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#00783e]"
              >
                সাইন আপ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
