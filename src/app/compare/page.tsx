"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
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
  markets: Market[];
}

const PRODUCTS_API =
  "https://openapi.programming-hero.com/api/bazardor/products";

const toBengaliNumber = (value: number | string) => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return String(value).replace(/\d/g, (digit) => bengaliDigits[Number(digit)]);
};

const getAverage = (min: number, max: number) => {
  const average = (min + max) / 2;

  return Number.isInteger(average) ? average : Number(average.toFixed(2));
};

const getUnitText = (unit: string) => {
  switch (unit?.toLowerCase()) {
    case "kg":
      return "কেজি";
    case "litre":
    case "liter":
      return "লিটার";
    case "doz":
    case "dozen":
      return "ডজন";
    case "piece":
      return "পিস";
    default:
      return unit || "একক";
  }
};

const isImageUrl = (image?: string) => {
  if (!image) return false;

  try {
    const url = new URL(image);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

function ProductImage({
  image,
  categoryIcon,
  name,
}: {
  image?: string;
  categoryIcon?: string;
  name: string;
}) {
  const [imageError, setImageError] = useState(false);

  const showImage = isImageUrl(image) && !imageError;

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-16 sm:w-16">
      {showImage ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <span className="text-2xl" role="img" aria-label={name}>
          {categoryIcon || "🛒"}
        </span>
      )}
    </div>
  );
}

