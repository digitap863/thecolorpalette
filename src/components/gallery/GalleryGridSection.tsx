"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: "/Banner/1.jpg",
    alt: "Medifacial Skincare Treatment",
    category: "Medifacials",
    title: "Glow Medifacial Session"
  },
  {
    id: 2,
    src: "/Banner/2.jpg",
    alt: "Laser Treatment Studio",
    category: "Laser",
    title: "Advanced Laser Procedure"
  },
  {
    id: 3,
    src: "/Banner/3.jpg",
    alt: "Hair & Scalp Care",
    category: "Hair Care",
    title: "Hair & Scalp Therapy"
  },
  {
    id: 4,
    src: "/Banner/vlcsnap-2026-09-30-11h14m36s905.png",
    alt: "Aesthetic Consultation",
    category: "Aesthetics",
    title: "Personalised Skincare Consultation"
  },
  {
    id: 5,
    src: "/Banner/vlcsnap-2026-09-30-11h16m23s869.png",
    alt: "Bespoke Facial Care",
    category: "Medifacials",
    title: "Bespoke Skin Rejuvenation"
  },
  {
    id: 6,
    src: "/Banner/vlcsnap-2026-09-30-11h17m33s991.png",
    alt: "Chemical Peel Treatment",
    category: "Chemical Peels",
    title: "Deep Renewal Peel"
  },
  {
    id: 13,
    src: "/Banner/IMG_4090.jpg.jpeg",
    alt: "Specialised Skin Treatment",
    category: "Advance Skin",
    title: "Skin Rejuvenation Therapy"
  },
  {
    id: 14,
    src: "/Banner/IMG_7467.jpg.jpeg",
    alt: "Studio Experience",
    category: "Studio",
    title: "Treatment Room Interior"
  },
  {
    id: 15,
    src: "/Banner/MR_00092 2.JPG.jpeg",
    alt: "IV Therapy Lounge",
    category: "IV Therapy",
    title: "Wellness & IV Therapy"
  },
  {
    id: 16,
    src: "/images/about.png",
    alt: "Colorpellet Aesthetics",
    category: "Aesthetics",
    title: "Aesthetic Consultation Room"
  },
   {
    id: 17,
    src: "/Banner/1.jpg",
    alt: "Medifacial Skincare Treatment",
    category: "Medifacials",
    title: "Glow Medifacial Session"
  },
  {
    id: 22,
    src: "/Banner/2.jpg",
    alt: "Laser Treatment Studio",
    category: "Laser",
    title: "Advanced Laser Procedure"
  },
  {
    id: 23,
    src: "/Banner/3.jpg",
    alt: "Hair & Scalp Care",
    category: "Hair Care",
    title: "Hair & Scalp Therapy"
  },
  {
    id:24,
    src: "/Banner/vlcsnap-2026-09-30-11h14m36s905.png",
    alt: "Aesthetic Consultation",
    category: "Aesthetics",
    title: "Personalised Skincare Consultation"
  },
  {
    id: 25,
    src: "/Banner/vlcsnap-2026-09-30-11h16m23s869.png",
    alt: "Bespoke Facial Care",
    category: "Medifacials",
    title: "Bespoke Skin Rejuvenation"
  },

];

export default function GalleryGridSection() {
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

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
    setVisibleCount((prev) => Math.min(prev + 12, GALLERY_ITEMS.length));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleItems = GALLERY_ITEMS.slice(0, visibleCount);
  const hasMore = visibleCount < GALLERY_ITEMS.length;

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
    <section className="w-full bg-white/50 text-black py-16 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 relative">
      <div className="max-w-[1360px] mx-auto">
        {/* Gallery Image Grid (3 Columns on Desktop like screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-16">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative w-full aspect-square bg-neutral-100 overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Dark Overlay & Title */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#dfcca5] font-medium mb-1">
                  {item.category}
                </span>
                <h3 className="font-belleza text-lg sm:text-xl font-light uppercase tracking-wider">
                  {item.title}
                </h3>
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="w-full flex justify-center mt-8 mb-4">
            <button
              onClick={handleLoadMore}
              className="font-belleza px-10 py-4 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs sm:text-sm uppercase tracking-[0.25em] font-medium transition-colors duration-300 cursor-pointer shadow-sm hover:shadow-md"
            >
              LOAD MORE
            </button>
          </div>
        )}

        {!hasMore && GALLERY_ITEMS.length > 12 && (
          <div className="w-full text-center mt-8 mb-4">
            <span className="font-belleza text-xs uppercase tracking-[0.25em] text-neutral-400">
              ALL PHOTOS DISPLAYED
            </span>
          </div>
        )}
      </div>

      {/* Floating Scroll To Top Button (matching screenshot bottom right icon) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-neutral-900/90 text-white hover:bg-neutral-900 border border-neutral-700 shadow-xl transition-all duration-300 group cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="transform group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-50 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Prev button */}
          <button
            onClick={prevLightboxImage}
            className="absolute left-4 sm:left-8 z-50 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
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
              <h4 className="font-belleza text-xl uppercase tracking-wider mt-1">
                {visibleItems[selectedImageIndex].title}
              </h4>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={nextLightboxImage}
            className="absolute right-4 sm:right-8 z-50 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
