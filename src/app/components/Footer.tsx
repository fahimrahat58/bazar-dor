export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200/80 bg-white/50 text-[#3C4043] sm:mt-10 md:mt-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2.5 px-3 py-4 text-xs font-medium text-gray-500 sm:gap-3 sm:px-5 sm:py-4 md:flex-row md:justify-between md:px-6 md:py-5 lg:px-8">
        {/* Left Side: Brand Statement */}
        <div className="flex max-w-full items-center justify-center gap-1.5 text-center text-[11px] md:justify-start md:text-left md:text-sm">
          <span className="shrink-0  text-gray-600">বাজার দর</span>

          <span className="shrink-0 text-gray-600">—</span>

          <span>প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
        </div>

        {/* Right Side: Disclaimer Note */}
        <div className="max-w-full text-center text-[11px] leading-relaxed text-gray-600 md:text-right md:text-sm">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
}
