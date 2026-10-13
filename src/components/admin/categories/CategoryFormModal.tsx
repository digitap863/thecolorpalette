"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Sparkles,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { CategoryItem, CategoryFormData } from "./types";
import { uploadServiceImageToCloudinary } from "../services/uploadHelpers";

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
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const DEFAULT_FORM: CategoryFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  image: "",
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
  const [imageUploading, setImageUploading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        name: initialCategory.name || "",
        slug: initialCategory.slug || "",
        shortDescription: initialCategory.shortDescription || "",
        image: initialCategory.image || "",
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
    setFormData((prev) => ({ ...prev, slug: slugify(val) }));
  };

  // Upload artwork image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setImageProgress(0);
    setError(null);

    try {
      const url = await uploadServiceImageToCloudinary(file, (p) => {
        setImageProgress(p);
      });
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      setError(`Image upload failed: ${err.message}. You can also type/paste an image path directly.`);
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (!formData.shortDescription.trim()) {
      setError("Please enter a short description for the category");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/admin/service-categories/${initialCategory!.id}`
        : `/api/admin/service-categories`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Failed to ${isEditing ? "update" : "create"} category`);
      }

      onSaved(data);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save category");
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
        className="w-full max-w-xl bg-white rounded-3xl border border-[#c2a878]/35 shadow-2xl overflow-hidden my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#c2a878]/25 flex items-center justify-between bg-[#f7f1eb]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#c2a878]/35 text-[#8c6d36] flex items-center justify-center shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-belleza text-lg sm:text-xl uppercase tracking-wider text-[#1c1917]">
                {isEditing ? `Edit Category: ${initialCategory?.name}` : "Add Service Category"}
              </h2>
              <p className="font-poppins text-xs text-[#1c1917]/60">
                Define treatment track taxonomy &amp; catalogue grouping
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-white/80 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-poppins flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 font-poppins">
          {/* Category Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917] mb-1.5">
              Category Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FACIALS & MEDIFACIALS"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
            />
          </div>

          {/* URL Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                URL Slug *
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                /services?category={formData.slug || "track"}
              </span>
            </div>
            <input
              type="text"
              required
              placeholder="facials-medifacials"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 font-mono text-xs focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917] mb-1.5">
              Track Summary / Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Personalised facial treatments focused on cleansing, hydration, radiance and skin renewal..."
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a] resize-none"
            />
          </div>

          {/* Category Cover Image */}
          <div className="p-4 rounded-2xl border border-[#c2a878]/30 bg-[#f7f1eb]/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                  Category Cover Artwork (Optional)
                </label>
                <p className="text-[11px] text-stone-500">
                  Header illustration or treatment track background image
                </p>
              </div>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                  className="text-xs text-red-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 h-20 rounded-xl border border-stone-200 bg-stone-100 overflow-hidden relative shrink-0 flex items-center justify-center">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Category cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-stone-400" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={imageUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-belleza uppercase tracking-wider font-medium transition-all cursor-pointer disabled:opacity-50"
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading ({imageProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-xs text-stone-400">or enter image path:</span>
                </div>
                <input
                  type="text"
                  placeholder="/gallery/gallery_medifacial_1_1791351357677.png"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-white text-stone-900 text-xs font-mono focus:outline-none focus:border-[#7a5f2a]"
                />
              </div>
            </div>
          </div>

          {/* Order & Status Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917] mb-1.5">
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
                Sequence order in category navigation tabs (1, 2, 3...)
              </p>
            </div>

            <div className="flex flex-col justify-center p-3 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-belleza uppercase tracking-wider font-semibold text-[#1c1917]">
                  Published / Active Track
                </span>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#1c1917] rounded cursor-pointer"
                />
              </label>
              <span className="text-[10px] text-stone-500 mt-1">
                {formData.isActive ? "Shown in catalogue navigation" : "Hidden from clients"}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#c2a878]/25 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-belleza font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs uppercase tracking-wider font-belleza font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditing ? "Saving Changes..." : "Creating Category..."}</span>
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
