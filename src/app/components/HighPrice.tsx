"use client";

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
          "https://api.api-store.workers.dev/api/bazardor/products"
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
      <section className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 md:px-7 md:py-7 lg:px-10 lg:py-8 xl:px-14">
        <div className="mb-4 h-7 w-40 animate-pulse rounded-lg bg-gray-200 sm:mb-5 sm:h-8 sm:w-48" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse rounded-xl bg-gray-100 sm:h-[150px] sm:rounded-2xl"
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
    <section className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5 sm:py-6 md:px-7 md:py-7 lg:px-10 lg:py-8 xl:px-14">
      {/* SECTION HEADER */}
      <div className="mb-4 flex items-center gap-1.5 sm:mb-5 sm:gap-2">
        <span className="text-base text-red-500 sm:text-lg md:text-xl">
          ▲
        </span>

        <h2 className="text-base font-black text-gray-900 sm:text-lg md:text-xl lg:text-2xl">
          আজ দাম বেড়েছে
        </h2>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex min-w-0 flex-col justify-between rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:rounded-2xl sm:p-4 md:p-5"
          >
            {/* TOP ROW */}
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 md:gap-3.5">
              {/* PRODUCT ICON */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f4f3] text-xl sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl md:h-14 md:w-14">
                {product.image || product.categoryIcon}
              </div>

              {/* TITLE + UNIT */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold leading-tight text-gray-900 sm:text-base md:text-lg">
                  {product.nameBn}
                </h3>

                <p className="mt-0.5 truncate text-[10px] font-medium text-gray-400 sm:text-xs">
                  প্রতি {getUnitText(product.unit)}
                </p>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="mt-4 flex min-w-0 items-end justify-between gap-2 border-t border-gray-50 pt-3 sm:mt-5 sm:pt-3.5 md:mt-6">
              {/* PRICE */}
              <div className="min-w-0">
                <span className="block text-[9px] font-medium text-gray-400 sm:text-[10px] md:text-xs">
                  আজকের দাম
                </span>

                <div className="mt-0.5 flex min-w-0 items-baseline gap-1 sm:mt-1">
                  <span className="truncate text-lg font-black text-gray-900 sm:text-xl md:text-2xl">
                    {toBengaliNumber(product.today)}
                  </span>

                  <span className="shrink-0 text-[11px] font-semibold text-gray-800 sm:text-xs md:text-sm">
                    টাকা
                  </span>
                </div>
              </div>

              {/* PERCENTAGE BADGE */}
              <div className="inline-flex shrink-0 items-center rounded-full bg-[#f4f7f4] px-2.5 py-1 text-[10px] font-bold text-[#d9383a] sm:px-3 sm:py-1.5 sm:text-xs">
                ▲ {toBengaliNumber(Math.abs(product.change.pct))}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}