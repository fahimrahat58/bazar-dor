"use client";

import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const CATEGORY_API =
  "https://api.api-store.workers.dev/api/bazardor/categories";

export default function NavbarContent() {
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

        const data = await response.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
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

  const getCategoryUrl = (slug: string) => {
    return `/category/${encodeURIComponent(slug)}`;
  };

  const isCategoryActive = (slug: string) => {
    return pathname === getCategoryUrl(slug);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
        <div className="flex min-h-[56px] items-center justify-between gap-3 sm:min-h-[60px] md:min-h-[64px]">
          <Link
            href="/"
            onClick={() => setMobileMenu(false)}
            className="group flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#008a48]/20 sm:gap-2 md:gap-2.5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#008a48] shadow-sm transition-all duration-200 group-hover:bg-[#00783e] group-hover:shadow-md sm:h-9 sm:w-9 md:h-10 md:w-10">
              <ShoppingCart
                size={18}
                strokeWidth={2.2}
                className="text-white transition-transform duration-200 group-hover:scale-105 sm:size-[19px] md:size-[21px]"
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[15px] font-black leading-tight tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-[#008a48] sm:text-[17px] md:text-[19px] lg:text-[20px]">
                বাজার দর
              </span>

              {currentDate && (
                <span className="mt-0.5 truncate text-[8px] font-medium leading-tight text-gray-500 sm:text-[9px] md:text-[10px]">
                  {currentDate}
                </span>
              )}
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex lg:gap-1.5">
            <Link
              href="/sign-in"
              className="rounded-md px-2.5 py-1.5 text-xs font-bold text-gray-800 transition-all duration-200 hover:bg-gray-50 hover:text-[#008a48] focus:outline-none focus:ring-2 focus:ring-[#008a48]/10 xl:px-3 xl:text-sm"
            >
              সাইন ইন
            </Link>

            <Link
              href="/sign-up"
              className="rounded-md bg-[#008a48] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00783e] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#008a48]/20 active:translate-y-0 xl:px-4 xl:py-2 xl:text-sm"
            >
              সাইন আপ
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenu((prev) => !prev)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-[#008a48] focus:outline-none focus:ring-2 focus:ring-[#008a48]/15 active:scale-95 sm:h-10 sm:w-10 lg:hidden"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? (
              <X className="h-5 w-5 sm:h-[21px] sm:w-[21px]" />
            ) : (
              <Menu className="h-5 w-5 sm:h-[21px] sm:w-[21px]" />
            )}
          </button>
        </div>
      </div>

      <div className="hidden border-t border-gray-100 bg-white lg:block">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
          <nav className="scrollbar-none flex h-[42px] items-center gap-1 overflow-x-auto">
            {loading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="h-7 w-16 shrink-0 animate-pulse rounded-md bg-gray-100"
                />
              ))
            ) : categories.length === 0 ? (
              <span className="text-xs font-medium text-gray-400">
                কোনো ক্যাটাগরি পাওয়া যায়নি
              </span>
            ) : (
              categories.map((category) => {
                const categoryUrl = getCategoryUrl(category.slug);
                const isActive = isCategoryActive(category.slug);

                return (
                  <Link
                    key={category.id}
                    href={categoryUrl}
                    className={`group flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-bold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#008a48]/15 xl:px-3 xl:text-[13px] ${
                      isActive
                        ? "bg-[#008a48] text-white shadow-sm"
                        : "text-gray-800 hover:bg-green-50 hover:text-[#008a48]"
                    }`}
                  >
                    <span className="text-sm leading-none transition-transform duration-200 group-hover:scale-105 xl:text-[15px]">
                      {category.icon}
                    </span>

                    <span>{category.nameBn}</span>
                  </Link>
                );
              })
            )}
          </nav>
        </div>
      </div>

      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white shadow-md lg:hidden">
          <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-3.5 md:px-7">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 animate-pulse rounded-md bg-gray-100 sm:h-11"
                  />
                ))
              ) : categories.length === 0 ? (
                <span className="col-span-full py-2 text-center text-xs font-medium text-gray-400">
                  কোনো ক্যাটাগরি পাওয়া যায়নি
                </span>
              ) : (
                categories.map((category) => {
                  const categoryUrl = getCategoryUrl(category.slug);
                  const isActive = isCategoryActive(category.slug);

                  return (
                    <Link
                      key={category.id}
                      href={categoryUrl}
                      onClick={() => setMobileMenu(false)}
                      className={`group flex min-h-[42px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#008a48]/15 sm:min-h-[44px] sm:px-3 sm:text-xs ${
                        isActive
                          ? "bg-[#008a48] text-white shadow-sm"
                          : "bg-gray-50 text-gray-800 hover:bg-green-50 hover:text-[#008a48]"
                      }`}
                    >
                      <span className="text-sm transition-transform duration-200 group-hover:scale-105">
                        {category.icon}
                      </span>

                      <span className="truncate">{category.nameBn}</span>
                    </Link>
                  );
                })
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-gray-100 pt-3 sm:mt-3.5 sm:gap-2 sm:pt-3.5">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenu(false)}
                className="flex min-h-[42px] items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-800 outline-none transition-all duration-200 hover:border-green-200 hover:bg-green-50 hover:text-[#008a48] focus-visible:ring-2 focus-visible:ring-[#008a48]/15 sm:min-h-[44px]"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMobileMenu(false)}
                className="flex min-h-[42px] items-center justify-center rounded-lg bg-[#008a48] px-3 py-2 text-xs font-bold text-white shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#00783e] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#008a48]/20 active:translate-y-0 sm:min-h-[44px]"
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
