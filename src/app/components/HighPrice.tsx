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

export default function PriceUpProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await res.json();

        const top6UpProducts = data
          .filter((item) => item.change?.dir === "up")
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        setProducts(top6UpProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-5 md:px-7 md:py-6 lg:px-10 lg:py-7 xl:px-14">
        <div className="mb-4 h-7 w-32 animate-pulse rounded-lg bg-gray-200 sm:w-40" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[125px] animate-pulse rounded-xl border border-gray-100 bg-gray-100 sm:h-[135px] sm:rounded-2xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-5 md:px-7 md:py-6 lg:px-10 lg:py-7 xl:px-14">
      {/* SECTION HEADER */}
      <div className="mb-3.5 flex items-center gap-1.5 sm:mb-4 sm:gap-2 md:mb-5">
        <span className="text-sm text-red-500 sm:text-base md:text-lg">▲</span>

        <h2 className="text-sm font-black text-gray-900 sm:text-base md:text-lg lg:text-xl">
          আজ দাম বেড়েছে
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block min-w-0 rounded-xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#008a48]/20 sm:rounded-2xl"
          >
            <div className="flex min-w-0 flex-col justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-red-100 group-hover:shadow-[0_8px_24px_rgba(217,56,58,0.08)] group-focus-visible:border-red-200 group-active:translate-y-0 group-active:scale-[0.99] sm:rounded-2xl sm:p-3.5 md:p-4">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f2f4f3] text-lg transition-all duration-300 group-hover:bg-red-50 group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-xl sm:text-xl md:h-12 md:w-12">
                  {product.image || product.categoryIcon || "📦"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-[#d9383a] sm:text-sm md:text-base">
                    {product.nameBn}
                  </h3>

                  <p className="mt-0.5 truncate text-[9px] font-medium text-gray-400 transition-colors duration-200 group-hover:text-gray-500 sm:text-[10px] md:text-[11px]">
                    প্রতি {getUnitText(product.unit)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex min-w-0 items-end justify-between gap-2 border-t border-gray-50 pt-2.5 transition-colors duration-200 group-hover:border-red-50 sm:mt-4 sm:pt-3">
                <div className="min-w-0">
                  <span className="block text-[8px] font-medium text-gray-400 sm:text-[9px] md:text-[10px]">
                    আজকের দাম
                  </span>

                  <div className="mt-0.5 flex min-w-0 items-baseline gap-1">
                    <span className="truncate text-base font-black text-gray-900 transition-colors duration-200 group-hover:text-[#d9383a] sm:text-lg md:text-xl">
                      {toBengaliNumber(product.today)}
                    </span>

                    <span className="shrink-0 text-[10px] font-semibold text-gray-800 sm:text-[11px] md:text-xs">
                      টাকা
                    </span>
                  </div>
                </div>

                <div className="inline-flex shrink-0 items-center rounded-full bg-[#f4f7f4] px-2 py-0.5 text-[9px] font-bold text-[#d9383a] transition-all duration-200 group-hover:scale-105 group-hover:bg-[#fbe7e7] sm:px-2.5 sm:py-1 sm:text-[10px] md:text-[11px]">
                  ▲ {toBengaliNumber(Math.abs(product.change.pct))}%
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
