"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

type SortOption = "default" | "price-low" | "price-high";

const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return num
    .toString()
    .replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

const getUnitText = (unit: string): string => {
  switch (unit.toLowerCase()) {
    case "kg":
      return "কেজি";

    case "litre":
      return "লিটার";

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

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSort, setSelectedSort] =
    useState<SortOption>("default");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
          {
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Error fetching products:", error);
          setProducts([]);
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

  const sortedProducts = useMemo(() => {
    const list = [...products];

    switch (selectedSort) {
      case "price-low":
        return list.sort((a, b) => a.today - b.today);

      case "price-high":
        return list.sort((a, b) => b.today - a.today);

      default:
        return list;
    }
  }, [products, selectedSort]);

  if (loading) {
    return (
      <section
        id="all-products"
        className="mx-auto w-full max-w-7xl scroll-mt-20 px-3 py-4 sm:px-5 sm:py-5 md:px-7 md:py-6 lg:px-10 lg:py-7 xl:px-14"
      >
        <div className="mb-3.5 flex flex-col gap-2.5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:mb-5">
          <div className="min-w-0">
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200 sm:h-6 sm:w-24 md:h-7 md:w-28" />

            <div className="mt-2 h-3 w-36 animate-pulse rounded bg-gray-100 sm:w-44" />
          </div>

          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <div className="h-3 w-8 animate-pulse rounded bg-gray-100" />

            <div className="h-9 w-full animate-pulse rounded-lg bg-gray-100 sm:h-8 sm:w-40" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-w-0 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-3.5 md:p-4"
            >
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-gray-200 sm:h-11 sm:w-11 sm:rounded-xl md:h-12 md:w-12" />

                <div className="min-w-0 flex-1">
                  <div
                    className="h-3.5 animate-pulse rounded bg-gray-200 sm:h-4 md:h-5"
                    style={{
                      width:
                        index % 3 === 0
                          ? "65%"
                          : index % 2 === 0
                            ? "78%"
                            : "55%",
                    }}
                  />

                  <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-gray-100 sm:h-3 sm:w-24" />
                </div>
              </div>

              <div className="mt-3 flex min-w-0 items-end justify-between gap-2 border-t border-gray-50 pt-2.5 sm:mt-4 sm:pt-3">
                <div className="min-w-0 flex-1">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-gray-100 sm:h-3 sm:w-20" />

                  <div className="mt-2 h-5 w-24 animate-pulse rounded bg-gray-200 sm:h-6 sm:w-28 md:h-7 md:w-32" />
                </div>

                <div className="h-6 w-14 shrink-0 animate-pulse rounded-full bg-gray-100 sm:h-7 sm:w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="all-products"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-3 py-4 sm:px-5 sm:py-5 md:px-7 md:py-6 lg:px-10 lg:py-7 xl:px-14"
    >
      <div className="mb-3.5 flex flex-col gap-2.5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 md:mb-5">
        <div className="min-w-0">
          <h2 className="text-sm font-black text-gray-900 sm:text-base md:text-lg lg:text-xl">
            সব পণ্য
          </h2>

          <p className="mt-0.5 text-[9px] font-medium text-gray-500 sm:text-[10px] md:text-xs">
            মোট {toBengaliNumber(sortedProducts.length)}টি পণ্য
            দেখানো হচ্ছে
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2 text-[10px] font-medium text-gray-500 sm:w-auto sm:justify-end sm:gap-2.5 sm:text-xs">
          <span className="shrink-0">সাজান</span>

          <div className="relative min-w-0 flex-1 sm:w-auto sm:flex-none">
            <select
              value={selectedSort}
              onChange={(e) =>
                setSelectedSort(
                  e.target.value as SortOption,
                )
              }
              className="w-full min-w-0 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-2.5 pr-8 text-[10px] font-semibold text-gray-800 shadow-sm outline-none transition-all duration-200 hover:border-green-200 hover:bg-green-50/40 focus:border-[#008a48] focus:ring-2 focus:ring-[#008a48]/10 sm:w-auto sm:py-1.5 sm:pl-3 sm:pr-8 sm:text-xs md:pl-3.5"
            >
              <option value="default">ডিফল্ট</option>

              <option value="price-low">
                দাম: কম থেকে বেশি
              </option>

              <option value="price-high">
                দাম: বেশি থেকে কম
              </option>
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 sm:right-2.5 sm:h-4 sm:w-4"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {sortedProducts.map((product) => {
          const isUp = product.change?.dir === "up";
          const isDown = product.change?.dir === "down";

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block min-w-0 rounded-xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#008a48]/20 sm:rounded-2xl"
            >
              <div className="flex min-w-0 flex-col justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-green-200 group-hover:shadow-[0_8px_24px_rgba(0,138,72,0.10)] group-focus-visible:border-green-300 group-active:translate-y-0 group-active:scale-[0.99] sm:rounded-2xl sm:p-3.5 md:p-4">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f2f4f3] text-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-green-50 sm:h-11 sm:w-11 sm:rounded-xl sm:text-xl md:h-12 md:w-12">
                    {product.image ||
                      product.categoryIcon ||
                      "📦"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-[#008a48] sm:text-sm md:text-base">
                      {product.nameBn}
                    </h3>

                    <p className="mt-0.5 truncate text-[9px] font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-500 sm:text-[10px] md:text-[11px]">
                      প্রতি {getUnitText(product.unit)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex min-w-0 items-end justify-between gap-2 border-t border-gray-50 pt-2.5 transition-colors duration-200 group-hover:border-green-50 sm:mt-4 sm:pt-3">
                  <div className="min-w-0">
                    <span className="block text-[8px] font-medium text-gray-400 sm:text-[9px] md:text-[10px]">
                      আজকের দাম
                    </span>

                    <div className="mt-0.5 flex min-w-0 items-baseline gap-1">
                      <span className="truncate text-base font-black text-gray-900 transition-colors duration-200 group-hover:text-[#008a48] sm:text-lg md:text-xl">
                        {toBengaliNumber(product.today)}
                      </span>

                      <span className="shrink-0 text-[10px] font-semibold text-gray-800 sm:text-[11px] md:text-xs">
                        টাকা
                      </span>
                    </div>
                  </div>

                  <div
                    className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-bold transition-all duration-200 group-hover:scale-105 sm:px-2.5 sm:py-1 sm:text-[10px] md:text-[11px] ${
                      isUp
                        ? "bg-[#fdf2f2] text-[#d9383a] group-hover:bg-[#fbe7e7]"
                        : isDown
                          ? "bg-[#eef7f2] text-[#008a48] group-hover:bg-[#e1f3e9]"
                          : "bg-[#f3f4f6] text-gray-500 group-hover:bg-gray-100"
                    }`}
                  >
                    {isUp &&
                      `▲ ${toBengaliNumber(
                        Math.abs(product.change?.pct || 0),
                      )}%`}

                    {isDown &&
                      `▼ ${toBengaliNumber(
                        Math.abs(product.change?.pct || 0),
                      )}%`}

                    {!isUp &&
                      !isDown &&
                      `— ${toBengaliNumber(0)}%`}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}