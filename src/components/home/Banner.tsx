"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BannerSlide } from "@/types/banner";


export type { BannerSlide };

interface BannerProps {
  slides?: BannerSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export default function Banner({
  slides: initialSlides,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = "",
}: BannerProps) {
  const [slides, setSlides] = useState<BannerSlide[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialSlides || initialSlides.length === 0);

  // Fetch banners dynamically from MongoDB API if no custom slides provided
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      return;
    }

    let isMounted = true;
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners");
        if (res.ok) {
          const data: BannerSlide[] = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setSlides(data);
          }
        }
      } catch (err) {
        console.error("Failed to load banner slides from database:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, [initialSlides]);

  const changeSlide = (nextIndex: number) => {
    if (isAnimating || nextIndex === currentIndex || slides.length <= 1) return;
    setIsAnimating(true);
    setPrevIndex(currentIndex);
    setCurrentIndex(nextIndex);
    setSlideKey((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (slides.length <= 1) return;
    const nextIdx = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    changeSlide(nextIdx);
  };

  const handleNext = () => {
    if (slides.length <= 1) return;
    const nextIdx = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    changeSlide(nextIdx);
  };

  // Sync prevIndex after animation sequence completes
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
      if (isAnimating || slides.length <= 1) return;
      setIsAnimating(true);
      setPrevIndex(currentIndex);
      const nextIdx = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSlideKey((prev) => prev + 1);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length, currentIndex, isAnimating]);

  if (isLoading) {
    return (
      <section className={`relative w-full overflow-hidden bg-neutral-950 ${className}`}>
        <div className="relative w-full h-[calc(100dvh-5rem)] select-none bg-neutral-950" />
      </section>
    );
  }

  if (!slides || slides.length === 0) {
    return null;
  }

  const safeCurrentIndex = currentIndex < slides.length ? currentIndex : 0;
  const safePrevIndex = prevIndex < slides.length ? prevIndex : 0;
  const activeSlide = slides[safeCurrentIndex];
  const prevSlide = slides[safePrevIndex];

  if (!activeSlide) return null;

  const isTransitioning = safeCurrentIndex !== safePrevIndex;

  // Prepare Desktop Images (3 images)
  const desktopImages =
    activeSlide.images && activeSlide.images.length > 0
      ? activeSlide.images.slice(0, 3)
      : [];

  const prevDesktopImages =
    prevSlide.images && prevSlide.images.length > 0
      ? prevSlide.images.slice(0, 3)
      : desktopImages;

  // Prepare Mobile Images (2 images) - uses mobileImages defined in DB or first 2 desktop images
  const mobileImages =
    activeSlide.mobileImages && activeSlide.mobileImages.length >= 2
      ? activeSlide.mobileImages.slice(0, 2)
      : activeSlide.images && activeSlide.images.length >= 2
      ? activeSlide.images.slice(0, 2)
      : desktopImages.slice(0, 2);

  const prevMobileImages =
    prevSlide.mobileImages && prevSlide.mobileImages.length >= 2
      ? prevSlide.mobileImages.slice(0, 2)
      : prevSlide.images && prevSlide.images.length >= 2
      ? prevSlide.images.slice(0, 2)
      : mobileImages;

  return (
    <section className={`relative w-full overflow-hidden bg-black ${className}`}>
      {/* Banner Viewport */}
      <div className="relative w-full h-[calc(100dvh-5rem)] select-none bg-neutral-950">
        
        {/* ── DESKTOP VIEW: 3 Parallel Image Columns (hidden on mobile, flex on md+) ── */}
        <div className="hidden md:flex w-full h-full">
          {desktopImages.map((newImgSrc, imgIndex) => {
            const oldImgSrc = prevDesktopImages[imgIndex] || newImgSrc;
            const delayMs = imgIndex * 180;

            return (
              <div
                key={`desktop-col-${imgIndex}`}
                className="group relative flex-1 h-full overflow-hidden border-r border-white/10 last:border-r-0"
              >
                {/* Layer 1: Old Image sliding down */}
                {isTransitioning && (
                  <div
                    key={`d-old-${slideKey}-${imgIndex}`}
                    className="absolute inset-0 w-full h-full animate-old-slide-down"
                    style={{ animationDelay: `${delayMs}ms` }}
                  >
                    <Image
                      src={oldImgSrc}
                      alt={`Previous banner column ${imgIndex + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  </div>
                )}

                {/* Layer 2: New Incoming Image */}
                <div
                  key={`d-new-${slideKey}-${imgIndex}`}
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
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 group-hover:from-black/10 group-hover:to-black/40 transition-colors duration-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MOBILE VIEW: 2 Parallel Image Columns (flex on mobile, hidden on md+) ── */}
        <div className="flex md:hidden w-full h-full">
          {mobileImages.map((newImgSrc, imgIndex) => {
            const oldImgSrc = prevMobileImages[imgIndex] || newImgSrc;
            const delayMs = imgIndex * 180;

            return (
              <div
                key={`mobile-col-${imgIndex}`}
                className="group relative flex-1 h-full overflow-hidden border-r border-white/10 last:border-r-0"
              >
                {/* Layer 1: Old Image sliding down */}
                {isTransitioning && (
                  <div
                    key={`m-old-${slideKey}-${imgIndex}`}
                    className="absolute inset-0 w-full h-full animate-old-slide-down"
                    style={{ animationDelay: `${delayMs}ms` }}
                  >
                    <Image
                      src={oldImgSrc}
                      alt={`Previous mobile column ${imgIndex + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  </div>
                )}

                {/* Layer 2: New Incoming Image */}
                <div
                  key={`m-new-${slideKey}-${imgIndex}`}
                  className={`absolute inset-0 w-full h-full ${
                    isTransitioning ? "animate-new-slide-down" : ""
                  }`}
                  style={{
                    animationDelay: isTransitioning ? `${delayMs}ms` : "0ms",
                  }}
                >
                  <Image
                    src={newImgSrc}
                    alt={`Mobile banner image ${imgIndex + 1}`}
                    fill
                    priority={imgIndex === 0}
                    className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 group-hover:from-black/10 group-hover:to-black/40 transition-colors duration-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Large Script Text Overlay Across Center */}
        <div
          key={`title-${slideKey}`}
          className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center ${
            isTransitioning ? "animate-text-fade-up" : ""
          }`}
          style={{ animationDelay: "420ms" }}
        >
          {activeSlide.title && (
            <h2 className="font-script text-white text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-wider leading-none select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.75)]">
              {activeSlide.title}
            </h2>
          )}
          {activeSlide.subtitle && (
            <p className="mt-2 text-xs sm:text-sm md:text-base font-light tracking-[0.25em] sm:tracking-[0.35em] uppercase text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] px-2">
              {activeSlide.subtitle}
            </p>
          )}
        </div>

        {/* Left Arrow Navigation */}
        {slides.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 transform active:scale-90 hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8 sm:w-12 sm:h-12 stroke-[1.5]" />
          </button>
        )}

        {/* Right Arrow Navigation */}
        {slides.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 transform active:scale-90 hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] cursor-pointer"
          >
            <ChevronRight className="w-8 h-8 sm:w-12 sm:h-12 stroke-[1.5]" />
          </button>
        )}

      </div>
    </section>
  );
}
