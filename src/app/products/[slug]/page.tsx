"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const resolvedParams = await params;
        const slug = resolvedParams.slug;

        const allProductsRes = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
          {
            signal: controller.signal,
          },
        );

        if (!allProductsRes.ok) {
          throw new Error("Failed to fetch products");
        }

        const allProducts: Product[] = await allProductsRes.json();

        const foundProduct = allProducts.find((item) => item.slug === slug);

        if (!foundProduct) {
          throw new Error("Product not found");
        }

        const productRes = await fetch(
          `https://api.api-store.workers.dev/api/bazardor/products/${foundProduct.id}`,
          {
            signal: controller.signal,
          },
        );

        if (!productRes.ok) {
          throw new Error("Failed to fetch product details");
        }

        const productData: Product = await productRes.json();

        if (!controller.signal.aborted) {
          setProduct(productData);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching product:", error);

          if (!controller.signal.aborted) {
            setProduct(null);
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F8F9FA] px-3 py-5 sm:px-5 sm:py-7 md:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-5xl animate-pulse">
          {/* Breadcrumb Skeleton */}
          <div className="mb-4 flex items-center gap-2 sm:mb-5">
            <div className="h-3 w-10 rounded bg-gray-200 sm:h-4 sm:w-12" />
            <div className="h-3 w-2 rounded bg-gray-100 sm:h-4" />
            <div className="h-3 w-20 rounded bg-gray-200 sm:h-4 sm:w-24" />
            <div className="h-3 w-2 rounded bg-gray-100 sm:h-4" />
            <div className="h-3 w-24 rounded bg-gray-200 sm:h-4 sm:w-32" />
          </div>

          {/* Product Header Skeleton */}
          <section className="mb-5 rounded-2xl bg-[#F3F4F6]/90 p-4 sm:mb-6 sm:rounded-3xl sm:p-6 md:p-7 lg:p-8">
            <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200 sm:h-16 sm:w-16 sm:rounded-2xl md:h-20 md:w-20" />

                <div className="min-w-0 flex-1">
                  <div className="h-6 w-40 rounded-lg bg-gray-200 sm:h-7 sm:w-52 md:h-9 md:w-64" />

                  <div className="mt-2 h-3.5 w-32 rounded bg-gray-200 sm:h-4 sm:w-40 md:h-5 md:w-48" />

                  <div className="mt-2 h-3 w-52 rounded bg-gray-100 sm:h-3.5 sm:w-72 md:w-80" />
                </div>
              </div>

              <div className="w-full border-t border-gray-200 pt-4 md:w-auto md:border-t-0 md:pt-0">
                <div className="h-8 w-36 rounded-lg bg-gray-200 sm:h-9 sm:w-44 md:h-11 md:w-52" />

                <div className="mt-2 h-4 w-16 rounded bg-gray-100 sm:h-5 sm:w-20 md:ml-auto" />
              </div>
            </div>
          </section>

          {/* Summary Title Skeleton */}
          <div className="mb-3 h-5 w-32 rounded bg-gray-200 sm:mb-4 sm:h-6 sm:w-40" />

          {/* Summary Cards Skeleton */}
          <section className="mb-7 sm:mb-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5"
                >
                  <div className="h-3 w-20 rounded bg-gray-100 sm:w-24" />

                  <div className="mt-3 h-7 w-28 rounded bg-gray-200 sm:h-8 sm:w-32" />

                  <div className="mt-2 h-3 w-32 rounded bg-gray-100 sm:w-40" />
                </div>
              ))}
            </div>
          </section>

          {/* Market Title Skeleton */}
          <div className="mb-3 h-5 w-44 rounded bg-gray-200 sm:mb-4 sm:h-6 sm:w-52" />

          {/* Market Table Skeleton */}
          <section className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:mb-10 sm:rounded-2xl">
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-5 gap-4 bg-gray-100/70 px-4 py-3.5 sm:px-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className={`h-3 rounded bg-gray-200 ${
                        item === 5 ? "ml-auto w-10" : "w-16"
                      }`}
                    />
                  ))}
                </div>

                {[1, 2, 3, 4, 5].map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-5 items-center gap-4 border-t border-gray-100 px-4 py-4 sm:px-6"
                  >
                    <div className="h-3.5 w-24 rounded bg-gray-200" />
                    <div className="h-3.5 w-20 rounded bg-gray-100" />
                    <div className="h-3.5 w-16 rounded bg-gray-100" />
                    <div className="h-3.5 w-16 rounded bg-gray-100" />
                    <div className="ml-auto h-3.5 w-20 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Category Skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="h-5 w-32 rounded bg-gray-200 sm:h-6 sm:w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F9FA] px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-3 text-5xl sm:text-6xl">😕</div>

          <h1 className="text-lg font-bold text-gray-800 sm:text-xl">
            পণ্যটি পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            এই পণ্যের তথ্য বর্তমানে পাওয়া যাচ্ছে না।
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-[#0F9D58] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const minPrice =
    product.markets.length > 0
      ? Math.min(...product.markets.map((m) => m.min))
      : 0;

  const maxPrice =
    product.markets.length > 0
      ? Math.max(...product.markets.map((m) => m.max))
      : 0;

  const minPriceMarket =
    product.markets.find((m) => m.min === minPrice)?.market ||
    "সবচেয়ে কম দামের বাজার";

  const maxPriceMarket =
    product.markets.find((m) => m.max === maxPrice)?.market ||
    "সবচেয়ে বেশি দামের বাজার";

  const totalAvg =
    product.markets.length > 0
      ? product.markets.reduce(
          (acc, m) => acc + (m.min + m.max) / 2,
          0,
        ) / product.markets.length
      : 0;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isFlat = product.change.dir === "flat";

  const unitText = getUnitText(product.unit);

  const productEmoji =
    product.image?.trim() || product.categoryIcon || "🛍️";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F9FA] text-[#3C4043]">
      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-5 sm:py-7 md:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 sm:mb-5 sm:text-sm">
          <Link
            href="/"
            className="rounded transition-colors hover:text-emerald-700"
          >
            হোম
          </Link>

          <span className="text-gray-400">›</span>

          <Link
            href={`/category/${product.category}`}
            className="rounded transition-colors hover:text-emerald-700"
          >
            {product.categoryNameBn}
          </Link>

          <span className="text-gray-400">›</span>

          <span className="max-w-[160px] truncate font-medium text-gray-800 sm:max-w-xs md:max-w-md">
            {product.nameBn}
          </span>
        </nav>

        {/* Product Header */}
        <section className="group mb-5 rounded-2xl bg-[#F3F4F6]/90 p-4 transition-all duration-200 hover:bg-[#F0F1F3] hover:shadow-sm sm:mb-6 sm:rounded-3xl sm:p-6 md:p-7 lg:p-8">
          <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 transition-transform duration-200 group-hover:scale-[1.03] sm:h-16 sm:w-16 sm:rounded-2xl md:h-20 md:w-20">
                <span className="text-3xl leading-none sm:text-4xl md:text-5xl">
                  {productEmoji}
                </span>
              </div>

              <div className="min-w-0">
                <h1 className="break-words text-xl font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-[#008a48] sm:text-2xl md:text-3xl">
                  {product.nameBn}
                </h1>

                <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm md:text-base">
                  প্রতি {unitText} · {product.categoryNameBn}
                </p>

                <p className="mt-1 max-w-xl text-[11px] leading-5 text-gray-400 sm:text-xs md:text-sm">
                  {isUp
                    ? "গতকালকের তুলনায় আজ দাম বেড়েছে"
                    : isDown
                      ? "গতকালকের তুলনায় আজ দাম কমেছে"
                      : "গতকালকের তুলনায় আজ দাম অপরিবর্তিত রয়েছে"}{" "}
                  {!isFlat && (
                    <>{toBengaliNumber(product.change.pct)}%</>
                  )}
                </p>
              </div>
            </div>

            <div className="w-full shrink-0 border-t border-gray-200 pt-4 text-left sm:pt-0 md:w-auto md:border-t-0 md:text-right">
              <div className="text-2xl font-black leading-tight text-gray-900 sm:text-3xl md:text-4xl">
                {toBengaliNumber(product.today)}{" "}
                <span className="text-sm font-semibold text-gray-600 sm:text-base md:text-xl">
                  টাকা / {unitText}
                </span>
              </div>

              {!isFlat ? (
                <div
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-bold sm:text-sm md:justify-end ${
                    isUp ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  <span>{isUp ? "▲" : "▼"}</span>
                  <span>{toBengaliNumber(product.change.pct)}%</span>
                </div>
              ) : (
                <div className="mt-1 text-xs font-bold text-gray-400 sm:text-sm">
                  — অপরিবর্তিত
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-7 sm:mb-8">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md sm:rounded-2xl sm:p-5">
              <p className="text-xs font-medium text-gray-400 transition-colors group-hover:text-gray-500">
                সর্বনিম্ন দাম
              </p>

              <div className="mt-2 text-xl font-black text-[#0F9D58] transition-colors group-hover:text-[#008a48] sm:text-2xl">
                {toBengaliNumber(minPrice)}{" "}
                <span className="text-sm font-medium sm:text-base">
                  টাকা
                </span>
              </div>

              <p className="mt-1 truncate text-xs text-gray-400">
                {minPriceMarket}
              </p>
            </div>

            <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md sm:rounded-2xl sm:p-5">
              <p className="text-xs font-medium text-gray-400 transition-colors group-hover:text-gray-500">
                সর্বাধিক দাম
              </p>

              <div className="mt-2 text-xl font-black text-red-500 sm:text-2xl">
                {toBengaliNumber(maxPrice)}{" "}
                <span className="text-sm font-medium sm:text-base">
                  টাকা
                </span>
              </div>

              <p className="mt-1 truncate text-xs text-gray-400">
                {maxPriceMarket}
              </p>
            </div>

            <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md sm:col-span-2 sm:p-5 lg:col-span-1">
              <p className="text-xs font-medium text-gray-400 transition-colors group-hover:text-gray-500">
                গড় দাম
              </p>

              <div className="mt-2 text-xl font-black text-[#0F9D58] transition-colors group-hover:text-[#008a48] sm:text-2xl">
                {toBengaliNumber(totalAvg.toFixed(2))}{" "}
                <span className="text-sm font-medium sm:text-base">
                  টাকা
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                প্রতি {unitText}-এর হিসাবে
              </p>
            </div>
          </div>
        </section>

        {/* Market Table */}
        <section className="mb-8 sm:mb-10">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md sm:rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100/60 text-[11px] font-semibold text-gray-500 sm:text-xs">
                    <th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-3.5">
                      বাজার
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-3.5">
                      বিভাগ
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-3.5">
                      সর্বনিম্ন
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-3.5">
                      সর্বাধিক
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-right sm:px-6 sm:py-3.5">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-700">
                  {product.markets.map((m, idx) => {
                    const avg = ((m.min + m.max) / 2).toFixed(2);

                    return (
                      <tr
                        key={`${m.market}-${idx}`}
                        className="odd:bg-[#F0F2EF] even:bg-white transition-colors duration-150 hover:bg-green-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-900 sm:px-6 sm:py-4">
                          {m.market}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-500 sm:px-6 sm:py-4">
                          {m.division}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-800 sm:px-6 sm:py-4">
                          {toBengaliNumber(m.min)} টাকা
                        </td>

                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-800 sm:px-6 sm:py-4">
                          {toBengaliNumber(m.max)} টাকা
                        </td>

                        <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold text-gray-900 sm:px-6 sm:py-4">
                          {toBengaliNumber(avg)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Category Link */}
        <div className="mb-6 sm:mb-8">
          <Link
            href={`/category/${product.category}`}
            className="group inline-flex items-center gap-2 rounded-lg py-2 text-sm font-bold text-gray-900 transition-all duration-200 hover:text-emerald-600 sm:text-base"
          >
            <span className="text-lg transition-transform duration-200 group-hover:scale-110">
              {product.categoryIcon}
            </span>

            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              সব {product.categoryNameBn}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}