import { Suspense } from "react";
import NavbarContent from "./NavbarContent";
import ProductMarquee from "./ProductMarquee";

function NavbarFallback() {
  return (
    <div className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
        <div className="flex min-h-14.5 items-center justify-between gap-3 sm:min-h-15.5 md:min-h-16">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#008a48] sm:h-9 sm:w-9 md:h-10 md:w-10">
              <span className="text-sm text-white sm:text-base md:text-lg">
                🛒
              </span>
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="text-[15px] font-black leading-tight tracking-tight text-gray-900 sm:text-[17px] md:text-[19px] lg:text-[20px]">
                বাজার দর
              </span>

              <span className="mt-0.5 text-[8px] font-medium leading-tight text-gray-500 sm:text-[9px] md:text-[10px]">
                আজকের বাজারদর
              </span>
            </div>
          </div>

          <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-100 sm:h-9 sm:w-9 lg:hidden" />
        </div>
      </div>

      <div className="hidden border-t border-gray-100 bg-white lg:block">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-7 lg:px-10 xl:px-14">
          <div className="flex h-10.5 items-center gap-2">
            <div className="h-7 w-16 animate-pulse rounded-md bg-gray-100" />
            <div className="h-7 w-20 animate-pulse rounded-md bg-gray-100" />
            <div className="h-7 w-16 animate-pulse rounded-md bg-gray-100" />
            <div className="h-7 w-20 animate-pulse rounded-md bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <Suspense fallback={<NavbarFallback />}>
        <NavbarContent />
      </Suspense>

      <ProductMarquee />
    </header>
  );
}
