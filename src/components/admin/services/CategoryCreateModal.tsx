"use client";

import { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import { AdminCategoryItem } from "./types";

interface CategoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newCat: AdminCategoryItem) => void;
}

export default function CategoryCreateModal({
  isOpen,
  onClose,
  onCreated,
}: CategoryCreateModalProps) {
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a category name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/service-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          shortDescription: shortDescription.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create category");
      }

      onCreated(data);
      setName("");
      setShortDescription("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Something went wrong creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#c2a878]/35 shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#c2a878]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfcca5]/30 text-[#7a5f2a] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-poppins text-base uppercase tracking-wider text-[#1c1917]">
                New Category
              </h3>
              <p className="font-poppins text-xs text-[#1c1917]/60">
                Organize treatment services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-poppins">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-poppins">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1c1917]/70 font-semibold mb-1 font-poppins">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. LASER & LIGHT-BASED TREATMENTS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-[#1c1917] text-sm focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#1c1917]/70 font-semibold mb-1 font-poppins">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of treatments in this category..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-[#1c1917] text-sm focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#c2a878]/20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-poppins text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs uppercase tracking-wider font-poppins transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Add Category</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
