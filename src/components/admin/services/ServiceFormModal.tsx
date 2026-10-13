"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Sparkles,
  Plus,
  Trash2,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Layers,
  HelpCircle,
} from "lucide-react";
import { AdminServiceItem, AdminCategoryItem, ServiceFormData } from "./types";
import { uploadServiceImageToCloudinary } from "./uploadHelpers";
import CategoryCreateModal from "./CategoryCreateModal";

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (service: AdminServiceItem) => void;
  categories: AdminCategoryItem[];
  onCategoryCreated: (category: AdminCategoryItem) => void;
  initialService?: AdminServiceItem | null;
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

const DEFAULT_FORM: ServiceFormData = {
  name: "",
  slug: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  image: "",
  images: [],
  points: [""],
  pdfUrl: "",
  featured: false,
  isActive: true,
  order: 0,
};

export default function ServiceFormModal({
  isOpen,
  onClose,
  onSaved,
  categories,
  onCategoryCreated,
  initialService,
}: ServiceFormModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>(DEFAULT_FORM);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [activeTab, setActiveTab] = useState<"essentials" | "content" | "media">("essentials");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Upload states
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [mainImageProgress, setMainImageProgress] = useState(0);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with initialService or reset
  useEffect(() => {
    if (initialService) {
      setFormData({
        name: initialService.name || "",
        slug: initialService.slug || "",
        categoryId: initialService.categoryId || "",
        shortDescription: initialService.shortDescription || "",
        description: initialService.description || "",
        image: initialService.image || "",
        images: Array.isArray(initialService.images) ? [...initialService.images] : [],
        points:
          Array.isArray(initialService.points) && initialService.points.length > 0
            ? [...initialService.points]
            : [""],
        pdfUrl: initialService.pdfUrl || "",
        featured: Boolean(initialService.featured),
        isActive: initialService.isActive !== false,
        order: initialService.order ?? 0,
      });
      setSlugManuallyEdited(true);
    } else {
      setFormData({
        ...DEFAULT_FORM,
        categoryId: categories.length > 0 ? categories[0].slug : "",
      });
      setSlugManuallyEdited(false);
    }
    setActiveTab("essentials");
    setError(null);
  }, [initialService, categories, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialService);

  // Handle Name Change & Auto-Slug
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: slugManuallyEdited ? prev.slug : slugify(val),
    }));
  };

  // Handle Slug Change
  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: slugify(val) }));
  };

  // Handle Points
  const handlePointChange = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.points];
      updated[index] = val;
      return { ...prev, points: updated };
    });
  };

  const handleAddPoint = () => {
    setFormData((prev) => ({ ...prev, points: [...prev.points, ""] }));
  };

  const handleRemovePoint = (index: number) => {
    setFormData((prev) => {
      const updated = prev.points.filter((_, idx) => idx !== index);
      return { ...prev, points: updated.length > 0 ? updated : [""] };
    });
  };

  // Main Image Upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageUploading(true);
    setMainImageProgress(0);
    setError(null);

    try {
      const url = await uploadServiceImageToCloudinary(file, (p) => {
        setMainImageProgress(p);
      });
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      setError(`Main image upload failed: ${err.message}. You can also type/paste an image URL directly.`);
    } finally {
      setMainImageUploading(false);
      if (mainFileInputRef.current) mainFileInputRef.current.value = "";
    }
  };

  // Gallery Image Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setGalleryUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const url = await uploadServiceImageToCloudinary(file, () => {});
        uploadedUrls.push(url);
      } catch (err: any) {
        setError(`Failed to upload ${file.name}: ${err.message}. You can also add image URLs directly.`);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    }

    setGalleryUploading(false);
    if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
  };

  // Add Gallery Image URL manually
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newGalleryUrl.trim()],
    }));
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idxToRemove),
    }));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter a service name.");
      setActiveTab("essentials");
      return;
    }

    if (!formData.categoryId.trim()) {
      setError("Please select a service category.");
      setActiveTab("essentials");
      return;
    }

    if (!formData.shortDescription.trim()) {
      setError("Please provide a short description for the service card.");
      setActiveTab("content");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        points: formData.points.map((p) => p.trim()).filter(Boolean),
        images: formData.images.map((img) => img.trim()).filter(Boolean),
      };

      const url = isEditing
        ? `/api/admin/services/${initialService!.id}`
        : `/api/admin/services`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `Failed to ${isEditing ? "update" : "create"} service`);
      }

      onSaved(data);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl bg-white rounded-3xl border border-[#c2a878]/35 shadow-2xl overflow-hidden my-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-[#c2a878]/25 flex items-center justify-between bg-[#f7f1eb]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#c2a878]/35 text-[#8c6d36] flex items-center justify-center shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-belleza text-lg sm:text-xl uppercase tracking-wider text-[#1c1917]">
                  {isEditing ? `Edit Service: ${initialService?.name}` : "Add New Clinical Service"}
                </h2>
                <p className="font-poppins text-xs text-[#1c1917]/60">
                  {isEditing
                    ? "Modify clinical specifications & catalogue display"
                    : "Publish a new aesthetic or wellness treatment"}
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

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#c2a878]/25 bg-white px-6 sm:px-8">
            <button
              type="button"
              onClick={() => setActiveTab("essentials")}
              className={`py-3.5 px-4 font-belleza text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "essentials"
                  ? "border-[#1c1917] text-[#1c1917]"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              1. Essentials & Category
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`py-3.5 px-4 font-belleza text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "content"
                  ? "border-[#1c1917] text-[#1c1917]"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              2. Descriptions & Highlights
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`py-3.5 px-4 font-belleza text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === "media"
                  ? "border-[#1c1917] text-[#1c1917]"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              3. Media & Resources
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-poppins flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">
            {/* ── TAB 1: ESSENTIALS ── */}
            {activeTab === "essentials" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Service Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917] mb-1.5">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hydra Glow Facial Therapy"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
                  />
                </div>

                {/* Slug Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                      URL Slug *
                    </label>
                    <span className="text-[11px] text-stone-400 font-mono">
                      /services?category={formData.categoryId || "category"}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="hydra-glow-facial-therapy"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 font-mono text-xs focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
                  />
                  <p className="mt-1 text-[11px] text-stone-500 font-poppins">
                    URL-friendly unique key. Auto-generated from title, or enter custom.
                  </p>
                </div>

                {/* Category Dropdown + Quick Add */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                      Service Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#8c6d36] hover:text-[#5d461e] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ New Category</span>
                    </button>
                  </div>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
                  >
                    <option value="" disabled>
                      Select a category...
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Order & Status Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                    <p className="mt-1 text-[10px] text-stone-500">Lower numbers appear first (0, 1, 2...)</p>
                  </div>

                  {/* Active Switch */}
                  <div className="flex flex-col justify-center p-3 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-belleza uppercase tracking-wider font-semibold text-[#1c1917]">
                        Published / Active
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
                    <span className="text-[10px] text-stone-500 mt-1 font-poppins">
                      {formData.isActive ? "Visible to patients" : "Draft (hidden)"}
                    </span>
                  </div>

                  {/* Featured Switch */}
                  <div className="flex flex-col justify-center p-3 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-belleza uppercase tracking-wider font-semibold text-[#1c1917] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Signature Treatment
                      </span>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                        }
                        className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                      />
                    </label>
                    <span className="text-[10px] text-stone-500 mt-1 font-poppins">
                      Displays signature star badge
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: CONTENT & HIGHLIGHTS ── */}
            {activeTab === "content" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Short Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                      Short Summary *
                    </label>
                    <span className="text-[11px] text-stone-400 font-poppins">
                      {formData.shortDescription.length} characters (displays on treatment card)
                    </span>
                  </div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Brief 1-2 sentence overview of the treatment for cards and listings..."
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a] resize-none"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917] mb-1.5">
                    Full Clinical Description
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Comprehensive clinical details, treatment protocol, ideal candidates, and expected outcomes..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/35 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a] resize-y"
                  />
                </div>

                {/* Key Benefits / Highlights Points */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                        Key Highlights &amp; Clinical Benefits
                      </label>
                      <p className="text-[11px] text-stone-500 font-poppins">
                        Bullet points displayed in the treatment details modal
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPoint}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f7f1eb] hover:bg-[#dfcca5]/40 border border-[#c2a878]/40 text-[#7a5f2a] text-xs font-belleza uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formData.points.map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-center text-xs font-mono text-stone-400">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Deep dermal hydration with zero recovery downtime"
                          value={pt}
                          onChange={(e) => handlePointChange(idx, e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePoint(idx)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove bullet point"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: MEDIA & BROCHURE ── */}
            {activeTab === "media" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Main Cover Image */}
                <div className="p-4 rounded-2xl border border-[#c2a878]/30 bg-[#f7f1eb]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                        Main Cover Image
                      </label>
                      <p className="text-[11px] text-stone-500 font-poppins">
                        Primary image displayed on treatment cards &amp; modal hero
                      </p>
                    </div>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                        className="text-xs text-red-600 hover:underline font-poppins"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview box */}
                    <div className="w-32 h-24 rounded-xl border border-stone-200 bg-stone-100 overflow-hidden relative shrink-0 flex items-center justify-center">
                      {formData.image ? (
                        <Image
                          src={formData.image}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-stone-400" />
                      )}
                    </div>

                    {/* Upload / URL Input */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={mainImageUploading}
                          onClick={() => mainFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-belleza uppercase tracking-wider font-medium transition-all cursor-pointer disabled:opacity-50"
                        >
                          {mainImageUploading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading ({mainImageProgress}%)...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                            </>
                          )}
                        </button>
                        <input
                          ref={mainFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          className="hidden"
                        />
                        <span className="text-xs text-stone-400 font-poppins">or enter image path / URL:</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. /images/services/hydra-facial.jpg or Cloudinary URL"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, image: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-white text-stone-900 text-xs font-mono focus:outline-none focus:border-[#7a5f2a]"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Images */}
                <div className="p-4 rounded-2xl border border-[#c2a878]/30 bg-[#f7f1eb]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                        Additional Gallery Photos ({formData.images.length})
                      </label>
                      <p className="text-[11px] text-stone-500 font-poppins">
                        Multi-angle before/after or clinical procedure views
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={galleryUploading}
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-belleza uppercase tracking-wider font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {galleryUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photos</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Add URL row */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL to add to gallery..."
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGalleryUrl();
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-white text-stone-900 text-xs font-mono focus:outline-none focus:border-[#7a5f2a]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3.5 py-2 rounded-xl bg-[#f7f1eb] hover:bg-[#dfcca5]/40 border border-[#c2a878]/40 text-[#7a5f2a] text-xs font-belleza uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                    >
                      + Add URL
                    </button>
                  </div>

                  {/* Gallery thumbnails grid */}
                  {formData.images.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                      {formData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl border border-stone-200 overflow-hidden group bg-stone-100"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 font-poppins italic py-2">
                      No additional photos added yet.
                    </p>
                  )}
                </div>

                {/* PDF Brochure / Patient Guide URL */}
                <div className="p-4 rounded-2xl border border-[#c2a878]/30 bg-[#f7f1eb]/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8c6d36]" />
                    <label className="text-xs uppercase tracking-wider font-belleza font-semibold text-[#1c1917]">
                      Downloadable Clinical Guide / PDF URL (Optional)
                    </label>
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/treatment-brochure.pdf"
                    value={formData.pdfUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pdfUrl: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-white text-stone-900 text-xs font-mono focus:outline-none focus:border-[#7a5f2a]"
                  />
                  <p className="text-[11px] text-stone-500 font-poppins">
                    If provided, a &quot;Download Clinical Guide&quot; link will appear in the treatment modal for clients.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#c2a878]/25 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-belleza font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                {activeTab !== "media" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "essentials") setActiveTab("content");
                      else if (activeTab === "content") setActiveTab("media");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-belleza uppercase tracking-wider font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Next &rarr;
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs uppercase tracking-wider font-belleza font-semibold transition-all shadow-md shadow-stone-900/10 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEditing ? "Saving Changes..." : "Publishing Service..."}</span>
                    </>
                  ) : (
                    <span>{isEditing ? "Save Changes" : "Create Service"}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Category Creation Sub-Modal */}
      <CategoryCreateModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreated={(newCat) => {
          onCategoryCreated(newCat);
          setFormData((prev) => ({ ...prev, categoryId: newCat.slug }));
        }}
      />
    </>
  );
}
