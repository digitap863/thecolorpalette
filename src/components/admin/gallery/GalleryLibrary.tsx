"use client";

import { Grid3X3, ImagePlus, LayoutGrid, List, Loader2 } from "lucide-react";
import { GalleryItem, GALLERY_CATEGORIES } from "./types";
import GalleryGridItem from "./GalleryGridItem";
import GalleryListItem from "./GalleryListItem";

interface GalleryLibraryProps {
  items: GalleryItem[];
  loading: boolean;
  viewMode: "grid" | "list";
  filterCategory: string;
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilterChange: (category: string) => void;
  onEdit: (item: GalleryItem) => void;
  onToggleVisibility: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

export default function GalleryLibrary({
  items,
  loading,
  viewMode,
  filterCategory,
  onViewModeChange,
  onFilterChange,
  onEdit,
  onToggleVisibility,
  onDelete,
}: GalleryLibraryProps) {
  const filteredItems =
    filterCategory === "all"
      ? items
      : items.filter(
          (i) => i.category.toLowerCase() === filterCategory.toLowerCase()
        );

  return (
    <div className="rounded-2xl bg-white border border-[#c2a878]/30 shadow-xs overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-[#c2a878]/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f7f1eb] border border-[#c2a878]/20 flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-[#8c6d36]" />
          </div>
          <div>
            <h2 className="font-belleza text-base uppercase tracking-[0.1em] text-[#1c1917]">
              Gallery Library
            </h2>
            <p className="font-poppins text-[10px] text-[#1c1917]/50">
              {filteredItems.length} image
              {filteredItems.length !== 1 ? "s" : ""}
              {filterCategory !== "all" ? ` in ${filterCategory}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#c2a878]/35 bg-white text-xs font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
          >
            <option value="all">All Categories</option>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex rounded-xl border border-[#c2a878]/30 overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#1c1917] text-[#f7f1eb]"
                  : "bg-white text-[#1c1917]/60 hover:bg-[#f7f1eb]"
              }`}
              title="Grid view"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-[#1c1917] text-[#f7f1eb]"
                  : "bg-white text-[#1c1917]/60 hover:bg-[#f7f1eb]"
              }`}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#c2a878]" />
          <span className="font-poppins text-sm text-[#1c1917]/60">
            Loading gallery...
          </span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f7f1eb] border border-[#c2a878]/30 flex items-center justify-center mb-4">
            <ImagePlus className="w-7 h-7 text-[#c2a878]/60" />
          </div>
          <p className="font-belleza text-base uppercase tracking-wider text-[#1c1917] mb-1">
            No Images Yet
          </p>
          <p className="font-poppins text-xs text-[#1c1917]/50 max-w-sm">
            Upload your first images using the upload zone above.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <GalleryGridItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-[#c2a878]/15">
          {filteredItems.map((item) => (
            <GalleryListItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
