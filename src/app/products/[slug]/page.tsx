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
      <div className="min-h-screen bg-[#F4F6F4] px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-4 w-36 rounded bg-gray-200" />
          <div className="h-32 rounded-2xl bg-gray-200" />
          <div className="h-6 w-32 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-24 rounded-xl bg-gray-200" />
            <div className="h-24 rounded-xl bg-gray-200" />
            <div className="h-24 rounded-xl bg-gray-200" />
          </div>
          <div className="h-64 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F4F6F4] px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-3 text-5xl">😕</div>
          <h1 className="text-xl font-bold text-gray-800">
            পণ্যটি পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            এই পণ্যের তথ্য বর্তমানে পাওয়া যাচ্ছে না।
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-[#0F9D58] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
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
      ? product.markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) /
        product.markets.length
      : 0;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isFlat = product.change.dir === "flat";

  const unitText = getUnitText(product.unit);
  const productEmoji = product.image?.trim() || product.categoryIcon || "🥛";

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#2C3E50]">
      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
          <Link href="/" className="hover:text-emerald-700">
            হোম
          </Link>
          <span>›</span>
          <Link
            href={`/category/${product.category}`}
            className="hover:text-emerald-700"
          >
            {product.categoryNameBn}
          </Link>
          <span>›</span>
          <span className="font-medium text-gray-800">{product.nameBn}</span>
        </nav>

        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F0F5F1] text-3xl sm:h-20 sm:w-20 sm:text-4xl">
                {productEmoji}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {product.nameBn}
                </h1>
                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  প্রতি {unitText} · {product.categoryNameBn}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {isUp
                    ? "গতকালকের তুলনায় আজ দাম বেড়েছে"
                    : isDown
                      ? "গতকালকের তুলনায় আজ দাম কমেছে"
                      : "গতকালকের তুলনায় আজ দাম অপরিবর্তিত রয়েছে"}{" "}
                  {!isFlat && (
                    <span className="font-semibold text-red-500">
                      {toBengaliNumber(product.change.pct)}%
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start rounded-xl border border-gray-100 bg-[#F9FAF9] p-3 text-left sm:items-center sm:text-center">
              <span className="text-[11px] font-medium text-gray-400">
                আজকের দাম
              </span>
              <div className="mt-0.5 text-2xl font-black text-gray-900 sm:text-3xl">
                {toBengaliNumber(product.today)}
              </div>
              <span className="text-xs text-gray-500">টাকা / {unitText}</span>

              {!isFlat && (
                <div
                  className={`mt-1 inline-flex items-center gap-1 text-[11px] font-bold ${
                    isUp ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  <span>{isUp ? "▲" : "▼"}</span>
                  <span>{toBengaliNumber(product.change.pct)}%</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4 text-left shadow-xs">
              <p className="text-xs font-medium text-gray-400">সর্বনিম্ন দাম</p>
              <div className="mt-1 text-xl font-bold text-[#0F9D58] sm:text-2xl">
                {toBengaliNumber(minPrice)}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>
              <p className="mt-1 truncate text-[11px] text-gray-400">
                {minPriceMarket}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 text-left shadow-xs">
              <p className="text-xs font-medium text-gray-400">সর্বাধিক দাম</p>
              <div className="mt-1 text-xl font-bold text-red-500 sm:text-2xl">
                {toBengaliNumber(maxPrice)}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>
              <p className="mt-1 truncate text-[11px] text-gray-400">
                {maxPriceMarket}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 text-left shadow-xs">
              <p className="text-xs font-medium text-gray-400">গড় দাম</p>
              <div className="mt-1 text-xl font-bold text-[#0F9D58] sm:text-2xl">
                {toBengaliNumber(totalAvg.toFixed(2))}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-400">
                প্রতি {unitText} এর হিসাবে
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F7F9F7] text-gray-600">
                    <th className="px-4 py-3 font-medium">বাজার</th>
                    <th className="px-4 py-3 font-medium">বিভাগ</th>
                    <th className="px-4 py-3 font-medium">সর্বনিম্ন</th>
                    <th className="px-4 py-3 font-medium">সর্বাধিক</th>
                    <th className="px-4 py-3 text-right font-medium">গড়</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {product.markets.map((m, idx) => {
                    const avg = ((m.min + m.max) / 2).toFixed(2);

                    return (
                      <tr
                        key={`${m.market}-${idx}`}
                        className="odd:bg-[#FAFCFA] even:bg-white hover:bg-emerald-50/40"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {m.market}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {m.division}
                        </td>
                        <td className="px-4 py-3">
                          {toBengaliNumber(m.min)} টাকা
                        </td>
                        <td className="px-4 py-3">
                          {toBengaliNumber(m.max)} টাকা
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
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

        <div className="mb-6">
          <Link
            href={`/category/${product.category}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-emerald-700"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-xs text-white">
              ■
            </span>
            <span>সব {product.categoryNameBn}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