export default function BazarCompare() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(PRODUCTS_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Products fetch failed");
        }

        const data: Product[] = await response.json();

        if (controller.signal.aborted) return;

        setProducts(data);

        if (data.length > 0) {
          setSelectedProductId(String(data[0].id));
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Products fetch error:", err);

        if (!controller.signal.aborted) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const selectedProduct = products.find(
    (product) => String(product.id) === selectedProductId,
  );

  const markets = selectedProduct?.markets ?? [];

  const lowestPrice =
    markets.length > 0 ? Math.min(...markets.map((market) => market.min)) : 0;

  const highestPrice =
    markets.length > 0 ? Math.max(...markets.map((market) => market.max)) : 0;

  const averagePrice =
    markets.length > 0 ? getAverage(lowestPrice, highestPrice) : 0;

  const groupedProducts = products.reduce(
    (acc, product) => {
      const categoryName =
        product.categoryNameBn || product.category || "অন্যান্য";

      if (!acc[categoryName]) {
        acc[categoryName] = {
          icon: product.categoryIcon || "🛒",
          items: [],
        };
      }

      acc[categoryName].items.push(product);

      return acc;
    },
    {} as Record<string, { icon: string; items: Product[] }>,
  );

  const filteredGroups = Object.entries(groupedProducts)
    .map(([categoryName, group]) => ({
      categoryName,
      ...group,
      items: group.items.filter((product) =>
        product.nameBn.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f4f6f4] px-3 py-5 text-gray-800 sm:px-5 sm:py-7 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              বাজার তুলনা
            </h1>
            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              একটি পণ্য বেছে নিয়ে বিভাগভিত্তিক দাম পাশাপাশি দেখুন।
            </p>
          </div>

          <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="mt-3 h-11 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f4f6f4] px-3 py-5 text-gray-800 sm:px-5 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
        <header>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            বাজার তুলনা
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
            একটি পণ্য বেছে নিয়ে বিভিন্ন বাজারের দাম পাশাপাশি দেখুন।
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 font-semibold underline underline-offset-2"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        <section className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm sm:p-5">
          <label className="mb-2 block text-xs font-semibold text-gray-600 sm:text-sm">
            পণ্য নির্বাচন করুন
          </label>

          {loading ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100 sm:flex-1" />
              <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100 sm:w-36" />
            </div>
          ) : (
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <div ref={dropdownRef} className="relative w-full min-w-0 flex-1">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  onClick={() => setIsOpen((previous) => !previous)}
                  disabled={products.length === 0}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-left text-sm outline-none transition hover:border-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {selectedProduct ? (
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="shrink-0">
                          {selectedProduct.categoryIcon || "🛒"}
                        </span>
                        <span className="truncate">
                          {selectedProduct.nameBn}
                        </span>
                      </span>
                    ) : (
                      "পণ্য বেছে নিন"
                    )}
                  </span>

                  <span
                    className={`shrink-0 text-xs text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-[65vh] overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white p-2 shadow-xl sm:max-h-96">
                    <input
                      type="search"
                      placeholder="পণ্যের নাম লিখে খুঁজুন..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      autoFocus
                      className="sticky top-0 mb-2 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-500"
                    />

                    {filteredGroups.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        কোনো পণ্য পাওয়া যায়নি।
                      </div>
                    ) : (
                      filteredGroups.map((group) => (
                        <div
                          key={group.categoryName}
                          className="mb-2 last:mb-0"
                        >
                          <div className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-gray-500 sm:text-sm">
                            <span>{group.icon}</span>
                            <span className="truncate">
                              {group.categoryName}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            {group.items.map((product) => {
                              const isSelected =
                                String(product.id) === selectedProductId;

                              return (
                                <button
                                  key={product.id}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setSelectedProductId(String(product.id));
                                    setIsOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                                    isSelected
                                      ? "bg-emerald-50 font-semibold text-emerald-800"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="min-w-0 flex-1 truncate">
                                    {product.nameBn}
                                  </span>

                                  {isSelected && (
                                    <span className="shrink-0 text-emerald-600">
                                      ✓
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedProduct?.slug ? (
                <Link
                  href={`/products/${selectedProduct.slug}`}
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 active:scale-[0.99] sm:w-auto sm:px-5"
                >
                  বিস্তারিত দেখুন
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="min-h-11 w-full shrink-0 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-400 sm:w-auto sm:px-5"
                >
                  বিস্তারিত দেখুন
                </button>
              )}
            </div>
          )}
        </section>

        {loading ? (
          <section className="space-y-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-36 max-w-full animate-pulse rounded bg-gray-200 sm:w-48" />
                <div className="mt-2 h-3 w-48 max-w-full animate-pulse rounded bg-gray-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-gray-50 p-3.5 sm:p-4">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="mt-3 h-7 w-20 max-w-full animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </section>
        ) : selectedProduct ? (
          <section className="space-y-5 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm sm:space-y-6 sm:p-5 lg:p-6">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <ProductImage
                image={selectedProduct.image}
                categoryIcon={selectedProduct.categoryIcon}
                name={selectedProduct.nameBn}
              />

              <div className="min-w-0 flex-1">
                <h2 className="break-words text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
                  {selectedProduct.nameBn}
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  প্রতি {getUnitText(selectedProduct.unit)}-এর আজকের দাম
                </p>

                <p className="mt-0.5 text-sm font-semibold text-emerald-700 sm:text-base">
                  {toBengaliNumber(selectedProduct.today)} টাকা
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 sm:p-4">
                <span className="block text-xs text-gray-500 sm:text-sm">
                  সর্বনিম্ন
                </span>
                <div className="mt-2 flex flex-wrap items-baseline gap-1">
                  <span className="break-words text-xl font-extrabold text-emerald-600 sm:text-2xl">
                    {toBengaliNumber(lowestPrice)}
                  </span>
                  <span className="text-xs text-gray-500">টাকা</span>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-rose-100 bg-rose-50/60 p-3 sm:p-4">
                <span className="block text-xs text-gray-500 sm:text-sm">
                  সর্বাধিক
                </span>
                <div className="mt-2 flex flex-wrap items-baseline gap-1">
                  <span className="break-words text-xl font-extrabold text-rose-500 sm:text-2xl">
                    {toBengaliNumber(highestPrice)}
                  </span>
                  <span className="text-xs text-gray-500">টাকা</span>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-blue-100 bg-blue-50/60 p-3 sm:p-4">
                <span className="block text-xs text-gray-500 sm:text-sm">
                  গড় দাম
                </span>
                <div className="mt-2 flex flex-wrap items-baseline gap-1">
                  <span className="break-words text-xl font-extrabold text-blue-600 sm:text-2xl">
                    {toBengaliNumber(averagePrice)}
                  </span>
                  <span className="text-xs text-gray-500">টাকা</span>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <span className="block text-xs text-gray-500 sm:text-sm">
                  বাজার সংখ্যা
                </span>
                <div className="mt-2 text-xl font-extrabold text-gray-800 sm:text-2xl">
                  {toBengaliNumber(markets.length)}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {loading ? (
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
              <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-lg bg-gray-50"
                />
              ))}
            </div>
          </section>
        ) : selectedProduct ? (
          <section className="min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-4 sm:px-5 sm:py-5">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-800 sm:text-base">
                  বাজারভিত্তিক দাম
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {toBengaliNumber(markets.length)}টি বাজারের তথ্য
                </p>
              </div>

              <span className="shrink-0 rounded-lg bg-gray-50 px-2 py-1.5 text-[10px] font-medium text-gray-600 sm:px-2.5 sm:text-xs">
                {getUnitText(selectedProduct.unit)} অনুযায়ী
              </span>
            </div>

            {markets.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-500 sm:py-12">
                এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
              </div>
            ) : (
              <div className="w-full min-w-0 overflow-hidden">
                <table className="w-full table-fixed text-left text-[10px] sm:text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F7F9F7] text-[9px] font-semibold text-gray-600 sm:text-xs">
                      <th className="w-[25%] break-words px-1.5 py-3 sm:px-3 md:px-5">
                        বাজার
                      </th>

                      <th className="w-[19%] break-words px-1 py-3 sm:px-3 md:px-5">
                        বিভাগ
                      </th>

                      <th className="w-[18%] break-words px-1 py-3 sm:px-3 md:px-5">
                        সর্বনিম্ন
                      </th>

                      <th className="w-[19%] break-words px-1 py-3 sm:px-3 md:px-5">
                        সর্বাধিক
                      </th>

                      <th className="w-[19%] break-words px-1 py-3 text-right sm:px-3 md:px-5">
                        গড়
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-[10px] text-gray-700 sm:text-xs md:text-sm">
                    {markets.map((market, index) => {
                      const average = getAverage(market.min, market.max);

                      return (
                        <tr
                          key={`${market.market}-${market.division}-${index}`}
                          className="odd:bg-[#FAFCFA] even:bg-white transition-colors hover:bg-emerald-50/40"
                        >
                          <td className="break-words px-1.5 py-3 font-medium leading-relaxed text-gray-900 sm:px-3 md:px-5">
                            {market.market}
                          </td>

                          <td className="break-words px-1 py-3 leading-relaxed text-gray-500 sm:px-3 md:px-5">
                            {market.division}
                          </td>

                          <td className="break-words px-1 py-3 leading-relaxed sm:px-3 md:px-5">
                            {toBengaliNumber(market.min)} টাকা
                          </td>

                          <td className="break-words px-1 py-3 leading-relaxed sm:px-3 md:px-5">
                            {toBengaliNumber(market.max)} টাকা
                          </td>

                          <td className="break-words px-1 py-3 text-right font-bold leading-relaxed text-gray-900 sm:px-3 md:px-5">
                            {toBengaliNumber(average)} টাকা
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}

        {!loading && !selectedProduct && !error && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
            <p className="text-sm text-gray-500">
              কোনো পণ্যের তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
