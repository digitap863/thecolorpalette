"use client";

import { useState, useEffect } from "react";
import {
  X,
  FolderTree,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { CategoryItem, CategoryFormData } from "./types";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedCat: CategoryItem) => void;
  initialCategory?: CategoryItem | null;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const DEFAULT_FORM: CategoryFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  order: 0,
  isActive: true,
};

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSaved,
  initialCategory,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>(DEFAULT_FORM);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        name: initialCategory.name || "",
        slug: initialCategory.slug || "",
        shortDescription: initialCategory.shortDescription || "",
        order: initialCategory.order ?? 0,
        isActive: initialCategory.isActive !== false,
      });
      setSlugManuallyEdited(true);
    } else {
      setFormData(DEFAULT_FORM);
      setSlugManuallyEdited(false);
    }
    setError(null);
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialCategory);

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: slugManuallyEdited ? prev.slug : slugify(val),
    }));
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      slug: slugify(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (!formData.shortDescription.trim()) {
      setError("Please provide a short description for patient guidance");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const endpoint = isEditing
        ? `/api/admin/service-categories/${initialCategory!.id}`
        : "/api/admin/service-categories";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim() || slugify(formData.name),
          shortDescription: formData.shortDescription.trim(),
          order: formData.order,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      onSaved(data);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Something went wrong saving the category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-[#c2a878]/35 shadow-2xl overflow-hidden my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#c2a878]/25 flex items-center justify-between bg-[#f7f1eb]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#c2a878]/35 text-[#8c6d36] flex items-center justify-center shadow-2xs">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-poppins text-lg sm:text-xl uppercase tracking-wider text-[#1c1917]">
                {isEditing ? `Edit Category: ${initialCategory?.name}` : "Add Service Category"}
              </h2>
              <p className="font-poppins text-xs text-[#1c1917]/60">
                Define treatment track taxonomy &amp; catalogue grouping
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-[#c2a878]/30 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Slug */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1.5">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Facials & Medifacials, Advanced Skin, Laser Care"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917]">
                  URL Slug Identifier <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  Used in service filters &amp; direct links
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="facials-medifacials"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm font-mono focus:outline-none focus:border-[#7a5f2a]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1.5">
              Patient Guidance Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Specialized clinical treatments formulated for barrier repair, deep hydration, and cellular radiance..."
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a] resize-none"
            />
          </div>

          {/* Order & Status Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1.5">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a]"
              />
              <p className="mt-1 text-[10px] text-stone-500">
                Lower numbers appear first on client services page.
              </p>
            </div>

            <div className="flex flex-col justify-between">
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1.5">
                Visibility Status
              </label>
              <div className="flex items-center gap-3 py-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                    formData.isActive ? "bg-emerald-600" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 mt-0.5 ml-0.5 ${
                      formData.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-stone-700">
                  {formData.isActive ? "Active on site" : "Draft (hidden)"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#c2a878]/25 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-poppins uppercase tracking-wider font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-poppins uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#c2a878]" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Changes" : "Create Category"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
