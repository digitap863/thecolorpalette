"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Monitor,
  Smartphone,
  RefreshCw,
  AlertCircle,
  Eye,
} from "lucide-react";
import { BannerSlide } from "@/types/banner";
import BannerFormModal from "@/components/admin/banners/BannerFormModal";

export default function AdminBannersPage() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (err: any) {
      showToast("error", err.message || "Failed to load banner slides");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const handleToggleActive = async (slide: BannerSlide) => {
    const slideId = slide._id || slide.id;
    if (!slideId) return;

    try {
      const res = await fetch(`/api/admin/banners/${slideId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !slide.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      showToast("success", `Slide is now ${!slide.isActive ? "Active" : "Inactive"}`);
      fetchSlides();
    } catch (err: any) {
      showToast("error", err.message || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete banner slide");
      showToast("success", "Banner slide deleted successfully");
      setDeleteConfirmId(null);
      fetchSlides();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete slide");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-belleza uppercase tracking-wider transition-all animate-bounce-in ${
            toast.type === "success"
              ? "bg-[#1c1917] text-[#f7f1eb] border-[#c2a878]/40"
              : "bg-red-950 text-red-200 border-red-700/60"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#c2a878]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8c6d36] font-belleza font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8c6d36]" />
              Homepage Experience
            </span>
          </div>
          <h1 className="font-belleza text-2xl sm:text-3xl text-stone-900 uppercase tracking-wider font-light">
            Hero Banner Slides
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Configure dynamic multi-column sliding hero sections with dedicated mobile 2-column layouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSlides}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setEditingSlide(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-belleza text-xs uppercase tracking-[0.15em] font-medium hover:bg-stone-800 transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#dfcca5]" />
            <span>Add Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl p-6 border border-stone-200 animate-pulse space-y-4"
            >
              <div className="h-6 bg-stone-200 rounded w-1/3" />
              <div className="h-44 bg-stone-200 rounded-xl" />
              <div className="h-4 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && slides.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#f7f1eb] border border-[#c2a878]/30 mx-auto flex items-center justify-center text-[#8c6d36]">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-belleza text-lg uppercase tracking-wider text-stone-900 font-medium">
              No Banner Slides Configured
            </h3>
            <p className="text-xs text-stone-500 font-light mt-1">
              Create your first banner slide to display tailored desktop 3-column and mobile 2-column visuals.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSlide(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-belleza text-xs uppercase tracking-wider font-semibold shadow-md hover:bg-stone-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#dfcca5]" />
            <span>Create Banner Slide</span>
          </button>
        </div>
      )}

      {/* Slides Cards List */}
      {!loading && slides.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {slides.map((slide, idx) => {
            const slideId = slide._id || slide.id || String(idx);
            const desktopImgs = slide.images || [];
            const mobileImgs =
              slide.mobileImages && slide.mobileImages.length >= 2
                ? slide.mobileImages.slice(0, 2)
                : desktopImgs.slice(0, 2);

            return (
              <div
                key={slideId}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                  slide.isActive
                    ? "border-stone-200/90"
                    : "border-stone-200/50 opacity-70"
                }`}
              >
                {/* Card Top: Order, Title, Status & Actions */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-belleza font-bold flex items-center justify-center">
                        #{slide.order ?? idx + 1}
                      </span>
                      <div>
                        <h3 className="font-script text-3xl sm:text-4xl text-stone-900 leading-tight">
                          {slide.title || "Untitled Slide"}
                        </h3>
                        {slide.subtitle && (
                          <p className="font-belleza text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-0.5">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`px-3 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                        slide.isActive
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
                      }`}
                    >
                      {slide.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Previews: Desktop & Mobile Comparison */}
                <div className="px-5 py-2 space-y-3">
                  {/* Desktop Preview Strip (3 images) */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-belleza uppercase tracking-wider text-stone-600 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-stone-700" />
                        <span>Desktop Layout (3 Images)</span>
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {desktopImgs.length} images set
                      </span>
                    </div>

                    <div className="h-32 w-full rounded-xl overflow-hidden bg-neutral-950 flex border border-stone-200">
                      {desktopImgs.slice(0, 3).map((img, i) => (
                        <div
                          key={`desktop-strip-${i}`}
                          className="relative flex-1 h-full border-r border-white/10 last:border-r-0"
                        >
                          {img ? (
                            <Image
                              src={img}
                              alt={`Desktop ${i + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-white/30 uppercase">
                              Empty
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Preview Strip (2 images) */}
                  <div className="bg-[#f7f1eb]/60 p-3 rounded-xl border border-[#c2a878]/30">
                    <div className="flex items-center justify-between text-[11px] font-belleza uppercase tracking-wider text-stone-800 mb-1.5">
                      <span className="flex items-center gap-1.5 font-semibold text-[#8c6d36]">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile Layout (2 Images)</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#dfcca5]/60 text-stone-900 font-semibold">
                        2 Per Row
                      </span>
                    </div>

                    <div className="h-28 max-w-[200px] rounded-lg overflow-hidden bg-neutral-950 flex border border-stone-300">
                      {mobileImgs.slice(0, 2).map((img, i) => (
                        <div
                          key={`mobile-strip-${i}`}
                          className="relative flex-1 h-full border-r border-white/10 last:border-r-0"
                        >
                          {img ? (
                            <Image
                              src={img}
                              alt={`Mobile ${i + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-white/30 uppercase">
                              Empty
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Edit & Delete buttons */}
                <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between mt-2">
                  <div className="text-[11px] text-stone-400 font-light">
                    Slide #{slide.order ?? idx + 1}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSlide(slide);
                        setModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-900 hover:text-white text-stone-700 font-belleza text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Slide</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(slideId)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-belleza text-lg uppercase tracking-wider font-semibold text-stone-900">
                Delete Banner Slide?
              </h3>
              <p className="text-xs text-stone-500 font-light mt-1">
                Are you sure you want to remove this slide? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-belleza uppercase tracking-wider hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-belleza uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Create / Edit Modal */}
      <BannerFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSlide(null);
        }}
        onSaved={fetchSlides}
        slide={editingSlide}
      />
    </div>
  );
}
