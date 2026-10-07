"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SortOption = "default" | "price-low" | "price-high";

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    let mounted = true;

    const getSlug = async () => {
      const resolvedParams = await params;

      if (mounted) {
        setSlug(resolvedParams.slug);
      }
    };

    getSlug();

    return () => {
      mounted = false;
    };
  }, [params]);

  const toBengaliNum = (num: number | string) => {
    const bengaliDigits = [
      "০",
      "১",
      "২",
      "৩",
      "৪",
      "৫",
      "৬",
      "৭",
      "৮",
      "৯",
    ];

    return num
      .toString()
      .replace(/\d/g, (digit) => bengaliDigits[Number(digit)]);
  };

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    const fetchCategoryProducts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.api-store.workers.dev/api/bazardor/products?category=${encodeURIComponent(
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
          setProducts([]);
          return;
        }

        setProducts(data);

        if (data.length > 0) {
          setCategoryName(data[0].categoryNameBn || "");
          setCategoryIcon(data[0].categoryIcon || "");
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching category products:", error);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();

    return () => controller.abort();
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.today - b.today;
    }

    if (sortBy === "price-high") {
      return b.today - a.today;
    }

    return 0;
  });

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-4 sm:py-6 md:py-7 lg:py-8">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
        {/* CATEGORY HEADER */}
        <div className="mb-4 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm sm:mb-5 sm:rounded-2xl sm:p-5 md:mb-6 md:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xl sm:h-12 sm:w-12 sm:rounded-xl sm:text-2xl md:h-14 md:w-14 md:text-3xl">
              {categoryIcon || "🛒"}
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black text-gray-900 sm:text-xl md:text-2xl">
                {categoryName || slug}
              </h1>

              <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-gray-500 sm:text-xs md:text-sm">
                {toBengaliNum(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mb-4 flex flex-col gap-2.5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="text-[11px] font-bold text-gray-600 sm:text-xs md:text-sm">
            মোট {toBengaliNum(products.length)}টি পণ্য দেখানো হচ্ছে
          </span>

          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <span className="text-[11px] font-medium text-gray-500 sm:text-xs">
              সাজান
            </span>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as SortOption)
              }
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[11px] font-bold text-gray-700 shadow-sm outline-none transition focus:border-[#008a48] focus:ring-1 focus:ring-[#008a48] sm:w-auto sm:flex-none sm:px-3 sm:py-1.5 sm:text-xs"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-gray-100 bg-white p-4 sm:h-32"
              />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          /* EMPTY */
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mb-2 text-3xl">📦</div>

            <p className="text-xs font-bold text-gray-500 sm:text-sm">
              কোনো পণ্য পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          /* PRODUCTS */
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3">
            {sortedProducts.map((product) => {
              const price = Number(product.today) || 0;
              const change = Number(product.change?.pct) || 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block min-w-0 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-100 hover:shadow-md active:scale-[0.99] sm:p-4"
                >
                  {/* PRODUCT INFO */}
                  <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-lg sm:h-10 sm:w-10 sm:text-xl">
                      {product.image ||
                        product.categoryIcon ||
                        "📦"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black leading-tight text-gray-900 transition-colors group-hover:text-green-700 sm:text-base">
                        {product.nameBn}
                      </h3>

                      <p className="mt-1 truncate text-[10px] font-medium text-gray-400 sm:text-[11px]">
                        {product.unit === "kg"
                          ? "প্রতি কেজি"
                          : product.unit === "litre"
                            ? "প্রতি লিটার"
                            : product.unit === "dozen"
                              ? "প্রতি ডজন"
                              : product.unit === "piece"
                                ? "প্রতি পিস"
                                : product.unit}
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="mt-3 flex items-end justify-between gap-2 border-t border-gray-50 pt-2.5 sm:mt-4">
                    <div className="min-w-0">
                      <span className="block text-[9px] font-semibold text-gray-400 sm:text-[10px]">
                        আজকের দাম
                      </span>

                      <span className="whitespace-nowrap text-sm font-black text-gray-900 sm:text-base md:text-lg">
                        {toBengaliNum(
                          price.toLocaleString("en-US"),
                        )}{" "}
                        টাকা
                      </span>
                    </div>

                    {/* CHANGE */}
                    <div
                      className={`flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-1 text-[10px] font-bold sm:gap-1 sm:px-2 sm:text-xs ${
                        product.change?.dir === "up"
                          ? "bg-red-50 text-red-600"
                          : product.change?.dir === "down"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      <span>
                        {product.change?.dir === "up"
                          ? "▲"
                          : product.change?.dir === "down"
                            ? "▼"
                            : "—"}
                      </span>

                      <span>
                        {toBengaliNum(Math.abs(change))}%
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-2.5 flex justify-end">
                    <span className="text-[10px] font-bold text-gray-400 transition-colors group-hover:text-green-600 sm:text-[11px]">
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