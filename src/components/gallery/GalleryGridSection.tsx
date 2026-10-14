"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, X, ChevronLeft, ChevronRight, Maximize2, Loader2 } from "lucide-react";
import { GalleryItem } from "@/types/gallery";

export default function GalleryGridSection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

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

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 p-2.5 sm:p-3 bg-neutral-900/90 text-white hover:bg-neutral-900 border border-neutral-700 shadow-xl transition-all duration-300 group cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="transform group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && visibleItems[selectedImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 sm:p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={prevLightboxImage}
            className="absolute left-2 sm:left-8 z-50 p-2 sm:p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="sm:w-7 sm:h-7" />
          </button>

          {/* Image Container */}
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[70vh]">
              <Image
                src={visibleItems[selectedImageIndex].src}
                alt={visibleItems[selectedImageIndex].alt}
                fill
                className="object-contain object-center"
              />
            </div>
            <div className="text-center mt-4 text-white">
              <span className="text-xs uppercase tracking-widest text-[#dfcca5]">
                {visibleItems[selectedImageIndex].category}
              </span>
              <h4 className="font-belleza text-lg sm:text-xl uppercase tracking-wider mt-1">
                {visibleItems[selectedImageIndex].title}
              </h4>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={nextLightboxImage}
            className="absolute right-2 sm:right-8 z-50 p-2 sm:p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="sm:w-7 sm:h-7" />
          </button>
        </div>
      )}
    </section>
  );
}
