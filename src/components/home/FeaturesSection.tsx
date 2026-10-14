"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const IconAdvancedTechnology = ({
  className = "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Central Precision Scanner Chip */}
    <rect x="20" y="20" width="24" height="24" rx="4" />
    {/* Micro-processor Core */}
    <rect x="27" y="27" width="10" height="10" rx="2" />
    <circle cx="32" cy="32" r="2" fill="currentColor" />
    {/* Tech Pins / Laser Pulse Guides */}
    <path d="M32 10 V20" />
    <path d="M32 44 V54" />
    <path d="M10 32 H20" />
    <path d="M44 32 H54" />
    {/* Diagonal Sensors */}
    <path d="M16 16 L22 22" />
    <path d="M42 42 L48 48" />
    <path d="M48 16 L42 22" />
    <path d="M22 42 L16 48" />
    {/* Outer Tech Sparkles */}
    <circle cx="32" cy="6" r="1.5" fill="currentColor" />
    <circle cx="58" cy="32" r="1.5" fill="currentColor" />
    <circle cx="32" cy="58" r="1.5" fill="currentColor" />
    <circle cx="6" cy="32" r="1.5" fill="currentColor" />
  </svg>
);

const IconPersonalizedCare = ({
  className = "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Heart Motif with Tailored Care Sparkle */}
    <path d="M32 48 C 23 41, 14 34, 14 24 C 14 17, 19 13, 25 13 C 29 13, 31 15, 32 18 C 33 15, 35 13, 39 13 C 45 13, 50 17, 50 24 C 50 34, 41 41, 32 48 Z" />
    {/* Caring spark / bespoke goal star */}
    <path d="M32 23 V 33 M 27 28 H 37" strokeWidth="1.4" />
    {/* Radiance Accent Orbs */}
    <circle cx="21" cy="20" r="1.5" fill="currentColor" />
    <circle cx="43" cy="20" r="1.5" fill="currentColor" />
    <path d="M12 48 C 18 42, 26 40, 32 43" />
    <path d="M52 48 C 46 42, 38 40, 32 43" />
  </svg>
);

const IconClinicalEnvironment = ({
  className = "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Clinical Shield Contour */}
    <path d="M32 10 L 50 16 V 32 C 50 44, 32 54, 32 54 C 32 54, 14 44, 14 32 V 16 L 32 10 Z" />
    {/* Aesthetic Medical Cross */}
    <path d="M32 22 V 38" strokeWidth="2" />
    <path d="M24 30 H 40" strokeWidth="2" />
    {/* Hygiene & Serenity Sparkles */}
    <circle cx="32" cy="18" r="1.5" fill="currentColor" />
    <circle cx="44" cy="24" r="1.5" fill="currentColor" />
    <circle cx="20" cy="24" r="1.5" fill="currentColor" />
  </svg>
);

const IconSkinRejuvenation = ({
  className = "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Pure Hydration Water Droplet */}
    <path d="M32 10 C 32 10, 16 30, 16 40 C 16 48.8, 23.2 56, 32 56 C 40.8 56, 48 48.8, 48 40 C 48 30, 32 10, 32 10 Z" />
    {/* Inner Rejuvenation Layer */}
    <path d="M26 34 C 26 29, 32 20, 32 20 C 32 20, 38 29, 38 34 C 38 38, 35 41, 32 41 C 29 41, 26 38, 26 34 Z" />
    {/* Radiant Renewal Sparkles */}
    <path d="M52 14 L 54 18 L 58 20 L 54 22 L 52 26 L 50 22 L 46 20 L 50 18 Z" fill="currentColor" stroke="none" />
    <circle cx="14" cy="20" r="2" fill="currentColor" />
    <circle cx="10" cy="26" r="1.2" fill="currentColor" />
  </svg>
);

const IconLaserLight = ({
  className = "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Laser Emitter Device Wand */}
    <rect x="12" y="38" width="14" height="14" rx="3" transform="rotate(-45 19 45)" strokeWidth="1.8" />
    <path d="M24 35 L 36 23" strokeWidth="2" />
    {/* Emitter Tip */}
    <path d="M34 21 L 40 15" strokeWidth="2.2" />
    {/* Focused Laser Rays */}
    <path d="M42 13 L 56 7" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M45 18 L 59 18" strokeWidth="1.6" />
    <path d="M43 23 L 55 31" strokeWidth="1.6" />
    {/* Light Therapy Burst Sparkle */}
    <path d="M48 38 L 50 42 L 54 44 L 50 46 L 48 50 L 46 46 L 42 44 L 46 42 Z" fill="currentColor" stroke="none" />
    <circle cx="36" cy="48" r="1.5" fill="currentColor" />
    <circle cx="26" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

const IconHairScalp = ({
  className = "w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Scalp Surface Layer */}
    <path d="M12 46 C 24 42, 40 42, 52 46" strokeWidth="2" />
    {/* Hair Follicle Roots */}
    <path d="M22 45 V 53 C 22 56, 26 56, 26 53 V 44" />
    <path d="M32 44 V 54 C 32 57, 36 57, 36 54 V 43" />
    <path d="M42 45 V 53 C 42 56, 46 56, 46 53 V 44" />
    {/* Silky Flowing Hair Strands */}
    <path d="M24 43 C 24 30, 16 22, 20 10" strokeWidth="1.8" />
    <path d="M32 43 C 32 28, 30 18, 34 8" strokeWidth="2" />
    <path d="M40 43 C 40 30, 48 22, 44 10" strokeWidth="1.8" />
    {/* Spa Droplets & Radiance */}
    <circle cx="28" cy="16" r="2" fill="currentColor" />
    <circle cx="38" cy="22" r="1.5" fill="currentColor" />
    <path d="M50 16 L 51.5 19 L 54.5 20.5 L 51.5 22 L 50 25 L 48.5 22 L 45.5 20.5 L 48.5 19 Z" fill="currentColor" stroke="none" />
  </svg>
);

export interface FeatureCardItem {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "dark" | "light";
}

const FEATURE_CARDS: FeatureCardItem[] = [
  {
    id: "advanced-technology",
    subtitle: "Advanced Aesthetics",
    title: "ADVANCED TECHNOLOGY",
    description:
      "Modern aesthetic technologies designed to support targeted skin and scalp treatments.",
    icon: <IconAdvancedTechnology />,
    variant: "dark",
  },
  {
    id: "personalized-care",
    subtitle: "Tailored Approach",
    title: "PERSONALIZED CARE",
    description:
      "Treatment approaches tailored to individual skin, hair and aesthetic goals.",
    icon: <IconPersonalizedCare />,
    variant: "light",
  },
  {
    id: "clinical-environment",
    subtitle: "Professional Setting",
    title: "CLINICAL ENVIRONMENT",
    description:
      "A calm, professional setting designed around comfort, hygiene and focused treatment.",
    icon: <IconClinicalEnvironment />,
    variant: "dark",
  },
  {
    id: "skin-rejuvenation",
    subtitle: "Advanced Skin Care",
    title: "SKIN REJUVENATION",
    description:
      "Advanced treatments focused on hydration, texture, clarity, radiance and skin renewal.",
    icon: <IconSkinRejuvenation />,
    variant: "light",
  },
  {
    id: "laser-light",
    subtitle: "Targeted Treatments",
    title: "LASER & LIGHT",
    description:
      "Laser and light-based treatments including carbon laser, laser hair reduction and LED therapy.",
    icon: <IconLaserLight />,
    variant: "dark",
  },
  {
    id: "hair-scalp",
    subtitle: "Scalp & Hair Care",
    title: "HAIR & SCALP CARE",
    description:
      "Specialised treatments including Korean Hair Spa, mesotherapy and advanced scalp therapies.",
    icon: <IconHairScalp />,
    variant: "light",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-[#f7f1eb] py-8 sm:py-12 md:py-16 px-3.5 sm:px-8 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Swiper Header with Subtitle & Navigation Controls */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="font-script text-3xl sm:text-5xl text-[#cfbf9d] tracking-wide mb-1 select-none">
              Why Choose Us
            </span>
          </div>

          {/* Swiper Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="features-swiper-prev w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#3c3530]/20 bg-white/80 hover:bg-[#3c3530] hover:text-white text-[#3c3530] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            <button
              className="features-swiper-next w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#3c3530]/20 bg-white/80 hover:bg-[#3c3530] hover:text-white text-[#3c3530] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40"
              aria-label="Next feature"
            >
              <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>
        </div>

        {/* Swiper.js Carousel: 2 items per view on mobile, 3 on desktop */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={2}
          spaceBetween={12}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          navigation={{
            prevEl: ".features-swiper-prev",
            nextEl: ".features-swiper-next",
          }}
          pagination={{
            clickable: true,
            el: ".features-swiper-pagination",
          }}
          className="w-full !pb-2"
        >
          {FEATURE_CARDS.map((card) => {
            return (
              <SwiperSlide key={card.id} className="!h-auto flex">
                <div className="group relative flex flex-col justify-between p-3.5 sm:p-7 md:p-8 lg:p-10 min-h-[210px] sm:min-h-[280px] md:min-h-[340px] w-full h-full bg-white text-[#3c3530] border-none shadow-[0_4px_20px_rgba(74,65,58,0.03)] sm:shadow-[0_8px_30px_rgba(74,65,58,0.04)] hover:shadow-[0_12px_40px_rgba(74,65,58,0.08)] transition-all duration-500 hover:-translate-y-1.5">
                  {/* Top Section: Subtitle (Left) & Icon (Right) */}
                  <div className="flex items-start justify-between w-full mb-3 sm:mb-6 md:mb-8">
                    <span className="font-sans text-[10px] sm:text-xs md:text-sm tracking-wider font-light text-[#3c3530]/75 line-clamp-1 pr-1">
                      {card.subtitle}
                    </span>

                    <div className="text-[#3c3530] shrink-0 ml-1.5 transform transition-transform duration-500 group-hover:scale-110">
                      {card.icon}
                    </div>
                  </div>

                  {/* Middle Section: Main Uppercase Title */}
                  <div className="my-auto">
                    <h3 className="font-belleza text-sm sm:text-2xl md:text-3xl lg:text-3.5xl font-normal uppercase tracking-[0.06em] sm:tracking-[0.12em] leading-snug sm:leading-tight text-[#3c3530]">
                      {card.title}
                    </h3>
                  </div>

                  {/* Bottom Section: Divider Line & Description Text */}
                  <div className="mt-3.5 sm:mt-8 pt-2.5 sm:pt-5 border-t border-[#3c3530]/15">
                    <p className="text-[11px] sm:text-xs md:text-sm font-light leading-relaxed text-[#3c3530]/80">
                      {card.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Luxury Pagination Dots */}
        <div className="features-swiper-pagination flex items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-8 [&_.swiper-pagination-bullet]:w-1.5 sm:[&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-[#3c3530]/25 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-500 [&_.swiper-pagination-bullet-active]:w-7 sm:[&_.swiper-pagination-bullet-active]:w-8 [&_.swiper-pagination-bullet-active]:bg-[#3c3530] [&_.swiper-pagination-bullet]:cursor-pointer" />
      </div>
    </section>
  );
}
