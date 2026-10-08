"use client";

import React, { useEffect, useState } from "react";

type Product = {
  id: number;
  nameBn: string;
  image?: string;
  categoryIcon?: string;
  today: number;
  unit: string;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

const ProductMarquee = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
        );

        const data = await response.json();

        const productList = Array.isArray(data) ? data : data.products || [];

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching marquee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full border-y border-slate-200 bg-slate-50 px-3 py-2 text-center text-[10px] text-slate-500 sm:px-4 sm:py-2.5 sm:text-xs md:py-3 md:text-sm">
        আজকের বাজার দর লোড হচ্ছে...
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full select-none overflow-hidden border-y border-slate-200 bg-slate-50 py-2 sm:py-2.5 md:py-3">
      <div className="inline-flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        {products.concat(products).map((item, index) => {
          const isUp = item.change?.dir === "up";
          const isDown = item.change?.dir === "down";
          const pct = Math.abs(item.change?.pct || 0);

          return (
            <div
              key={`${item.id}-${index}`}
              className="
                group
                inline-flex
                shrink-0
                items-center
                gap-1
                mx-2.5
                rounded-md
                py-0.5
                text-[10px]
                font-medium
                text-slate-700
                transition-colors
                duration-200
                hover:bg-white/70
                sm:gap-1.5
                sm:mx-4
                sm:py-1
                sm:text-xs
                md:gap-2
                md:mx-5
                md:text-sm
              "
            >
              <span className="text-xs leading-none transition-transform duration-200 group-hover:scale-110 sm:text-sm md:text-base">
                {item.image || item.categoryIcon || "🛒"}
              </span>

              <span className="font-semibold text-slate-900 transition-colors duration-200 group-hover:text-[#008a48]">
                {item.nameBn}
              </span>

              <span className="text-slate-600">
                {item.today} টাকা/{item.unit}
              </span>

              {item.change?.dir !== "flat" && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[9px] font-bold transition-transform duration-200 group-hover:scale-105 sm:text-[10px] md:text-xs ${
                    isUp
                      ? "text-red-600"
                      : isDown
                        ? "text-green-600"
                        : "text-slate-500"
                  }`}
                >
                  {isUp && "▲"}
                  {isDown && "▼"}
                  {pct}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductMarquee;
