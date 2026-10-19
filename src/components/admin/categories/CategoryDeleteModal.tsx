"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { CategoryItem } from "./types";

interface CategoryDeleteModalProps {
  category: CategoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (force: boolean) => Promise<void>;
  loading: boolean;
}

export default function CategoryDeleteModal({
  category,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: CategoryDeleteModalProps) {
  if (!isOpen || !category) return null;

  const hasServices = (category.serviceCount || 0) > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-red-200 shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-poppins text-lg uppercase tracking-wider text-[#1c1917]">
              Delete Category
            </h3>
            <p className="font-poppins text-xs text-[#1c1917]/60">
              Clinical taxonomy modification
            </p>
          </div>
        </div>

        <p className="font-poppins text-sm text-[#1c1917]/80 leading-relaxed mb-4">
          Are you sure you want to delete the category{" "}
          <strong className="text-red-600 font-semibold">{category.name}</strong>?
        </p>

        {hasServices && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-poppins leading-relaxed">
            <p className="font-semibold mb-1">
              ⚠️ Warning: {category.serviceCount} treatments currently linked
            </p>
            <p className="text-[11px] text-amber-700">
              Deleting this category track may leave those treatments unassigned in the catalogue. You can reassign those treatments first, or force delete this category.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-poppins text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(hasServices)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-poppins transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{hasServices ? "Force Delete Category" : "Delete Category"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
