"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowUp, X, ChevronLeft, ChevronRight, Maximize2, Loader2 } from "lucide-react";
import { GalleryItem } from "@/types/gallery";

export default function GalleryGridSection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch gallery images from API (backed by MongoDB database)
  useEffect(() => {
    let isMounted = true;
    async function fetchGallery() {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data: GalleryItem[] = await res.json();
          if (isMounted) {
            setGalleryItems(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch gallery images:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  // Monitor scroll for Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, galleryItems.length));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleItems = galleryItems.slice(0, visibleCount);
  const hasMore = visibleCount < galleryItems.length;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const prevLightboxImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? visibleItems.length - 1 : (prev as number) - 1
    );
  };

  const nextLightboxImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === visibleItems.length - 1 ? 0 : (prev as number) + 1
    );
  };

  // Lock body scroll & background interaction when modal is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [selectedImageIndex]);

  // Keyboard navigation (Arrow keys & Escape)
  useEffect(() => {
    if (selectedImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightboxImage();
      if (e.key === "ArrowRight") nextLightboxImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, visibleItems.length]);

  // Touch gesture support for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Horizontal swipe threshold: 40px
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 40) {
        nextLightboxImage();
      } else if (diffX < -40) {
        prevLightboxImage();
      }
    } else {
      // Downward swipe threshold to dismiss: 80px
      if (diffY < -80) {
        closeLightbox();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section className="w-full bg-white/50 text-black py-12 sm:py-24 px-3 sm:px-8 md:px-12 lg:px-16 relative">
      <div className="max-w-[1360px] mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full aspect-square bg-neutral-200/60 animate-pulse rounded-xs"
              />
            ))}
          </div>
        )}

        {/* Gallery Image Grid (2 Columns on Mobile, 3 on Desktop) */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {visibleItems.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => openLightbox(index)}
                className="group relative w-full aspect-square bg-neutral-100 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Hover Dark Overlay & Title */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-6 text-white">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#dfcca5] font-medium mb-0.5 sm:mb-1 line-clamp-1">
                    {item.category}
                  </span>
                  <h3 className="font-belleza text-xs sm:text-lg md:text-xl font-light uppercase tracking-wider line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/40 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && hasMore && (
          <div className="w-full flex justify-center mt-6 sm:mt-8 mb-4">
            <button
              onClick={handleLoadMore}
              className="font-belleza px-8 sm:px-10 py-3 sm:py-4 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium transition-colors duration-300 cursor-pointer shadow-sm hover:shadow-md"
            >
              LOAD MORE
            </button>
          </div>
        )}

        {!loading && !hasMore && galleryItems.length > 12 && (
          <div className="w-full text-center mt-6 sm:mt-8 mb-4">
            <span className="font-belleza text-xs uppercase tracking-[0.25em] text-neutral-400">
              ALL PHOTOS DISPLAYED
            </span>
          </div>
        )}
      </div>

      {/* Floating Scroll To Top Button (hidden while modal is open) */}
      {showScrollTop && selectedImageIndex === null && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 p-2.5 sm:p-3 bg-neutral-900/90 text-white hover:bg-neutral-900 border border-neutral-700 shadow-xl transition-all duration-300 group cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="transform group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Lightbox Modal: Portaled directly into document.body to fully lock background interaction until closed */}
      {mounted &&
        selectedImageIndex !== null &&
        visibleItems[selectedImageIndex] &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image detail view"
            className="fixed inset-0 z-[99999] w-screen h-[100dvh] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none touch-none overscroll-none"
            onClick={closeLightbox}
          >
            {/* Top Bar: Counter, Category Badge, Close Button */}
            <header
              className="w-full flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image counter & Category pill */}
              <div className="flex items-center gap-2">
                <span className="font-poppins text-xs sm:text-sm font-medium text-white/90 bg-white/10 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-full border border-white/10">
                  {selectedImageIndex + 1} / {visibleItems.length}
                </span>
                {visibleItems[selectedImageIndex].category && (
                  <span className="hidden xs:inline-block text-[11px] sm:text-xs uppercase tracking-widest text-[#dfcca5] bg-[#dfcca5]/10 px-3 py-1.5 rounded-full border border-[#dfcca5]/20 font-medium">
                    {visibleItems[selectedImageIndex].category}
                  </span>
                )}
              </div>

              {/* Close button with large touch target */}
              <button
                onClick={closeLightbox}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white/90 hover:text-white rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all cursor-pointer border border-white/10"
                aria-label="Close modal"
              >
                <X size={20} className="sm:w-5 sm:h-5" />
              </button>
            </header>

            {/* Main Content Area (Image with touch swipe + Desktop side chevrons) */}
            <div
              className="flex-1 relative w-full flex items-center justify-center px-3 sm:px-16 md:px-24 py-2 overflow-hidden min-h-0"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Desktop Prev Button */}
              <button
                onClick={prevLightboxImage}
                className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 border border-white/20 text-white items-center justify-center shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Responsive Centered Image */}
              <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
                <Image
                  key={visibleItems[selectedImageIndex].src}
                  src={visibleItems[selectedImageIndex].src}
                  alt={visibleItems[selectedImageIndex].alt || visibleItems[selectedImageIndex].title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 85vw"
                  className="object-contain object-center drop-shadow-2xl transition-opacity duration-300"
                />
              </div>

              {/* Desktop Next Button */}
              <button
                onClick={nextLightboxImage}
                className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 border border-white/20 text-white items-center justify-center shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Bar: Title, Category (mobile fallback), and Mobile Navigation Arrows */}
            <footer
              className="w-full z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 sm:px-8 pt-3 pb-6 sm:pb-8 flex flex-col items-center text-center shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Category display if not shown above */}
              {visibleItems[selectedImageIndex].category && (
                <span className="xs:hidden text-[11px] uppercase tracking-widest text-[#dfcca5] font-medium mb-1">
                  {visibleItems[selectedImageIndex].category}
                </span>
              )}

              {/* Title */}
              <h4 className="font-belleza text-base sm:text-xl lg:text-2xl text-white font-light uppercase tracking-wider max-w-xl truncate sm:whitespace-normal">
                {visibleItems[selectedImageIndex].title}
              </h4>

              {/* Mobile Touch Navigation Controls (thumb-friendly buttons) */}
              <div className="flex sm:hidden items-center justify-center gap-3 mt-3 w-full max-w-xs">
                <button
                  onClick={prevLightboxImage}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-white/10 active:bg-white/25 border border-white/15 text-white text-xs font-poppins font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                <button
                  onClick={nextLightboxImage}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-white/10 active:bg-white/25 border border-white/15 text-white text-xs font-poppins font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
                  aria-label="Next image"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Subtle swipe gesture hint on mobile */}
              <span className="sm:hidden text-[10px] text-white/40 tracking-wider uppercase mt-2 select-none">
                Swipe left or right to browse
              </span>
            </footer>
          </div>,
          document.body
        )}
    </section>
  );
}
