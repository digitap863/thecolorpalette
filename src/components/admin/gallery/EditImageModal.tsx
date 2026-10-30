"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, X, AlertCircle, Loader2, Save } from "lucide-react";
import { GalleryItem, GALLERY_CATEGORIES, SOCIAL_PLATFORMS } from "./types";
import SocialIcon, { detectSocialPlatform } from "@/components/common/SocialIcon";
import { getSocialEmbedInfo } from "@/lib/socialEmbed";

interface EditImageModalProps {
  item: GalleryItem;
  onClose: () => void;
  onSave: (updated: Partial<GalleryItem>) => Promise<void>;
}

export default function EditImageModal({
  item,
  onClose,
  onSave,
}: EditImageModalProps) {
  const [form, setForm] = useState({
    title: item.title,
    alt: item.alt,
    category: item.category,
    order: item.order,
    isActive: item.isActive,
    socialUrl: item.socialUrl || "",
    socialPlatform: item.socialPlatform || "instagram",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReel = Boolean(item.isSocialPost || item.socialUrl);
  const embedInfo = isReel ? getSocialEmbedInfo(form.socialUrl || item.socialUrl) : null;
  const isImageValid = item.src && (item.src.includes("res.cloudinary.com") || item.src.match(/\.(jpg|jpeg|png|webp|avif)/i));

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title/Caption is required.");
      return;
    }
    if (!isReel && (!form.alt.trim() || !form.category)) {
      setError("Alt text and category are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        alt: isReel ? form.title.trim() : form.alt.trim(),
        category: isReel ? "Reel" : form.category,
      });
      onClose();
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#c2a878]/30 overflow-hidden">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2a878]/20 bg-[#f7f1eb]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c2a878]/20 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-[#7a5f2a]" />
            </div>
            <h3 className="font-poppins text-base uppercase tracking-[0.1em] text-[#1c1917]">
              {isReel ? "Edit Reel" : "Edit Image"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f7f1eb] text-[#1c1917]/60 hover:text-[#1c1917] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Preview ───────────────────────────────────────────────────── */}
        <div className="px-6 pt-4">
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/90 border border-[#c2a878]/20 flex items-center justify-center">
            {isReel && embedInfo?.embedUrl ? (
              embedInfo.type === "video" ? (
                <video src={embedInfo.embedUrl} controls playsInline className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={embedInfo.embedUrl}
                  title="Reel Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : isImageValid ? (
              <Image src={item.src} alt={item.alt || item.title} fill className="object-cover" />
            ) : (
              <div className="text-white/60 text-xs font-poppins flex flex-col items-center gap-1">
                <SocialIcon platform={form.socialPlatform} className="w-6 h-6 text-[#c2a878]" />
                <span>{form.title || "Reel"}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-poppins">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Title / Caption */}
            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-wider font-poppins text-[#1c1917]/60 mb-1">
                {isReel ? "Caption *" : "Title *"}
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#c2a878]/35 bg-white text-xs font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
                placeholder={isReel ? "e.g. Russian Lips Transformation" : "e.g. Bridal Hair"}
              />
            </div>

            {/* If NOT Reel: Alt Text & Category */}
            {!isReel && (
              <>
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider font-poppins text-[#1c1917]/60 mb-1">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    value={form.alt}
                    onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#c2a878]/35 bg-white text-xs font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
                    placeholder="Descriptive alt text for accessibility"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-poppins text-[#1c1917]/60 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#c2a878]/35 bg-white text-xs font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Display Order */}
            <div className={isReel ? "col-span-2" : "col-span-1"}>
              <label className="block text-[10px] uppercase tracking-wider font-poppins text-[#1c1917]/60 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-xl border border-[#c2a878]/35 bg-white text-xs font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
                min={0}
              />
            </div>

            {/* Social Media Link (optional) */}
            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-wider font-poppins text-[#1c1917]/60 mb-1">
                Social Media Post / Reel Link (optional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <SocialIcon platform={form.socialPlatform} className="w-4 h-4 text-[#8c6d36]" />
                </div>
                <input
                  type="url"
                  value={form.socialUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    const detected = val.trim() ? detectSocialPlatform(val.trim()) : form.socialPlatform;
                    setForm((f) => ({
                      ...f,
                      socialUrl: val,
                      socialPlatform: detected,
                    }));
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c2a878]/35 bg-white text-xs font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
                  placeholder="https://www.instagram.com/p/... or reel link"
                />
              </div>
            </div>

            {/* Social Platform Selection */}
            {form.socialUrl && (
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-wider font-poppins text-[#1c1917]/60 mb-1">
                  Social Platform
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {SOCIAL_PLATFORMS.map((p) => {
                    const isSelected = form.socialPlatform?.toLowerCase() === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, socialPlatform: p.id }))}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-[10px] font-poppins transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#c2a878] bg-[#f7f1eb] text-[#8c6d36] font-semibold"
                            : "border-stone-200 text-stone-600 hover:border-stone-300"
                        }`}
                      >
                        <SocialIcon platform={p.id} className="w-3.5 h-3.5" />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Visibility toggle */}
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    form.isActive ? "bg-[#c2a878]" : "bg-stone-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-xs font-poppins text-[#1c1917]/80">
                  {form.isActive
                    ? "Visible on public gallery"
                    : "Hidden from public gallery"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="px-6 pb-5 flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#c2a878]/40 text-[#1c1917] text-xs font-poppins uppercase tracking-wider hover:bg-[#f7f1eb] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-poppins uppercase tracking-wider transition-all disabled:opacity-60 shadow-md"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
