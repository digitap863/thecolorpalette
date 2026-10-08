"use client";

import { Search, X } from "lucide-react";
import { ServiceCategoryData } from "@/types/services";

interface ServiceFiltersProps {
  categories: ServiceCategoryData[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ServiceFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: ServiceFiltersProps) {
  return (
    <div className="w-full bg-[#F7F1EB] pt-12 pb-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
          
          {/* Left Title & Search Label */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-500 block mb-1">
              SEARCH & DISCOVERY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light">
              Find the right treatment
            </h2>
          </div>

          {/* Right Input Bar */}
          <div className="relative w-full md:w-80 lg:w-96">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search treatments by keyword..."
                className="w-full pl-11 pr-10 py-3 rounded-full bg-white/90 border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-800 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700 transition-colors rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
