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
      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8f9fa] py-4 sm:py-6 md:py-7 lg:py-8">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
          <div className="animate-pulse space-y-4 sm:space-y-5 md:space-y-6">
            <div className="h-4 w-36 rounded bg-gray-200" />
            <div className="h-32 rounded-xl bg-gray-200 sm:rounded-2xl" />
            <div className="h-6 w-32 rounded bg-gray-200" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
              <div className="h-24 rounded-xl bg-gray-200 sm:rounded-2xl" />
              <div className="h-24 rounded-xl bg-gray-200 sm:rounded-2xl" />
              <div className="h-24 rounded-xl bg-gray-200 sm:rounded-2xl" />
            </div>

            <div className="h-64 rounded-xl bg-gray-200 sm:rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8f9fa] py-4 sm:py-6 md:py-7 lg:py-8">
        <div className="mx-auto w-full max-w-7xl min-w-0 px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
          <div className="flex min-h-[60vh] items-center justify-center rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:rounded-2xl sm:p-12">
            <div className="w-full max-w-md text-center">
              <div className="mb-3 text-4xl sm:text-5xl">🔍</div>

              <h1 className="text-base font-bold text-gray-800 sm:text-lg">
                পণ্যটি পাওয়া যায়নি
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                এই পণ্যের তথ্য বর্তমানে পাওয়া যাচ্ছে না।
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
          </div>
        </div>
      </main>
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

  const percentageColor = isUp
    ? "text-red-500"
    : isDown
      ? "text-emerald-600"
      : "text-gray-500";

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f8f9fa] py-4 text-[#2C3E50] sm:py-6 md:py-7 lg:py-8">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
          <Link href="/" className="transition-colors hover:text-emerald-700">
            হোম
          </Link>

          <span>›</span>

          <Link
            href={`/category/${product.category}`}
            className="transition-colors hover:text-emerald-700"
          >
            {product.categoryNameBn}
          </Link>

          <span>›</span>

          <span className="font-medium text-gray-800">{product.nameBn}</span>
        </nav>

        <section className="mb-4 w-full min-w-0 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:mb-5 sm:rounded-2xl sm:p-5 md:mb-6 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 md:gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0F5F1] text-2xl sm:h-14 sm:w-14 sm:rounded-xl sm:text-3xl md:h-16 md:w-16 md:text-4xl">
                {productEmoji}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-black text-gray-900 sm:text-xl md:text-2xl">
                  {product.nameBn}
                </h1>

                <p className="mt-0.5 truncate text-[10px] font-medium leading-relaxed text-gray-500 sm:text-xs md:text-sm">
                  প্রতি {unitText} · {product.categoryNameBn}
                </p>

                <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                  {isUp
                    ? "গতকালকের তুলনায় আজ দাম বেড়েছে"
                    : isDown
                      ? "গতকালকের তুলনায় আজ দাম কমেছে"
                      : "গতকালকের তুলনায় আজ দাম অপরিবর্তিত রয়েছে"}{" "}
                  <span className={`font-bold ${percentageColor}`}>
                    {toBengaliNumber(product.change.pct)}%
                  </span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start rounded-xl border border-gray-100 bg-[#F9FAF9] p-3 text-left sm:items-center sm:text-center">
              <span className="text-[10px] font-medium text-gray-400 sm:text-[11px]">
                আজকের দাম
              </span>

              <div className="mt-0.5 text-xl font-black text-gray-900 sm:text-2xl md:text-3xl">
                {toBengaliNumber(product.today)}

                <span className="text-xs font-semibold text-gray-600 sm:text-sm md:text-base">
                  {" "}
                  টাকা / {unitText}
                </span>
              </div>

              <div
                className={`mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold sm:text-[11px] ${
                  isUp
                    ? "bg-red-50 text-red-600"
                    : isDown
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className="text-xs">
                  {isUp ? "▲" : isDown ? "▼" : "—"}
                </span>

                <span>{toBengaliNumber(product.change.pct)}%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5 sm:mb-6">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 text-left shadow-sm sm:rounded-2xl sm:p-4 md:p-4.5">
              <p className="text-[10px] font-medium text-gray-400 sm:text-xs">
                সর্বনিম্ন দাম
              </p>

              <div className="mt-1 text-lg font-black text-[#0F9D58] sm:text-xl md:text-2xl">
                {toBengaliNumber(minPrice)}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>

              <p className="mt-1 truncate text-[10px] text-gray-400 sm:text-[11px]">
                {minPriceMarket}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-3.5 text-left shadow-sm sm:rounded-2xl sm:p-4 md:p-4.5">
              <p className="text-[10px] font-medium text-gray-400 sm:text-xs">
                সর্বাধিক দাম
              </p>

              <div className="mt-1 text-lg font-black text-red-500 sm:text-xl md:text-2xl">
                {toBengaliNumber(maxPrice)}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>

              <p className="mt-1 truncate text-[10px] text-gray-400 sm:text-[11px]">
                {maxPriceMarket}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-3.5 text-left shadow-sm sm:rounded-2xl sm:p-4 md:p-4.5">
              <p className="text-[10px] font-medium text-gray-400 sm:text-xs">
                গড় দাম
              </p>

              <div className="mt-1 text-lg font-black text-[#0F9D58] sm:text-xl md:text-2xl">
                {toBengaliNumber(totalAvg.toFixed(2))}{" "}
                <span className="text-xs font-normal text-gray-600">টাকা</span>
              </div>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-[11px]">
                প্রতি {unitText} এর হিসাবে
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F7F9F7] text-[11px] font-semibold text-gray-600 sm:text-xs">
                    <th className="px-3.5 py-3 sm:px-5">বাজার</th>
                    <th className="px-3.5 py-3 sm:px-5">বিভাগ</th>
                    <th className="px-3.5 py-3 sm:px-5">সর্বনিম্ন</th>
                    <th className="px-3.5 py-3 sm:px-5">সর্বাধিক</th>
                    <th className="px-3.5 py-3 text-right sm:px-5">গড়</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-xs text-gray-700 sm:text-sm">
                  {product.markets.map((m, idx) => {
                    const avg = ((m.min + m.max) / 2).toFixed(2);

                    return (
                      <tr
                        key={`${m.market}-${idx}`}
                        className="odd:bg-[#FAFCFA] even:bg-white hover:bg-emerald-50/40"
                      >
                        <td className="px-3.5 py-3 font-medium text-gray-900 sm:px-5">
                          {m.market}
                        </td>

                        <td className="px-3.5 py-3 text-gray-500 sm:px-5">
                          {m.division}
                        </td>

                        <td className="px-3.5 py-3 sm:px-5">
                          {toBengaliNumber(m.min)} টাকা
                        </td>

                        <td className="px-3.5 py-3 sm:px-5">
                          {toBengaliNumber(m.max)} টাকা
                        </td>

                        <td className="px-3.5 py-3 text-right font-bold text-gray-900 sm:px-5">
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
            className="inline-flex items-center gap-2.5 text-xs font-bold text-gray-800 transition-colors hover:text-emerald-700 sm:text-sm"
          >
            <span className="text-lg sm:text-xl">{product.categoryIcon}</span>

            <span>সব {product.categoryNameBn}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
