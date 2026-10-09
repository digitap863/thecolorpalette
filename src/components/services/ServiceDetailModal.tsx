"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, FileText, Calendar, CheckCircle2, Sparkles } from "lucide-react";
import { ServiceData } from "@/types/services";

interface ServiceDetailModalProps {
  treatment: ServiceData | null;
  categoryName?: string;
  onClose: () => void;
}

const FALLBACK_IMAGE = "/gallery/gallery_medifacial_1_1791351357677.png";

export default function ServiceDetailModal({
  treatment,
  categoryName,
  onClose,
}: ServiceDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({});
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Collect all available unique images (main image + gallery images)
  const allImages: string[] = React.useMemo(() => {
    if (!treatment) return [];
    const set = new Set<string>();
    if (treatment.image?.trim()) {
      set.add(treatment.image.trim());
    }
    if (Array.isArray(treatment.images)) {
      treatment.images.forEach((img) => {
        if (img?.trim()) set.add(img.trim());
      });
    }
    const list = Array.from(set);
    return list.length > 0 ? list : [FALLBACK_IMAGE];
  }, [treatment]);

  // Reset active image index when treatment changes
  useEffect(() => {
    setActiveImageIndex(0);
    setImgErrorMap({});
  }, [treatment]);

  // Lock body scroll while modal is open & handle Escape key
  useEffect(() => {
    if (!treatment) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button for accessibility
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [treatment, onClose]);

  if (!treatment) return null;

  const currentImageSrc = imgErrorMap[activeImageIndex]
    ? FALLBACK_IMAGE
    : allImages[activeImageIndex] || FALLBACK_IMAGE;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const hasMultipleImages = allImages.length > 1;
  const hasFullDescription = Boolean(treatment.description && treatment.description.trim().length > 0);
  const hasPoints = Boolean(Array.isArray(treatment.points) && treatment.points.length > 0);
  const hasPdfUrl = Boolean(treatment.pdfUrl && treatment.pdfUrl.trim().length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="treatment-modal-title"
    >
      {/* Modal Card Container */}
      <div
        className="relative w-full max-w-4xl lg:max-w-5xl max-h-[90vh] bg-[#F7F1EB] text-stone-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-stone-300/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Sticky Bar with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#F7F1EB]/90 backdrop-blur-md border-b border-stone-200/80">
          <div className="flex items-center gap-2">
            {categoryName && (
              <span className="text-xs uppercase tracking-[0.25em] text-[#b39556] font-medium">
                {categoryName}
              </span>
            )}
            {treatment.featured && (
              <span className="inline-flex items-center gap-1 bg-stone-900 text-stone-100 text-[10px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full font-medium ml-2">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Signature</span>
              </span>
            )}
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close treatment details"
            className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: Image Gallery & Navigation */}
            <div className="md:col-span-6 flex flex-col gap-4">
              {/* Main Display Image */}
              <div className="relative w-full aspect-[4/3] bg-stone-200/70 rounded-xl overflow-hidden border border-stone-300/60 group shadow-xs">
                <Image
                  src={currentImageSrc}
                  alt={treatment.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => {
                    setImgErrorMap((prev) => ({ ...prev, [activeImageIndex]: true }));
                  }}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                {/* Multiple Image Carousel Controls */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-900/60 text-white backdrop-blur-xs hover:bg-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-900/60 text-white backdrop-blur-xs hover:bg-stone-900 flex items-center justify-center transition-all cursor-pointer shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-3 right-3 bg-stone-900/75 backdrop-blur-xs text-white text-[11px] font-medium tracking-widest px-2.5 py-1 rounded-full">
                      {activeImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails Navigation (if multiple images) */}
              {hasMultipleImages && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {allImages.map((img, idx) => {
                    const isSelected = idx === activeImageIndex;
                    const thumbSrc = imgErrorMap[idx] ? FALLBACK_IMAGE : img;

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        aria-label={`View image ${idx + 1}`}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-stone-900 ring-2 ring-stone-900/20 shadow-sm scale-102"
                            : "border-stone-300/80 opacity-70 hover:opacity-100 hover:border-stone-500"
                        }`}
                      >
                        <Image
                          src={thumbSrc}
                          alt={`${treatment.name} thumbnail ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Treatment Information & Actions */}
            <div className="md:col-span-6 flex flex-col justify-between h-full">
              <div>
                {/* Category Subtitle */}
                {categoryName && (
                  <span className="text-xs uppercase tracking-[0.25em] text-[#b39556] font-semibold block mb-2">
                    {categoryName}
                  </span>
                )}

                {/* Treatment Title */}
                <h2
                  id="treatment-modal-title"
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-stone-900 tracking-tight leading-tight mb-4"
                >
                  {treatment.name}
                </h2>

                {/* Short Description */}
                <p className="text-base text-stone-700 leading-relaxed font-normal mb-6 pb-6 border-b border-stone-200/80">
                  {treatment.shortDescription}
                </p>

                {/* Full Description (if available) */}
                {hasFullDescription && (
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 mb-2">
                      Overview
                    </h3>
                    <p className="text-sm text-stone-600 font-light leading-relaxed whitespace-pre-line">
                      {treatment.description}
                    </p>
                  </div>
                )}

                {/* Bullet Points / Highlights (if available) */}
                {hasPoints && (
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 mb-3">
                      Treatment Highlights
                    </h3>
                    <ul className="space-y-2.5">
                      {treatment.points!.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-stone-700 font-light">
                          <CheckCircle2 className="w-4 h-4 text-[#b39556] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons Area */}
              <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                {/* Book Consultation CTA */}
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 text-stone-100 hover:bg-stone-800 px-2 py-3.5 rounded-xl font-belleza text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer shadow-sm text-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>BOOK A CONSULTATION</span>
                </Link>

                {/* View Treatment PDF Button (Only if pdfUrl exists!) */}
                {hasPdfUrl && (
                  <a
                    href={treatment.pdfUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-stone-100 px-6 py-3.5 rounded-xl font-belleza text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer text-center shrink-0"
                  >
                    <FileText className="w-4 h-4" />
                    <span>BROCHURE</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
