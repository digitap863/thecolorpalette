"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="w-full py-24 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-700 mb-6 border border-red-200">
        <AlertCircle className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light mb-3">
        We&apos;re unable to load our treatments right now.
      </h3>

      <p className="text-sm text-stone-600 font-light max-w-md mb-8">
        Please check your network connection or try refreshing the catalogue.
      </p>

      <button
        onClick={onRetry}
        className="px-8 py-3.5 bg-stone-900 text-stone-50 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-stone-800 transition-colors inline-flex items-center gap-2 shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        <span>TRY AGAIN</span>
      </button>
    </div>
  );
}
