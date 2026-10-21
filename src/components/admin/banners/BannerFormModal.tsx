"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  SlidersHorizontal,
  Smartphone,
  Monitor,
  Trash2,
  Loader2,
  Check,
  Eye,
} from "lucide-react";
import { BannerSlide } from "@/types/banner";
import { uploadBannerImageToCloudinary } from "./uploadHelper";

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  slide?: BannerSlide | null;
}

export default function BannerFormModal({
  isOpen,
  onClose,
  onSaved,
  slide,
}: BannerFormModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Desktop Images: exactly 3 slots
  const [desktopImages, setDesktopImages] = useState<string[]>(["", "", ""]);
  // Mobile Images: exactly 2 slots
  const [mobileImages, setMobileImages] = useState<string[]>(["", ""]);

  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (slide) {
      setTitle(slide.title || "");
      setSubtitle(slide.subtitle || "");
      setOrder(slide.order ?? 0);
      setIsActive(slide.isActive !== false);

      const dImgs = [...(slide.images || [])];
      while (dImgs.length < 3) dImgs.push("");
      setDesktopImages(dImgs.slice(0, 3));

      let mImgs = [...(slide.mobileImages || [])];
      if (mImgs.length === 0 && dImgs.filter(Boolean).length >= 2) {
        mImgs = [dImgs[0], dImgs[1]];
      }
      while (mImgs.length < 2) mImgs.push("");
      setMobileImages(mImgs.slice(0, 2));
    } else {
      setTitle("");
      setSubtitle("");
      setOrder(0);
      setIsActive(true);
      setDesktopImages(["", "", ""]);
      setMobileImages(["", ""]);
    }
    setErrorMsg("");
  }, [slide, isOpen]);

  if (!isOpen) return null;

  // Handle uploading image for a specific slot
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "desktop" | "mobile",
    slotIdx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slotKey = `${type}-${slotIdx}`;
    setUploadingSlot(slotKey);
    setUploadProgress(0);
    setErrorMsg("");

    try {
      const url = await uploadBannerImageToCloudinary(file, (p) => {
        setUploadProgress(p);
      });

      if (type === "desktop") {
        setDesktopImages((prev) => {
          const next = [...prev];
          next[slotIdx] = url;
          return next;
        });
        // If mobile slot was empty, automatically suggest this image
        setMobileImages((prev) => {
          const next = [...prev];
          if (slotIdx === 0 && !next[0]) next[0] = url;
          if (slotIdx === 1 && !next[1]) next[1] = url;
          return next;
        });
      } else {
        setMobileImages((prev) => {
          const next = [...prev];
          next[slotIdx] = url;
          return next;
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg("Failed to upload image. Please try again or use direct URL.");
    } finally {
      setUploadingSlot(null);
      setUploadProgress(0);
      // Reset input
      e.target.value = "";
    }
  };

  // Quick preset buttons for mobile images
  const applyMobilePreset = (idx1: number, idx2: number) => {
    const img1 = desktopImages[idx1] || "";
    const img2 = desktopImages[idx2] || "";
    setMobileImages([img1, img2]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const validDesktop = desktopImages.filter((img) => img.trim().length > 0);
    if (validDesktop.length === 0) {
      setErrorMsg("Please provide at least 1 desktop image (3 recommended).");
      return;
    }

    // Prepare mobile images (fill with first desktop images if blank)
    const validMobile = mobileImages.map((m, idx) => {
      if (m && m.trim().length > 0) return m.trim();
      return desktopImages[idx] || desktopImages[0] || "";
    });

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        images: validDesktop,
        mobileImages: validMobile,
        order: Number(order) || 0,
        isActive,
      };

      const isEdit = !!slide?._id || !!slide?.id;
      const slideId = slide?._id || slide?.id;
      const url = isEdit
        ? `/api/admin/banners/${slideId}`
        : "/api/admin/banners";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save banner slide");
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 bg-[#f7f1eb] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#c2a878]/30 flex items-center justify-center text-[#8c6d36] shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-poppins text-lg sm:text-xl font-medium tracking-wider uppercase text-stone-900">
                {slide ? "Edit Banner Slide" : "Create New Banner Slide"}
              </h2>
              <p className="text-xs text-stone-600 font-light">
                Configure desktop 3-column visuals and customized 2-column mobile displays.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {errorMsg}
            </div>
          )}

          {/* Titles & Order Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-stone-700 mb-1.5">
                Cursive Headline Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. aesthetic, precision, luxury"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 focus:bg-white transition-all font-poppins"
              />
              <span className="text-[11px] text-stone-600 mt-1 block">
                Rendered with the large flowing script typography across the center.
              </span>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-stone-700 mb-1.5">
                Subtitle Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Where Luxury Meets Science"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-stone-600 mt-1 block">
                Subtle uppercase tracking subtitle beneath the cursive headline.
              </span>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-stone-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-6 flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-stone-800 cursor-pointer"
                />
                <div>
                  <span className="font-poppins text-xs uppercase tracking-wider font-semibold text-stone-800">
                    Active Slide
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Visible to visitors on the live client website.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <hr className="border-stone-200" />

          {/* Section 1: Desktop Images (3 images) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-stone-700" />
                <h3 className="font-poppins text-sm uppercase tracking-wider font-semibold text-stone-900">
                  Desktop View (3 Vertical Columns)
                </h3>
              </div>
              <span className="text-[11px] text-stone-600">
                Large screens show all 3 vertical image panels side-by-side.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[0, 1, 2].map((slotIdx) => {
                const imgUrl = desktopImages[slotIdx];
                const isUploading = uploadingSlot === `desktop-${slotIdx}`;

                return (
                  <div
                    key={`desktop-slot-${slotIdx}`}
                    className="border border-stone-200 rounded-xl p-3 bg-stone-50/40 flex flex-col justify-between space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-poppins uppercase tracking-wider text-stone-600 font-medium">
                        Column {slotIdx + 1}
                      </span>
                      {imgUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDesktopImages((prev) => {
                              const next = [...prev];
                              next[slotIdx] = "";
                              return next;
                            });
                          }}
                          className="text-stone-400 hover:text-red-600 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Image Preview Box */}
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-stone-200 border border-stone-300 flex items-center justify-center">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={`Desktop Column ${slotIdx + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center p-3 text-stone-400">
                          <Monitor className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] uppercase tracking-wider">Empty Slot</span>
                        </div>
                      )}

                      {/* Upload Spinner Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                          <Loader2 className="w-6 h-6 animate-spin mb-1 text-[#dfcca5]" />
                          <span className="text-[10px]">{uploadProgress}%</span>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="space-y-1.5">
                      <label className="block w-full">
                        <span className="sr-only">Upload file</span>
                        <div className="w-full py-1.5 px-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-poppins uppercase tracking-wider text-stone-700 transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>{imgUrl ? "Change Photo" : "Upload Photo"}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "desktop", slotIdx)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDesktopImages((prev) => {
                            const next = [...prev];
                            next[slotIdx] = val;
                            return next;
                          });
                        }}
                        placeholder="Or paste image URL"
                        className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-stone-200" />

          {/* Section 2: Mobile View Images (2 images) */}
          <div className="bg-[#f7f1eb]/70 p-4 sm:p-5 rounded-2xl border border-[#c2a878]/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#8c6d36]" />
                <h3 className="font-poppins text-sm uppercase tracking-wider font-semibold text-stone-900">
                  Mobile View (2 Vertical Columns)
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#dfcca5]/60 text-stone-900">
                  Custom Mobile Layout
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-3 font-light leading-relaxed">
              Smartphones have limited horizontal screen width, so the banner displays <strong>2 images</strong> instead of 3. Choose which images should be displayed on mobile devices.
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-poppins uppercase tracking-wider text-stone-500">
                Quick Presets:
              </span>
              <button
                type="button"
                onClick={() => applyMobilePreset(0, 1)}
                className="text-[11px] font-poppins uppercase tracking-wider px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                Use Desktop #1 & #2
              </button>
              <button
                type="button"
                onClick={() => applyMobilePreset(0, 2)}
                className="text-[11px] font-poppins uppercase tracking-wider px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                Use Desktop #1 & #3
              </button>
              <button
                type="button"
                onClick={() => applyMobilePreset(1, 2)}
                className="text-[11px] font-poppins uppercase tracking-wider px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                Use Desktop #2 & #3
              </button>
            </div>

            {/* Mobile Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              {[0, 1].map((slotIdx) => {
                const imgUrl = mobileImages[slotIdx];
                const isUploading = uploadingSlot === `mobile-${slotIdx}`;

                return (
                  <div
                    key={`mobile-slot-${slotIdx}`}
                    className="border border-stone-200/90 rounded-xl p-3 bg-white flex flex-col justify-between space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-poppins uppercase tracking-wider text-[#8c6d36] font-semibold">
                        Mobile Panel {slotIdx + 1}
                      </span>
                      {imgUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileImages((prev) => {
                              const next = [...prev];
                              next[slotIdx] = "";
                              return next;
                            });
                          }}
                          className="text-stone-400 hover:text-red-600 transition-colors"
                          title="Clear image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Preview */}
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={`Mobile Panel ${slotIdx + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center p-3 text-stone-400">
                          <Smartphone className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span className="text-[10px] uppercase tracking-wider">Empty</span>
                        </div>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                          <Loader2 className="w-6 h-6 animate-spin mb-1 text-[#dfcca5]" />
                          <span className="text-[10px]">{uploadProgress}%</span>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="space-y-1.5">
                      <label className="block w-full">
                        <span className="sr-only">Upload mobile file</span>
                        <div className="w-full py-1.5 px-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-poppins uppercase tracking-wider text-stone-700 transition-colors">
                          <Upload className="w-3 h-3" />
                          <span>{imgUrl ? "Change Mobile Photo" : "Upload Custom Mobile"}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "mobile", slotIdx)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMobileImages((prev) => {
                            const next = [...prev];
                            next[slotIdx] = val;
                            return next;
                          });
                        }}
                        placeholder="Or paste URL"
                        className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-900 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#dfcca5]" />
                <span className="text-xs uppercase font-poppins tracking-wider text-[#dfcca5]">
                  Live Visual Preview
                </span>
              </div>
              <div className="flex items-center gap-1 bg-stone-800 p-0.5 rounded-lg border border-stone-700">
                <button
                  type="button"
                  onClick={() => setPreviewTab("desktop")}
                  className={`px-2.5 py-1 rounded text-[10px] font-poppins uppercase tracking-wider cursor-pointer ${
                    previewTab === "desktop"
                      ? "bg-stone-950 text-white font-semibold"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Desktop (3 Cols)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("mobile")}
                  className={`px-2.5 py-1 rounded text-[10px] font-poppins uppercase tracking-wider cursor-pointer ${
                    previewTab === "mobile"
                      ? "bg-stone-950 text-[#dfcca5] font-semibold"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  Mobile (2 Cols)
                </button>
              </div>
            </div>

            {/* Preview Viewport */}
            <div
              className={`relative overflow-hidden rounded-lg bg-neutral-950 border border-white/10 mx-auto ${
                previewTab === "mobile" ? "max-w-[280px] h-[340px]" : "w-full h-[220px]"
              }`}
            >
              <div className="flex w-full h-full">
                {(previewTab === "desktop"
                  ? desktopImages
                  : mobileImages
                ).map((src, i) => (
                  <div
                    key={`preview-${previewTab}-${i}`}
                    className="relative flex-1 h-full border-r border-white/10 last:border-r-0 bg-stone-800"
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30 uppercase">
                        Slot {i + 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Text Overlay in Preview */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                <h4 className="font-script text-white text-3xl sm:text-4xl drop-shadow-md">
                  {title || "aesthetic"}
                </h4>
                {subtitle && (
                  <p className="text-[8px] uppercase tracking-[0.2em] text-white/90 drop-shadow-sm mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-poppins text-xs uppercase tracking-wider hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-poppins text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#dfcca5]" />
                <span>Saving Slide...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-[#dfcca5]" />
                <span>{slide ? "Update Banner Slide" : "Save Banner Slide"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
