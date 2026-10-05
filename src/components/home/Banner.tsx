"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerSlide {
  id: string | number;
  title?: string;
  subtitle?: string;
  images: string[];
}

interface BannerProps {
  slides?: BannerSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 1,
    title: "sanctuary",
    subtitle: "Luxury Salon Experience",
    images: [
      "/Banner/IMG_4090.jpg.jpeg",
      "/Banner/vlcsnap-2026-09-30-11h14m36s905.png",
      "/Banner/IMG_7467.jpg.jpeg",
    ],
  },
  {
    id: 2,
    title: "creations",
    subtitle: "Vibrant Colors & Precision Cuts",
    images: [
      "/Banner/vlcsnap-2026-09-30-11h16m23s869.png",
      "/Banner/vlcsnap-2026-09-30-11h17m33s991.png",
      "/Banner/MR_00092%202.JPG.jpeg",
    ],
  },
  {
    id: 3,
    title: "artists",
    subtitle: "Master Stylists & Colorists",
    images: [
      "/Banner/vlcsnap-2026-09-30-11h15m34s413.png",
      "/Banner/vlcsnap-2026-09-30-11h14m36s905.png",
      "/Banner/vlcsnap-2026-09-30-11h15m44s622.png",
    ],
  },
  {
    id: 4,
    title: "gallery",
    subtitle: "Bespoke Palette Transformations",
    images: [
      "/Banner/vlcsnap-2026-09-30-11h15m44s622.png",
      "/Banner/vlcsnap-2026-09-30-11h17m33s991.png",
      "/Banner/MR_00092%202.JPG.jpeg",
    ],
  },
];

export default function Banner({
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
}: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeSlide = slides[currentIndex] || DEFAULT_SLIDES[0];
  const prevSlide = slides[prevIndex] || DEFAULT_SLIDES[0];

  const changeSlide = (nextIndex: number) => {
    if (isAnimating || nextIndex === currentIndex) return;
    setIsAnimating(true);
    setPrevIndex(currentIndex);
    setCurrentIndex(nextIndex);
    setSlideKey((prev) => prev + 1);
  };

  const handlePrev = () => {
    const nextIdx = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    changeSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    changeSlide(nextIdx);
  };

  // Sync prevIndex after animation sequence completes to clean up base layer
  useEffect(() => {
    if (currentIndex === prevIndex) return;
    const timer = setTimeout(() => {
      setPrevIndex(currentIndex);
      setIsAnimating(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, [currentIndex, prevIndex]);

  // Autoplay handler
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length, currentIndex, isAnimating]);

  const isTransitioning = currentIndex !== prevIndex;

  return (
    <section className={`relative w-full overflow-hidden bg-black ${className}`}>
      {/* 3 Parallel Images Grid Container */}
      <div className="relative w-full h-[550px] sm:h-[650px] md:h-[700px] lg:h-[750px] flex select-none bg-neutral-950">
        {activeSlide.images.slice(0, 3).map((newImgSrc, imgIndex) => {
          const oldImgSrc = prevSlide.images[imgIndex] || newImgSrc;
          // Staggered time difference between columns (180ms delay per column)
          const delayMs = imgIndex * 180;

          return (
            <div
              key={`col-${imgIndex}`}
              className="group relative flex-1 h-full overflow-hidden border-r border-white/10 last:border-r-0"
            >
              {/* Layer 1: Old Image */}
              {isTransitioning && (
                <div
                  key={`old-${slideKey}-${imgIndex}`}
                  className="absolute inset-0 w-full h-full animate-old-slide-down"
                  style={{ animationDelay: `${delayMs}ms` }}
                >
                  <Image
                    src={oldImgSrc}
                    alt={`Previous banner image ${imgIndex + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>
              )}

              {/* Layer 2: New Incoming Image */}
              <div
                key={`new-${slideKey}-${imgIndex}`}
                className={`absolute inset-0 w-full h-full ${
                  isTransitioning ? "animate-new-slide-down" : ""
                }`}
                style={{
                  animationDelay: isTransitioning ? `${delayMs}ms` : "0ms",
                }}
              >
                <Image
                  src={newImgSrc}
                  alt={`Banner image ${imgIndex + 1}`}
                  fill
                  priority={imgIndex === 0}
                  className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Vignette overlay for image depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 group-hover:from-black/10 group-hover:to-black/40 transition-colors duration-500" />
              </div>
            </div>
          );
        })}

        {/* Large Script Text Overlay Across Center */}
        <div
          key={`title-${slideKey}`}
          className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center ${
            isTransitioning ? "animate-text-fade-up" : ""
          }`}
          style={{ animationDelay: "420ms" }}
        >
          {activeSlide.title && (
            <h2 className="font-script text-white text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-wider leading-none select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.75)]">
              {activeSlide.title}
            </h2>
          )}
          {activeSlide.subtitle && (
            <p className="mt-2 text-xs sm:text-sm md:text-base font-light tracking-[0.35em] uppercase text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {activeSlide.subtitle}
            </p>
          )}
        </div>

        {/* Left Arrow Navigation */}
        {slides.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 transform active:scale-90 hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8 sm:w-12 sm:h-12 stroke-[1.5]" />
          </button>
        )}

        {/* Right Arrow Navigation */}
        {slides.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 transform active:scale-90 hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] cursor-pointer"
          >
            <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12 stroke-[1.5]" />
          </button>
        )}
      </div>
    </section>
  );
}
