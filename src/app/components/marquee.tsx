"use client";

import React, { useEffect, useState } from "react";

const ProductMarquee = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching marquee data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-50 border-y border-slate-200 py-2 sm:py-2.5 text-center text-slate-500 text-xs sm:text-sm">
        আজকের বাজার দর লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 border-y border-slate-200 py-2 sm:py-2.5 overflow-hidden select-none">
      <div className="inline-flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        {products.concat(products).map((item, index) => {
          const isUp = item.change?.dir === "up";
          const isDown = item.change?.dir === "down";
          const pct = Math.abs(item.change?.pct || 0);

          return (
            <div
              key={`${item.id}-${index}`}
              className="
                inline-flex
                items-center
                gap-1 sm:gap-1.5 md:gap-2
                mx-3 sm:mx-4 md:mx-6
                text-xs sm:text-sm
                text-slate-700
                font-medium
              "
            >
              <span className="text-sm sm:text-base leading-none">
                {item.image || item.categoryIcon || "🛒"}
              </span>

              <span className="text-slate-900 font-semibold">
                {item.nameBn}
              </span>

              <span className="text-slate-600">
                {item.today} টাকা/{item.unit}
              </span>

              {item.change?.dir !== "flat" && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold ${
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