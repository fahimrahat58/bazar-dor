"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  nameBn: string;
  image?: string;
  today: number;
  unit: string;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

export default function ProductMarquee() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const productList: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];

        setProducts(productList);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching marquee data:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="w-full overflow-hidden border-y border-slate-200 bg-slate-50 py-2">
        <div className="flex w-max items-center">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="mx-3 inline-flex shrink-0 items-center gap-1.5 py-1 sm:mx-4 sm:gap-2"
            >
              <div className="h-7 w-7 animate-pulse rounded-md bg-slate-200 sm:h-8 sm:w-8" />

              <div
                className="h-3 animate-pulse rounded bg-slate-200 sm:h-3.5"
                style={{
                  width: `${
                    index % 3 === 0
                      ? 72
                      : index % 2 === 0
                        ? 88
                        : 64
                  }px`,
                }}
              />

              <div className="h-3 w-16 animate-pulse rounded bg-slate-100 sm:h-3.5 sm:w-20" />

              <div className="h-3 w-10 animate-pulse rounded bg-slate-100 sm:h-3.5 sm:w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const renderProducts = (items: Product[], copy = false) =>
    items.map((item, index) => {
      const isUp = item.change?.dir === "up";
      const isDown = item.change?.dir === "down";
      const pct = Math.abs(item.change?.pct ?? 0);

      return (
        <div
          key={`${copy ? "copy-" : ""}${item.id}-${index}`}
          aria-hidden={copy || undefined}
          className="mx-3 inline-flex shrink-0 flex-nowrap items-center gap-1.5 whitespace-nowrap py-1 text-xs text-slate-700 sm:mx-4 sm:gap-2 sm:text-sm"
        >
          {/* Product-wise image */}
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-base sm:h-8 sm:w-8">
            {item.image || "🛒"}
          </span>

          <span className="font-semibold text-slate-900">
            {item.nameBn}
          </span>

          <span className="text-slate-600">
            ৳{item.today}/{item.unit}
          </span>

          {item.change && item.change.dir !== "flat" && (
            <span
              className={`font-bold ${
                isUp
                  ? "text-red-600"
                  : isDown
                    ? "text-green-600"
                    : ""
              }`}
            >
              {isUp ? "▲" : "▼"} {pct}%
            </span>
          )}
        </div>
      );
    });

  return (
    <div className="w-full overflow-hidden border-y border-slate-200 bg-slate-50 py-2">
      <div className="market-marquee flex w-max flex-nowrap">
        <div className="flex w-max shrink-0 flex-nowrap">
          {renderProducts(products)}
        </div>

        <div
          className="flex w-max shrink-0 flex-nowrap"
          aria-hidden="true"
        >
          {renderProducts(products, true)}
        </div>
      </div>

      <style jsx>{`
        .market-marquee {
          animation: market-scroll 60s linear infinite;
          will-change: transform;
        }

        .market-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes market-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .market-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}