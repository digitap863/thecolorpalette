"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { ServiceData } from "@/types/services";

import "swiper/css";
import "swiper/css/pagination";

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
  const allImages: string[] = useMemo(() => {
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
  const hasFullDescription = Boolean(
    treatment.description && treatment.description.trim().length > 0
  );
  const hasPoints = Boolean(
    Array.isArray(treatment.points) && treatment.points.length > 0
  );
  const hasPdfUrl = Boolean(
    treatment.pdfUrl && treatment.pdfUrl.trim().length > 0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/65 backdrop-blur-md animate-fade-in sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="treatment-modal-title"
    >
      {/* Modal / Sheet Card Container (Bottom Sheet on Mobile, Centered Modal on Desktop) */}
      <div
        className="relative w-full sm:max-w-4xl lg:max-w-5xl h-[92vh] sm:h-auto sm:max-h-[90vh] bg-[#F7F1EB] text-stone-900 rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border-t sm:border border-stone-300/60 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull / Drag Indicator Pill */}
        <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Top Header / Sticky Bar with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 bg-[#F7F1EB]/95 backdrop-blur-md border-b border-stone-200/80 shrink-0">
          <div className="flex items-center gap-2">
            {categoryName && (
              <span className="text-xs uppercase tracking-[0.25em] text-[#b39556] font-medium font-belleza">
                {categoryName}
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
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-28 sm:p-8 lg:p-10 sm:pb-8">

          {/* ── MOBILE-ONLY SWIPER IMAGE GALLERY (hidden on md+) ── */}
          <div className="block md:hidden w-full mb-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200 shadow-sm border border-stone-300/60">
              <Swiper
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                  bulletActiveClass: "!w-5 !bg-[#b39556] !rounded-full",
                  bulletClass:
                    "swiper-pagination-bullet !w-2 !h-2 !bg-stone-900/40 !transition-all !duration-300",
                }}
                className="w-full h-full"
              >
                {allImages.map((img, idx) => (
                  <SwiperSlide key={idx} className="relative w-full h-full">
                    <Image
                      src={imgErrorMap[idx] ? FALLBACK_IMAGE : img}
                      alt={`${treatment.name} ${idx + 1}`}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      onError={() =>
                        setImgErrorMap((prev) => ({ ...prev, [idx]: true }))
                      }
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent pointer-events-none" />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Photo Count Pill */}
              {allImages.length > 1 && (
                <div className="absolute top-3 right-3 z-10 bg-stone-900/75 backdrop-blur-xs text-white text-[10px] font-medium tracking-widest px-2.5 py-1 rounded-full pointer-events-none">
                  {allImages.length} Photos
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* ── DESKTOP-ONLY IMAGE GALLERY & THUMBNAILS (hidden on mobile, flex on md+) ── */}
            <div className="hidden md:flex md:col-span-6 flex-col gap-4">
              {/* Main Display Image */}
              <div className="relative w-full aspect-[4/5] bg-stone-200/70 rounded-xl overflow-hidden border border-stone-300/60 group shadow-xs">
                <Image
                  src={currentImageSrc}
                  alt={treatment.name}
                  fill
                  sizes="50vw"
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

              {/* Thumbnails Navigation (Desktop) */}
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
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${isSelected
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

            {/* ── RIGHT / DETAILS COLUMN: Information & Content ── */}
            <div className="md:col-span-6 flex flex-col justify-between h-full">
              <div>
                {/* Category Subtitle */}
                {categoryName && (
                  <span className="text-xs uppercase tracking-[0.25em] text-[#b39556] font-semibold block mb-2 font-belleza">
                    {categoryName}
                  </span>
                )}

                {/* Treatment Title */}
                <h2
                  id="treatment-modal-title"
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-stone-900 tracking-tight leading-tight mb-3 sm:mb-4"
                >
                  {treatment.name}
                </h2>

                {/* Short Description */}
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-stone-200/80">
                  {treatment.shortDescription}
                </p>

                {/* Bullet Points / Highlights (if available) */}
                {hasPoints && (
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 mb-3 font-belleza">
                      Treatment Highlights
                    </h3>
                    <ul className="space-y-2.5">
                      {treatment.points!.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 font-light bg-stone-100/60 p-2.5 sm:p-0 sm:bg-transparent rounded-xl"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#b39556] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Full Description (if available) */}
                {hasFullDescription && (
                  <div className="mb-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-800 mb-2 font-belleza">
                      Overview & Care Approach
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed whitespace-pre-line">
                      {treatment.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop-only action buttons placeholder (hidden on mobile, rendered at bottom of modal) */}
              <div className="hidden sm:flex mt-8 pt-6 border-t border-stone-200/80 items-center gap-3.5">
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 text-stone-100 hover:bg-stone-800 px-4 py-3.5 rounded-xl font-belleza text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer shadow-sm text-center"
                >
                  <Calendar className="w-4 h-4 text-[#dfcca5]" />
                  <span>BOOK A CONSULTATION</span>
                </Link>

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

        {/* ── MOBILE-ONLY STICKY BOTTOM ACTION BAR (Thumb Zone) ── */}
        <div className="sm:hidden absolute bottom-0 inset-x-0 z-30 px-5 py-3.5 bg-[#F7F1EB]/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5">
          {/* Main Book CTA */}
          <Link
            href="/contact"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 text-stone-100 hover:bg-stone-800 py-3.5 px-4 rounded-xl font-belleza text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer shadow-sm text-center active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 text-[#dfcca5]" />
            <span>BOOK A CONSULTATION</span>
          </Link>

          {/* Brochure button if PDF exists */}
          {hasPdfUrl && (
            <a
              href={treatment.pdfUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white px-3.5 py-3.5 rounded-xl font-belleza text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer shrink-0 active:scale-[0.98]"
              title="Download Brochure"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
