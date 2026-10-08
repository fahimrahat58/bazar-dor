export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="animate-pulse space-y-4 sm:space-y-5 lg:space-y-6">
        <div className="h-3.5 w-36 rounded bg-gray-200 sm:h-4 sm:w-48" />

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-5 md:p-6">
          <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200 sm:h-14 sm:w-14 md:h-16 md:w-16 md:rounded-2xl" />

              <div className="min-w-0 space-y-2">
                <div className="h-5 w-32 rounded bg-gray-200 sm:h-6 sm:w-40" />
                <div className="h-3.5 w-20 rounded bg-gray-200 sm:h-4 sm:w-24" />
              </div>
            </div>

            <div className="space-y-2 md:text-right">
              <div className="h-7 w-28 rounded bg-gray-200 sm:h-8 sm:w-32 md:ml-auto" />
              <div className="h-4 w-16 rounded bg-gray-200 sm:h-5 sm:w-20 md:ml-auto" />
            </div>
          </div>
        </div>

        <div className="h-5 w-32 rounded bg-gray-200 sm:h-6 sm:w-40" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 rounded-xl border border-gray-200 bg-white sm:h-28 sm:rounded-2xl"
            />
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white sm:rounded-2xl">
          <div className="p-4 sm:p-5 md:p-6">
            <div className="mb-4 h-5 w-32 rounded bg-gray-200 sm:mb-5 sm:h-6 sm:w-40" />

            <div className="overflow-x-auto">
              <div className="min-w-[600px] space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-4 rounded-lg bg-gray-100 px-4 py-3">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>

                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="grid grid-cols-4 gap-4 rounded-lg border border-gray-100 px-4 py-3"
                  >
                    <div className="h-4 w-24 rounded bg-gray-100" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                    <div className="h-4 w-20 rounded bg-gray-100" />
                    <div className="h-4 w-16 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-10 w-40 rounded-xl bg-gray-200 sm:h-11 sm:w-48" />
      </div>
    </main>
  );
}
