"use client";

export default function LoadingSkeleton() {
  return (
    <div className="w-full py-16 animate-pulse">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Category Header Skeleton */}
        <div className="mb-10 pl-6 border-l-2 border-stone-300">
          <div className="h-4 w-40 bg-stone-300/60 rounded mb-3" />
          <div className="h-9 w-72 bg-stone-300/80 rounded mb-3" />
          <div className="h-5 w-full max-w-xl bg-stone-200 rounded" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white/70 border border-stone-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between h-[420px]"
            >
              <div className="w-full h-56 bg-stone-200/80" />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="h-6 w-3/4 bg-stone-300/80 rounded mb-3" />
                  <div className="h-4 w-full bg-stone-200 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-stone-200 rounded" />
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="h-4 w-28 bg-stone-300/60 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
