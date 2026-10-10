"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, use } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number | string;
  yesterday: number | string;
  lastWeek: number | string;
  lastMonth: number | string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number | string;
  };
};

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SortOption = "default" | "price-low" | "price-high";

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const toBengaliNum = (num: number | string): string => {
    if (num === undefined || num === null) return "০";
    const banglaDigits: Record<string, string> = {
      "0": "০",
      "1": "১",
      "2": "২",
      "3": "৩",
      "4": "৪",
      "5": "৫",
      "6": "৬",
      "7": "৭",
      "8": "৮",
      "9": "৯",
    };

    return num
      .toString()
      .replace(/\d/g, (digit) => banglaDigits[digit] || digit);
  };

  const parseBanglaToNumber = (val: number | string): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;

    const banglaToEnglishMap: Record<string, string> = {
      "০": "0",
      "১": "1",
      "২": "2",
      "৩": "3",
      "৪": "4",
      "৫": "5",
      "৬": "6",
      "৭": "7",
      "৮": "8",
      "৯": "9",
    };

    const englishDigits = val
      .toString()
      .replace(/[০-৯]/g, (match) => banglaToEnglishMap[match] || match)
      .replace(/[^0-9.]/g, "");

    return parseFloat(englishDigits) || 0;
  };

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    const fetchCategoryProducts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/products?category=${encodeURIComponent(
            slug,
          )}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await response.json();

        if (!Array.isArray(data)) {
          if (!controller.signal.aborted) {
            setProducts([]);
            setCategoryName("");
            setCategoryIcon("");
          }
          return;
        }

        if (!controller.signal.aborted) {
          setProducts(data);

          if (data.length > 0) {
            setCategoryName(data[0].categoryNameBn || "");
            setCategoryIcon(data[0].categoryIcon || "");
          } else {
            setCategoryName("");
            setCategoryIcon("");
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching category products:", error);

          if (!controller.signal.aborted) {
            setProducts([]);
            setCategoryName("");
            setCategoryIcon("");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCategoryProducts();

    return () => controller.abort();
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseBanglaToNumber(a.today);
    const priceB = parseBanglaToNumber(b.today);

    if (sortBy === "price-low") {
      return priceA - priceB;
    }

    if (sortBy === "price-high") {
      return priceB - priceA;
    }

    return 0;
  });

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8f9fa] py-4 sm:py-6 md:py-7 lg:py-8">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
        <div className="mb-4 w-full min-w-0 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:mb-5 sm:rounded-2xl sm:p-5 md:mb-6 md:p-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 md:gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xl transition-all duration-300 hover:scale-105 hover:bg-green-100 sm:h-12 sm:w-12 sm:rounded-xl sm:text-2xl md:h-14 md:w-14 md:text-3xl">
              {categoryIcon || "🛒"}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-black text-gray-900 sm:text-xl md:text-2xl">
                {categoryName || slug}
              </h1>

              <p className="mt-0.5 truncate text-[10px] font-medium leading-relaxed text-gray-500 sm:text-xs md:text-sm">
                {toBengaliNum(products.length)} টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex min-w-0 flex-col gap-2.5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="shrink-0 text-[11px] font-bold text-gray-600 sm:text-xs md:text-sm">
            মোট {toBengaliNum(products.length)}টি পণ্য দেখানো হচ্ছে
          </span>

          <div className="flex min-w-0 w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-2.5">
            <span className="shrink-0 text-[11px] font-medium text-gray-500 sm:text-xs">
              সাজান:
            </span>

            <div className="relative min-w-0 flex-1 sm:w-auto sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full min-w-0 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-2.5 py-2 pr-8 text-[11px] font-bold text-gray-700 shadow-sm outline-none transition-all duration-200 hover:border-green-200 hover:bg-green-50/40 focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/10 sm:w-auto sm:px-3 sm:py-1.5 sm:pr-8 sm:text-xs md:px-3.5"
              >
                <option value="default">ডিফল্ট</option>
                <option value="price-low">দাম: কম থেকে বেশি</option>
                <option value="price-high">দাম: বেশি থেকে কম</option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 sm:right-2.5 sm:h-4 sm:w-4"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="min-w-0 w-full rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm sm:rounded-2xl sm:p-4 md:p-4.5"
              >
                <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-gray-200 sm:h-10 sm:w-10 sm:rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 sm:h-5" />
                    <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>

                <div className="mt-3 flex min-w-0 items-end justify-between gap-2 border-t border-gray-50 pt-2.5 sm:mt-4 sm:pt-3">
                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 w-16 animate-pulse rounded bg-gray-100 sm:h-3" />
                    <div className="mt-2 h-5 w-28 animate-pulse rounded bg-gray-200 sm:h-6" />
                  </div>
                  <div className="h-6 w-14 shrink-0 animate-pulse rounded-md bg-gray-100 sm:h-7 sm:w-16" />
                </div>

                <div className="mt-2.5 flex justify-end sm:mt-3">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100 sm:h-3.5 sm:w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="w-full min-w-0 rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:rounded-2xl sm:p-12">
            <div className="mb-3 text-4xl sm:text-5xl">🔍</div>
            <h2 className="text-base font-bold text-gray-800 sm:text-lg">
              কোনো পণ্য পাওয়া যায়নি
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              এই ক্যাটাগরিতে বর্তমানে কোনো তথ্য নেই অথবা বিভাগটি সঠিক নয়।
            </p>
            <div className="mt-5">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-[#008a48] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#00703a] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {sortedProducts.map((product) => {
              const price = parseBanglaToNumber(product.today);
              const changePct = parseBanglaToNumber(product.change?.pct);

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block min-w-0 w-full rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_8px_24px_rgba(0,138,72,0.10)] focus-visible:border-green-300 focus-visible:ring-2 focus-visible:ring-green-600/20 active:translate-y-0 active:scale-[0.99] sm:rounded-2xl sm:p-4 md:p-4.5"
                >
                  <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-green-100 sm:h-10 sm:w-10 sm:rounded-xl sm:text-xl">
                      {product.image || product.categoryIcon || "📦"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black leading-tight text-gray-900 transition-colors duration-200 group-hover:text-green-700 sm:text-base">
                        {product.nameBn}
                      </h3>

                      <p className="mt-1 truncate text-[10px] font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-500 sm:text-[11px]">
                        {product.unit === "kg"
                          ? "প্রতি কেজি"
                          : product.unit === "litre" || product.unit === "liter"
                            ? "প্রতি লিটার"
                            : product.unit === "dozen" || product.unit === "doz"
                              ? "প্রতি ডজন"
                              : product.unit === "piece"
                                ? "প্রতি পিস"
                                : product.unit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex min-w-0 items-end justify-between gap-2 border-t border-gray-50 pt-2.5 transition-colors duration-200 group-hover:border-green-50 sm:mt-4 sm:pt-3">
                    <div className="min-w-0">
                      <span className="block text-[9px] font-semibold text-gray-400 sm:text-[10px]">
                        আজকের দাম
                      </span>

                      <span className="whitespace-nowrap text-sm font-black text-gray-900 transition-colors duration-200 group-hover:text-green-700 sm:text-base md:text-lg">
                        {toBengaliNum(price.toLocaleString("en-US"))} টাকা
                      </span>
                    </div>

                    <div
                      className={`flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-1 text-[10px] font-bold transition-transform duration-200 group-hover:scale-105 sm:gap-1 sm:px-2 sm:text-xs ${
                        product.change?.dir === "up"
                          ? "bg-red-50 text-red-600 group-hover:bg-red-100"
                          : product.change?.dir === "down"
                            ? "bg-green-50 text-green-600 group-hover:bg-green-100"
                            : "bg-gray-50 text-gray-500 group-hover:bg-gray-100"
                      }`}
                    >
                      <span>
                        {product.change?.dir === "up"
                          ? "▲"
                          : product.change?.dir === "down"
                            ? "▼"
                            : "—"}
                      </span>

                      <span>{toBengaliNum(Math.abs(changePct))}%</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex justify-end sm:mt-3">
                    <span className="text-[10px] font-bold text-gray-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-green-600 sm:text-[11px]">
                      বিস্তারিত দেখুন →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
