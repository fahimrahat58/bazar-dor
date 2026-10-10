"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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
  switch (unit.toLowerCase()) {
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
      return unit;
  }
};

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMounted(true);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(PRODUCTS_API);

        if (!response.ok) {
          throw new Error("Products fetch failed");
        }

        const data: Product[] = await response.json();

        setProducts(data);

        if (data.length > 0) {
          setSelectedProductId(String(data[0].id));
        }
      } catch (err) {
        console.error("Products fetch error:", err);
        setError("পণ্যের তথ্য লোড করা যায়নি।");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const selectedProduct = products.find(
    (product) => String(product.id) === selectedProductId,
  );

  const markets = selectedProduct?.markets || [];

  const allMinimumPrices = markets.map((market) => market.min);
  const allMaximumPrices = markets.map((market) => market.max);

  const lowestPrice =
    allMinimumPrices.length > 0 ? Math.min(...allMinimumPrices) : 0;

  const highestPrice =
    allMaximumPrices.length > 0 ? Math.max(...allMaximumPrices) : 0;

  const averagePrice =
    lowestPrice && highestPrice ? getAverage(lowestPrice, highestPrice) : 0;

  const groupedProducts = products.reduce(
    (acc, product) => {
      const categoryName =
        product.categoryNameBn || product.category || "অন্যান্য";

      const categoryIcon = product.categoryIcon || "🛒";

      if (!acc[categoryName]) {
        acc[categoryName] = {
          icon: categoryIcon,
          items: [],
        };
      }

      acc[categoryName].items.push(product);

      return acc;
    },
    {} as Record<
      string,
      {
        icon: string;
        items: Product[];
      }
    >,
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f4f6f4] px-3 py-4 text-gray-800 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              বাজার তুলনা
            </h1>

            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              একটি পণ্য বেছে নিয়ে বিভাগভিত্তিক দাম পাশাপাশি দেখুন।
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200 sm:w-32" />

            <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f4] px-3 py-4 text-gray-800 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            বাজার তুলনা
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
            একটি পণ্য বেছে নিয়ে বিভাগভিত্তিক দাম পাশাপাশি দেখুন।
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-xs text-red-600 sm:px-4 sm:py-4 sm:text-sm">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <label className="mb-2 block text-xs font-semibold text-gray-600 sm:text-sm">
            পণ্য নির্বাচন করুন
          </label>

          {loading ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 sm:flex-1" />

              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 sm:w-32" />
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full min-w-0 flex-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  disabled={products.length === 0}
                  className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-left text-xs text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
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

                  <span className="ml-1 shrink-0 text-[10px] text-gray-400 sm:text-xs">
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="absolute left-0 right-0 z-50 mt-1 max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-xl sm:max-h-80">
                    {/* Search */}
                    <input
                      type="text"
                      placeholder="পণ্য খুঁজুন..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="mb-2 h-9 w-full rounded-md border border-gray-200 px-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-emerald-500 sm:h-10 sm:text-sm"
                    />

                    {Object.keys(groupedProducts).length === 0 ? (
                      <div className="p-3 text-center text-xs text-gray-500 sm:text-sm">
                        কোনো পণ্য পাওয়া যায়নি
                      </div>
                    ) : (
                      Object.entries(groupedProducts).map(
                        ([categoryName, group]) => {
                          const filteredItems = group.items.filter((item) =>
                            item.nameBn
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          );

                          if (filteredItems.length === 0) {
                            return null;
                          }

                          return (
                            <div key={categoryName} className="mb-2 last:mb-0">
                              <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-bold text-gray-500 sm:text-xs">
                                <span>{group.icon}</span>

                                <span className="truncate">{categoryName}</span>
                              </div>

                              {/* Products */}
                              <div className="pl-1 sm:pl-2">
                                {filteredItems.map((product) => (
                                  <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedProductId(String(product.id));

                                      setIsOpen(false);
                                      setSearchQuery("");
                                    }}
                                    className={`flex min-h-9 w-full items-center rounded-md px-2.5 py-2 text-left text-xs transition hover:bg-emerald-50 sm:text-sm ${
                                      String(product.id) === selectedProductId
                                        ? "bg-emerald-100 font-semibold text-emerald-900"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    <span className="truncate">
                                      {product.nameBn}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        },
                      )
                    )}
                  </div>
                )}
              </div>

              {selectedProduct?.slug ? (
                <Link
                  href={`/products/${selectedProduct.slug}`}
                  className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 active:scale-[0.98] sm:w-auto sm:px-5 sm:text-sm"
                >
                  বিস্তারিত দেখুন
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="min-h-10 w-full shrink-0 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-xs font-medium text-gray-400 sm:w-auto sm:px-5 sm:text-sm"
                >
                  বিস্তারিত দেখুন
                </button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:space-y-6 sm:p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 sm:h-11 sm:w-11" />

              <div className="min-w-0 flex-1">
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-52" />

                <div className="mt-2 h-3 w-56 animate-pulse rounded bg-gray-100 sm:w-64" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-lg bg-gray-50 p-3 sm:p-3.5">
                  <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />

                  <div className="mt-3 h-6 w-16 animate-pulse rounded bg-gray-200 sm:h-7" />
                </div>
              ))}
            </div>
          </div>
        ) : selectedProduct ? (
          <div className="space-y-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:space-y-6 sm:p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg sm:h-11 sm:w-11 sm:text-xl">
                {selectedProduct.categoryIcon || selectedProduct.image || "🛒"}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-gray-800 sm:text-lg">
                  {selectedProduct.nameBn}
                </h2>

                <p className="mt-0.5 text-[11px] leading-5 text-gray-500 sm:text-xs">
                  প্রতি {getUnitText(selectedProduct.unit)}-এ আজকের দাম{" "}
                  <span className="font-semibold text-gray-700">
                    {toBengaliNumber(selectedProduct.today)} টাকা
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-3 sm:p-3.5">
                <span className="mb-1 block text-[11px] text-gray-500 sm:text-xs">
                  সর্বনিম্ন
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-emerald-600 sm:text-xl">
                    {toBengaliNumber(lowestPrice)}
                  </span>

                  <span className="text-[10px] text-gray-500 sm:text-xs">
                    টাকা
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 sm:p-3.5">
                <span className="mb-1 block text-[11px] text-gray-500 sm:text-xs">
                  সর্বাধিক
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-rose-500 sm:text-xl">
                    {toBengaliNumber(highestPrice)}
                  </span>

                  <span className="text-[10px] text-gray-500 sm:text-xs">
                    টাকা
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 sm:p-3.5">
                <span className="mb-1 block text-[11px] text-gray-500 sm:text-xs">
                  গড়
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-emerald-600 sm:text-xl">
                    {toBengaliNumber(averagePrice)}
                  </span>

                  <span className="text-[10px] text-gray-500 sm:text-xs">
                    টাকা
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 sm:p-3.5">
                <span className="mb-1 block text-[11px] text-gray-500 sm:text-xs">
                  বাজার সংখ্যা
                </span>

                <span className="text-lg font-extrabold text-gray-800 sm:text-xl">
                  {toBengaliNumber(markets.length)}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200 sm:h-5 sm:w-40" />
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[600px] p-3 sm:min-w-[650px] sm:p-5">
                <div className="grid grid-cols-5 gap-4 border-b border-gray-100 bg-gray-50 px-3 py-3 sm:px-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-3 animate-pulse rounded bg-gray-200"
                    />
                  ))}
                </div>

                {Array.from({ length: 6 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-5 gap-4 border-b border-gray-100 px-3 py-4 sm:px-5"
                  >
                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                      <div
                        key={cellIndex}
                        className="h-3 animate-pulse rounded bg-gray-100"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedProduct ? (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
              <h3 className="text-sm font-bold text-gray-800 sm:text-base">
                বাজারভিত্তিক দাম
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs text-gray-700 sm:min-w-[650px] sm:text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-500 sm:text-xs">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-3 sm:px-5">
                      বাজার
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 sm:px-5">
                      বিভাগ
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 sm:px-5">
                      সর্বনিম্ন
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 sm:px-5">
                      সর্বাধিক
                    </th>

                    <th className="whitespace-nowrap px-3 py-3 text-right sm:px-5">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {markets.map((market, index) => {
                    const average = getAverage(market.min, market.max);

                    return (
                      <tr
                        key={`${market.market}-${index}`}
                        className="transition-colors hover:bg-gray-50/60"
                      >
                        <td className="max-w-[150px] truncate px-3 py-3 font-medium text-gray-800 sm:max-w-none sm:px-5">
                          {market.market}
                        </td>

                        <td className="whitespace-nowrap px-3 py-3 text-gray-500 sm:px-5">
                          {market.division}
                        </td>

                        <td className="whitespace-nowrap px-3 py-3 text-gray-700 sm:px-5">
                          {toBengaliNumber(market.min)} টাকা
                        </td>

                        <td className="whitespace-nowrap px-3 py-3 text-gray-700 sm:px-5">
                          {toBengaliNumber(market.max)} টাকা
                        </td>

                        <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-gray-800 sm:px-5">
                          {toBengaliNumber(average)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {!loading && !selectedProduct && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
            <p className="text-xs text-gray-500 sm:text-sm">
              কোনো পণ্যের তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
