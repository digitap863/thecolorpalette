"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface VerticalVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  poster?: string;
}

const STATIC_VERTICAL_VIDEOS: VerticalVideoItem[] = [
  {
    id: "testimonial-7215",
    title: "Bridal Glow",
    videoUrl: "/Video/testimonials/IMG_7215.MP4",
  },
  {
    id: "testimonial-7218",
    title: "Glass Skin Therapy",
    videoUrl: "/Video/testimonials/IMG_7218.MP4",
  },
  {
    id: "testimonial-7229",
    title: "Hair & Scalp Spa",
    videoUrl: "/Video/testimonials/IMG_7229.MP4",
  },
  {
    id: "testimonial-7230",
    title: "Pre-Wedding Glow",
    videoUrl: "/Video/testimonials/IMG_7230.MP4",
  },
  {
    id: "testimonial-7236",
    title: "Skin Transformation",
    videoUrl: "/Video/testimonials/IMG_7236.MP4",
  },
  {
    id: "testimonial-7237",
    title: "Editorial Glamour",
    videoUrl: "/Video/testimonials/IMG_7237.MP4",
  },
  {
    id: "testimonial-7240",
    title: "Signature Makeover",
    videoUrl: "/Video/testimonials/IMG_7240.MP4",
  },
];

export default function VideoTestimonialsSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const togglePlay = (id: string) => {
    if (playingId === id) {
      const video = videoRefs.current[id];
      if (video) video.pause();
      setPlayingId(null);
    } else {
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]?.pause();
      }
      const targetVideo = videoRefs.current[id];
      if (targetVideo) {
        targetVideo
          .play()
          .then(() => setPlayingId(id))
          .catch(() => setPlayingId(id));
      } else {
        setPlayingId(id);
      }
    }
  };

  return (
    <section
      id="video-testimonials"
      className="w-full bg-[#f7f1eb] text-[#1e2617] py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Simple & Elegant Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div className="flex flex-col items-start text-left">
            <span className="font-script text-3xl sm:text-5xl text-[#cfbf9d] tracking-wide select-none">
              Client Stories
            </span>
            <h2 className="font-belleza text-2xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight">
              VIDEO TESTIMONIALS
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              className="video-swiper-prev w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#1e2617]/20 bg-white/80 hover:bg-[#1e2617] hover:text-[#f7f1eb] text-[#1e2617] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none group"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              className="video-swiper-next w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#1e2617]/20 bg-white/80 hover:bg-[#1e2617] hover:text-[#f7f1eb] text-[#1e2617] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none group"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Vertical Full Video Swiper (No Card Effect, Overlay Text Only) */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={1.3}
          spaceBetween={16}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: {
              slidesPerView: 1.8,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2.8,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          navigation={{
            prevEl: ".video-swiper-prev",
            nextEl: ".video-swiper-next",
          }}
          pagination={{
            clickable: true,
            el: ".video-swiper-pagination",
          }}
          className="w-full !pb-2"
        >
          {STATIC_VERTICAL_VIDEOS.map((item) => {
            const isPlaying = playingId === item.id;

            return (
              <SwiperSlide key={item.id} className="!h-auto flex">
                {/* Full Vertical Video Item - No Card Box, Aspect 9:16 */}
                <div
                  onClick={() => togglePlay(item.id)}
                  className="group relative w-full aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 cursor-pointer shadow-lg select-none transform transition-transform duration-500 hover:scale-[1.02]"
                >
                  {/* Full Background Video using files from public/Video/testimonials */}
                  <video
                    ref={(el) => {
                      videoRefs.current[item.id] = el;
                    }}
                    src={`${item.videoUrl}#t=0.001`}
                    poster={item.poster}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onEnded={() => setPlayingId(null)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dark Vignette Overlay for Crisp Over-Text Readability */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/20 pointer-events-none transition-opacity duration-300 ${
                      isPlaying ? "opacity-50 group-hover:opacity-75" : "opacity-75"
                    }`}
                  />

                  {/* Center Minimal Play/Pause Button */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
                      isPlaying
                        ? "opacity-0 group-hover:opacity-100"
                        : "opacity-100"
                    }`}
                  >
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-white stroke-none" />
                      ) : (
                        <Play className="w-6 h-6 fill-white stroke-none ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Top Right Audio Mute/Unmute Button (shows when playing) */}
                  {isPlaying && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-[#dfcca5] flex items-center justify-center transition-all duration-200 z-10 cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Over Text Only: Simple Single Title at the Bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pointer-events-none z-10">
                    <h3 className="font-belleza text-base sm:text-lg md:text-xl font-light uppercase tracking-wider text-white drop-shadow-md text-center">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Luxury Pagination Dots */}
        <div className="video-swiper-pagination flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 [&_.swiper-pagination-bullet]:w-2 sm:[&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2 sm:[&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-[#1e2617]/25 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-500 [&_.swiper-pagination-bullet-active]:w-7 sm:[&_.swiper-pagination-bullet-active]:w-9 [&_.swiper-pagination-bullet-active]:bg-[#1e2617] [&_.swiper-pagination-bullet]:cursor-pointer" />
      </div>
    </section>
  );
}
