"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowUp,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Play,
  Film,
  Camera,
} from "lucide-react";
import { GalleryItem } from "@/types/gallery";
import SocialIcon, { getPlatformDisplayName } from "@/components/common/SocialIcon";
import { getSocialEmbedInfo } from "@/lib/socialEmbed";

export default function GalleryGridSection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tab switch: "photos" | "reels"
  const [activeTab, setActiveTab] = useState<"photos" | "reels">("photos");

  // Category filter strictly for photos
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState<string>("all");
  const [visiblePhotoCount, setVisiblePhotoCount] = useState<number>(12);
  const [visibleReelCount, setVisibleReelCount] = useState<number>(8);

  // Lightbox & scroll states
  const [lightboxList, setLightboxList] = useState<GalleryItem[]>([]);
  const [selectedLightboxIndex, setSelectedLightboxIndex] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Fetch gallery images from API
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Separate Data: Photos vs Reels ─────────────────────────────────────────
  const allReels = useMemo(() => {
    return galleryItems.filter((i) => Boolean(i.socialUrl || i.isSocialPost));
  }, [galleryItems]);

  const allPhotos = useMemo(() => {
    return galleryItems.filter((i) => !i.socialUrl && !i.isSocialPost);
  }, [galleryItems]);

  // Categories extracted strictly from photos
  const photoCategories = useMemo(() => {
    const cats = new Set<string>();
    allPhotos.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [allPhotos]);

  // Filtered photos based on selected category
  const filteredPhotos = useMemo(() => {
    if (photoCategoryFilter === "all") return allPhotos;
    return allPhotos.filter(
      (i) => i.category?.toLowerCase() === photoCategoryFilter.toLowerCase()
    );
  }, [allPhotos, photoCategoryFilter]);

  const visiblePhotos = filteredPhotos.slice(0, visiblePhotoCount);
  const hasMorePhotos = visiblePhotoCount < filteredPhotos.length;

  const visibleReels = allReels.slice(0, visibleReelCount);
  const hasMoreReels = visibleReelCount < allReels.length;

  // ── Lightbox Helpers (Photos) ─────────────────────────────────────────────
  const openPhotoLightbox = (index: number) => {
    setLightboxList(filteredPhotos);
    setSelectedLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setSelectedLightboxIndex(null);
  }, []);

  const prevLightboxImage = useCallback(() => {
    setSelectedLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? lightboxList.length - 1 : prev - 1;
    });
  }, [lightboxList.length]);

  const nextLightboxImage = useCallback(() => {
    setSelectedLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === lightboxList.length - 1 ? 0 : prev + 1;
    });
  }, [lightboxList.length]);

  // Lock body scroll & background interaction when modal is open
  useEffect(() => {
    if (selectedLightboxIndex !== null) {
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
  }, [selectedLightboxIndex]);

  // Keyboard navigation (Arrow keys & Escape)
  useEffect(() => {
    if (selectedLightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightboxImage();
      if (e.key === "ArrowRight") nextLightboxImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLightboxIndex, closeLightbox, prevLightboxImage, nextLightboxImage]);

  // Touch gesture support for mobile swiping in modal
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

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 40) {
        nextLightboxImage();
      } else if (diffX < -40) {
        prevLightboxImage();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // ── Dedicated Component for Responsive Instagram Reel Embed Card ───────────
  const ReelEmbedCard = ({ item, index }: { item: GalleryItem; index: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [frameHeight, setFrameHeight] = useState<number | null>(null);
    const embed = getSocialEmbedInfo(item.socialUrl);
    const hasEmbed = Boolean(embed && embed.embedUrl);

    useEffect(() => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const updateSize = () => {
        const width = el.clientWidth;
        if (width > 0) {
          // Instagram embed header takes ~50-52px.
          // Reel media thumbnail has 4:5 aspect ratio (1.25 * width).
          // Setting the wrapper height to Math.floor(width * 1.25 + 46) makes the
          // thumbnail fill cleanly to the bottom edge, while clipping
          // "View more on Instagram" and the like/comment/share icons across all screens.
          setFrameHeight(Math.floor(width * 1.25 + 46));
        }
      };

      updateSize();
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    return (
      <div
        key={item.id || index}
        className="w-full bg-white rounded-[22px] sm:rounded-[26px] overflow-hidden border border-gray-200/90 shadow-md hover:shadow-xl transition-all duration-300 p-2 sm:p-2.5 flex flex-col items-center"
      >
        {/* Reel Media Player / Embed */}
        {hasEmbed && embed.embedUrl ? (
          embed.type === "video" ? (
            <div
              ref={containerRef}
              style={frameHeight ? { height: `${frameHeight}px` } : { aspectRatio: "4 / 5.6" }}
              className="w-full rounded-[18px] bg-black overflow-hidden flex items-center justify-center shrink-0"
            >
              <video
                src={embed.embedUrl}
                controls
                playsInline
                loop
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              ref={containerRef}
              style={frameHeight ? { height: `${frameHeight}px` } : { aspectRatio: "4 / 5.6" }}
              className="w-full rounded-[18px] overflow-hidden bg-white relative shrink-0"
            >
              <iframe
                src={embed.embedUrl}
                title={item.title || `Instagram Reel ${index + 1}`}
                className="w-full h-[700px] rounded-[18px] bg-white border-0"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )
        ) : (
          <div className="w-full h-[430px] rounded-[18px] p-6 text-center text-gray-500 bg-stone-50 flex flex-col items-center justify-center border border-dashed border-gray-200 shrink-0">
            <SocialIcon
              platform={item.socialPlatform || "instagram"}
              className="w-12 h-12 text-[#8c6d36] mb-3"
            />
            <p className="text-sm font-poppins font-medium text-neutral-800 mb-3 line-clamp-2">
              {item.title}
            </p>
            <a
              href={item.socialUrl || "https://www.instagram.com/the_color_pallete"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8c6d36] hover:bg-[#735728] text-white rounded-full text-xs font-poppins font-semibold transition-colors shadow-sm"
            >
              <SocialIcon platform="instagram" className="w-3.5 h-3.5" />
              <span>View on Instagram</span>
              <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Caption Added by Admin */}
        {item.title && (
          <div className="w-full px-2.5 pt-3 pb-2 text-left">
            <p className="font-poppins text-xs sm:text-[13px] text-neutral-800 leading-relaxed font-normal">
              {item.title}
            </p>
          </div>
        )}
      </div>
    );
  };

  // ── Render Individual Photo Card (Square 1:1 Aspect Ratio) ─────────────────
  const renderPhotoCard = (item: GalleryItem, index: number) => {
    return (
      <div
        key={item.id || index}
        onClick={() => openPhotoLightbox(index)}
        className="group relative w-full aspect-square bg-neutral-100 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500"
      >
        <Image
          src={item.src}
          alt={item.alt || item.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover Dark Overlay & Title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-6 text-white">
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
    );
  };

  const activeLightboxItem =
    selectedLightboxIndex !== null ? lightboxList[selectedLightboxIndex] : null;

  return (
    <section className="w-full bg-white/50 text-black py-10 sm:py-16 px-3 sm:px-8 md:px-12 lg:px-16 relative">
      <div className="max-w-[1360px] mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full aspect-square bg-neutral-200/60 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        )}

        {/* ─── PRIMARY TAB SWITCHER: Switch between Photos and Reels ─── */}
        {!loading && (
          <div className="flex items-center justify-center mb-10 sm:mb-14">
            <div className="inline-flex items-center p-1.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 shadow-xs backdrop-blur-md">
              {/* Photos Tab */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("photos");
                }}
                className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-poppins font-medium uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer ${
                  activeTab === "photos"
                    ? "bg-neutral-900 text-white shadow-md scale-102"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Photos</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    activeTab === "photos"
                      ? "bg-white/20 text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {allPhotos.length}
                </span>
              </button>

              {/* Reels Tab */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("reels");
                }}
                className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-poppins font-medium uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer ${
                  activeTab === "reels"
                    ? "bg-gradient-to-r from-[#8c6d36] to-[#c2a878] text-neutral-950 font-semibold shadow-md scale-102"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Reels</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "reels"
                      ? "bg-neutral-950/20 text-neutral-950"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {allReels.length}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 1: PHOTOS ─── */}
        {!loading && activeTab === "photos" && (
          <div>
            {/* Photo Specialty Category Filter Pills */}
            {photoCategories.length > 0 && (
              <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-8 sm:mb-12">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoCategoryFilter("all");
                    setVisiblePhotoCount(12);
                  }}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-belleza transition-all cursor-pointer ${
                    photoCategoryFilter === "all"
                      ? "bg-neutral-900 text-white shadow-md scale-105"
                      : "bg-white/80 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/60"
                  }`}
                >
                  All Photos
                </button>

                {photoCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setPhotoCategoryFilter(cat);
                      setVisiblePhotoCount(12);
                    }}
                    className={`px-4 sm:px-6 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-belleza transition-all cursor-pointer ${
                      photoCategoryFilter.toLowerCase() === cat.toLowerCase()
                        ? "bg-neutral-900 text-white shadow-md scale-105"
                        : "bg-white/80 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Photos Grid: 1:1 Square Grid */}
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
                {visiblePhotos.map((item, index) => renderPhotoCard(item, index))}
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-400 font-poppins text-sm">
                No photos available in this category.
              </div>
            )}

            {/* Load More Photos */}
            {hasMorePhotos && (
              <div className="w-full flex justify-center mt-6 sm:mt-8 mb-4">
                <button
                  type="button"
                  onClick={() => setVisiblePhotoCount((prev) => prev + 12)}
                  className="font-belleza px-8 sm:px-10 py-3 sm:py-4 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium transition-colors duration-300 cursor-pointer shadow-sm hover:shadow-md"
                >
                  LOAD MORE PHOTOS
                </button>
              </div>
            )}

            {!hasMorePhotos && filteredPhotos.length > 12 && (
              <div className="w-full text-center mt-6 sm:mt-8 mb-4">
                <span className="font-belleza text-xs uppercase tracking-[0.25em] text-neutral-400">
                  ALL PHOTOS DISPLAYED
                </span>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB CONTENT 2: REELS ─── */}
        {!loading && activeTab === "reels" && (
          <div>
            {/* Header matching the reference: "INSTAGRAM FEED" + "Follow Us On Instagram" + "Follow @the_color_palette_aesthetics" */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 border-b border-neutral-200/80 pb-6 max-w-6xl mx-auto">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-0.5 bg-[#8c6d36]" />
                  <span className="text-[11px] font-poppins font-semibold uppercase tracking-[0.2em] text-[#8c6d36] flex items-center gap-1.5">
                    Instagram Feed
                    <SocialIcon platform="instagram" className="w-3.5 h-3.5 text-[#e1306c]" />
                  </span>
                </div>
                <h2 className="font-belleza text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-neutral-900">
                  Follow Us On <span className="text-[#8c6d36]">Instagram</span>
                </h2>
              </div>

              <a
                href="https://www.instagram.com/the_color_pallete"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start md:self-auto px-6 py-2.5 rounded-full border-2 border-[#8c6d36] text-[#8c6d36] hover:bg-[#8c6d36] hover:text-white text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <SocialIcon
                  platform="instagram"
                  className="w-4 h-4 text-[#e1306c] group-hover:text-white transition-colors"
                />
                <span>Follow @the_color_pallete</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </a>
            </div>

            {allReels.length > 0 ? (
              <>
                {/* Reels Grid (3 Columns on Desktop, White Rounded Cards, Direct Embeds) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16">
                  {visibleReels.map((item, index) => (
                    <ReelEmbedCard key={item.id || index} item={item} index={index} />
                  ))}
                </div>

                {/* Load More Reels */}
                {hasMoreReels && (
                  <div className="w-full flex justify-center mt-8 mb-4">
                    <button
                      type="button"
                      onClick={() => setVisibleReelCount((prev) => prev + 8)}
                      className="font-belleza px-8 py-3 rounded-full border border-neutral-800 text-neutral-800 hover:bg-neutral-900 hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      Load More Reels
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl bg-[#c2a878]/15 text-[#8c6d36] flex items-center justify-center mx-auto mb-3">
                  <Film className="w-7 h-7" />
                </div>
                <h3 className="font-belleza text-xl uppercase tracking-wider text-neutral-800 mb-1">
                  No Reels Uploaded Yet
                </h3>
                <p className="font-poppins text-xs text-neutral-500 max-w-sm mx-auto">
                  Instagram and video reels will appear here once added in the admin dashboard.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Scroll To Top Button (hidden while modal is open) */}
      {showScrollTop && selectedLightboxIndex === null && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 p-2.5 sm:p-3 bg-neutral-900/90 text-white hover:bg-neutral-900 border border-neutral-700 shadow-xl transition-all duration-300 group cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="transform group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Lightbox Modal: Portaled directly into document.body */}
      {typeof document !== "undefined" &&
        selectedLightboxIndex !== null &&
        activeLightboxItem &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image detail view"
            className="fixed inset-0 z-[99999] w-screen h-[100dvh] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none touch-none overscroll-none"
            onClick={closeLightbox}
          >
            {/* Top Bar: Counter, Category Badge, Video/Photo Toggle, Close Button */}
            <header
              className="w-full flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Item counter & Category pill */}
              <div className="flex items-center gap-2">
                <span className="font-poppins text-xs sm:text-sm font-medium text-white/90 bg-white/10 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-full border border-white/10">
                  {selectedLightboxIndex + 1} / {lightboxList.length}
                </span>
                {activeLightboxItem.category && (
                  <span className="hidden xs:inline-block text-[11px] sm:text-xs uppercase tracking-widest text-[#dfcca5] bg-[#dfcca5]/10 px-3 py-1.5 rounded-full border border-[#dfcca5]/20 font-medium">
                    {activeLightboxItem.category}
                  </span>
                )}
              </div>

              {/* Reel Platform indicator in header for reels */}
              {(() => {
                const isReel = Boolean(
                  activeLightboxItem.socialUrl || activeLightboxItem.isSocialPost
                );
                if (!isReel) return <div />;
                return (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#dfcca5] text-xs font-poppins">
                    <Film className="w-3.5 h-3.5" />
                    <span className="uppercase tracking-wider font-medium">
                      {getPlatformDisplayName(activeLightboxItem.socialPlatform)} Reel
                    </span>
                  </div>
                );
              })()}

              {/* Close button with large touch target */}
              <button
                type="button"
                onClick={closeLightbox}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white/90 hover:text-white rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all cursor-pointer border border-white/10"
                aria-label="Close modal"
              >
                <X size={20} className="sm:w-5 sm:h-5" />
              </button>
            </header>

            {/* Main Content Area (Media with touch swipe + Desktop side chevrons) */}
            <div
              className="flex-1 relative w-full flex items-center justify-center px-3 sm:px-16 md:px-24 py-2 overflow-hidden min-h-0"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Desktop Prev Button */}
              <button
                type="button"
                onClick={prevLightboxImage}
                className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 border border-white/20 text-white items-center justify-center shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Responsive Centered Media Container */}
              {(() => {
                const isReel = Boolean(
                  activeLightboxItem.socialUrl || activeLightboxItem.isSocialPost
                );
                const embed = isReel ? getSocialEmbedInfo(activeLightboxItem.socialUrl, { autoplay: true }) : null;

                if (isReel) {
                  if (embed && embed.embedUrl) {
                    const embedUrl = embed.embedUrl;
                    return (
                      <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[75vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15 flex items-center justify-center">
                        {embed.type === "video" ? (
                          <video
                            src={embedUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain bg-black"
                          />
                        ) : (
                          <iframe
                            src={embedUrl}
                            title={activeLightboxItem.title}
                            className="w-full h-full border-0 bg-black"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            scrolling="no"
                          />
                        )}
                      </div>
                    );
                  }

                  return (
                    <div className="relative w-full max-w-md p-6 bg-neutral-900 border border-neutral-700 rounded-2xl text-center text-white flex flex-col items-center">
                      <Film className="w-12 h-12 text-[#dfcca5] mb-3" />
                      <h3 className="font-belleza text-lg uppercase tracking-wider mb-2">
                        {activeLightboxItem.title}
                      </h3>
                      {activeLightboxItem.socialUrl && (
                        <a
                          href={activeLightboxItem.socialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#dfcca5] text-neutral-950 text-xs font-poppins font-semibold uppercase tracking-wider"
                        >
                          <span>Open On {getPlatformDisplayName(activeLightboxItem.socialPlatform)}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
                    <Image
                      key={activeLightboxItem.src}
                      src={activeLightboxItem.src}
                      alt={activeLightboxItem.alt || activeLightboxItem.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 85vw"
                      className="object-contain object-center drop-shadow-2xl transition-opacity duration-300"
                    />
                  </div>
                );
              })()}

              {/* Desktop Next Button */}
              <button
                type="button"
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
              {activeLightboxItem.category && (
                <span className="xs:hidden text-[11px] uppercase tracking-widest text-[#dfcca5] font-medium mb-1">
                  {activeLightboxItem.category}
                </span>
              )}

              {/* Title */}
              <h4 className="font-belleza text-base sm:text-xl lg:text-2xl text-white font-light uppercase tracking-wider max-w-xl truncate sm:whitespace-normal">
                {activeLightboxItem.title}
              </h4>

              {/* View Reel Button in Lightbox if social URL exists */}
              {activeLightboxItem.socialUrl && (
                <a
                  href={activeLightboxItem.socialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full bg-gradient-to-r from-[#dfcca5] to-[#c2a878] hover:from-[#c2a878] hover:to-[#a88d58] text-neutral-950 text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-xl active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    Watch on {getPlatformDisplayName(activeLightboxItem.socialPlatform)}
                  </span>
                  <ExternalLink size={13} className="opacity-80" />
                </a>
              )}

              {/* Mobile Touch Navigation Controls */}
              <div className="flex sm:hidden items-center justify-center gap-3 mt-3 w-full max-w-xs">
                <button
                  type="button"
                  onClick={prevLightboxImage}
                  className="flex-1 py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-poppins flex items-center justify-center gap-1.5 transition-all border border-white/10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={nextLightboxImage}
                  className="flex-1 py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-poppins flex items-center justify-center gap-1.5 transition-all border border-white/10"
                  aria-label="Next image"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Swipe gesture hint on mobile */}
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
