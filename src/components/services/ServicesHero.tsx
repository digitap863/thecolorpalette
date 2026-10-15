"use client";

import React from "react";
import Image from "next/image";

interface ServicesHeroProps {
  onExploreClick?: () => void;
}

export default function ServicesHero({ onExploreClick }: ServicesHeroProps) {
  return (
    <section className="relative w-full h-[100vh] min-h-[450px] max-h-[750px] overflow-hidden bg-[#1e2617]">
      {/* Background Image - Desktop */}
      <Image
        src="/Banner/banner.png"
        alt="Our Services - Tailored to You"
        fill
        priority
        className="hidden md:block object-cover object-center transform scale-105 transition-transform duration-1000"
        sizes="100vw"
      />

      {/* Background Image - Mobile */}
      <Image
        src="/Banner/banner_mob.png"
        alt="Our Services - Tailored to You"
        fill
        priority
        className="block md:hidden object-cover object-center transform scale-105 transition-transform duration-1000"
        sizes="100vw"
      />

      {/* Elegant Dark Vignette Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 pointer-events-none" />

      {/* Centered Text Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Script Subtitle */}
        <span className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#dfcca5] tracking-wide mb-2 select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          Our Services
        </span>

        {/* Belleza Main Title */}
        <h1 className="font-belleza text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light uppercase tracking-[0.15em] text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.8)]">
          Tailored to You
        </h1>

        {/* Decorative subtle underline divider */}
        <div className="mt-4 w-16 sm:w-24 h-[1px] bg-[#dfcca5]/60" />
      </div>
    </section>
  );
}
