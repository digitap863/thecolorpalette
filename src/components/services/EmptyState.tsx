"use client";

import { SearchX, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  onReset?: () => void;
}

export default function EmptyState({
  message = "No treatments available in this category.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="w-full py-20 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-600 mb-5 border border-stone-300/60">
        <SearchX className="w-6 h-6 stroke-[1.5]" />
      </div>

      <h3 className="font-serif text-2xl text-stone-900 font-light mb-2">
        {message}
      </h3>

      <p className="text-sm text-stone-600 font-light max-w-md mb-8">
        Try adjusting your filter or search keywords to explore other aesthetic treatments.
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET FILTERS</span>
        </button>
      )}
    </div>
  );
}
