export function PageSkeleton({
  showCards = true,
  compact = false,
}: {
  showCards?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#fcfcfd_40%,_#ffffff_100%)]">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/75 px-5 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="skeleton-shimmer h-4 w-24 rounded-full" />
          <div className="hidden gap-3 md:flex">
            <div className="skeleton-shimmer h-9 w-16 rounded-full" />
            <div className="skeleton-shimmer h-9 w-16 rounded-full" />
            <div className="skeleton-shimmer h-9 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <main className={`mx-auto max-w-7xl px-4 pb-20 ${compact ? "pt-8" : "pt-12"} sm:px-6 lg:px-8`}>
        <div className={`space-y-6 ${compact ? "max-w-4xl" : "max-w-5xl"}`}>
          <div className="skeleton-shimmer h-4 w-28 rounded-full" />
          <div className="skeleton-shimmer h-14 w-full max-w-3xl rounded-[2rem] sm:h-20" />
          <div className="skeleton-shimmer h-4 w-full max-w-2xl rounded-full" />
          <div className="skeleton-shimmer h-4 w-full max-w-xl rounded-full" />
        </div>

        {showCards ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-[2rem] bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)] ${
                  index % 3 === 0 ? "aspect-[4/5.8]" : index % 3 === 1 ? "aspect-[4/4.8]" : "aspect-[4/6.4]"
                }`}
              >
                <div className="skeleton-shimmer h-full w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            <div className="skeleton-shimmer h-72 rounded-[2.2rem]" />
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
              <div className="space-y-4">
                <div className="skeleton-shimmer h-5 w-36 rounded-full" />
                <div className="skeleton-shimmer h-16 w-full rounded-[1.6rem]" />
                <div className="skeleton-shimmer h-4 w-full rounded-full" />
                <div className="skeleton-shimmer h-4 w-[92%] rounded-full" />
                <div className="skeleton-shimmer h-4 w-[88%] rounded-full" />
              </div>
              <div className="skeleton-shimmer h-48 rounded-[1.5rem]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="skeleton-shimmer h-56 rounded-[1.6rem]" />
              <div className="skeleton-shimmer h-56 rounded-[1.6rem]" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
