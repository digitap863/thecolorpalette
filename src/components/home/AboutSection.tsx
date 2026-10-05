"use client";

import Image from "next/image";
import Link from "next/link";
import { Smartphone } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="w-full bg-[#f7f1eb] text-black py-20 sm:py-28 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Oval/Arch Framed Salon Image */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-full overflow-hidden border border-black/10 shadow-2xl group">
            <Image
              src="/images/spa.webp"
              alt="Colorpellet Salon Interior"
              fill
              className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Soft vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Content & Circular Badge */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          
          {/* Circular Badge Stamp */}
          <div className="relative w-36 h-36 mb-6 sm:mb-8 flex items-center justify-center select-none">
            {/* Rotating Outer Circular Text */}
            <div className="absolute inset-0 animate-[spin_22s_linear_infinite]">
              <svg className="w-full h-full text-black/90" viewBox="0 0 120 120">
                <path
                  id="textPath"
                  d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                  fill="none"
                />
                <text className="uppercase font-sans font-medium fill-current" style={{ fontSize: "8.5px", letterSpacing: "0.15em" }}>
                  <textPath href="#textPath" startOffset="0%">
                    ✦ HAIR &  SKIN CARE ✦ AESTHETIC ✦ BRIDAL MAKEUP 
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Inner Girl SVG Icon */}
            <div className="w-20 h-20 flex items-center justify-center pointer-events-none">
              <Image
                src="/images/girl.svg"
                alt="Girl Line Art"
                width={70}
                height={70}
                className="w-16 h-16 object-contain brightness-0"
                priority
              />
            </div>
          </div>

          {/* Script Subtitle */}
          <span className="font-script text-3xl sm:text-5xl text-[#cfbf9d] tracking-wide mb-1 select-none">
            about us
          </span>

          {/* Main Headline */}
          <h2 className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-black leading-tight mb-6">
            WELCOME TO<br />THE COLOR PALETTE
          </h2>

          {/* Paragraph Description */}
          <p className="text-black/80 text-sm sm:text-base font-light leading-relaxed max-w-lg mb-10">
            At The Color Pallete, we believe every bride deserves to feel
            confident and radiant, without falling prey to fleeting beauty
            trends that may not stand the test of time.
          </p>

          {/* Action Area: Outlined Button + Phone Badge */}
          <div className="flex flex-wrap items-center gap-8 sm:gap-10">
            {/* Outlined Button */}
            <Link
              href="#about"
              className="font-belleza px-6 py-3 border border-black/80 text-[#cfbf9d] hover:bg-[#dfcca5] hover:text-[#1e2617] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300"
            >
              More About Us
            </Link>

            {/* Phone Number Info */}
            <div className="flex items-center gap-3">
              <div className="p-2 border border-black/20 rounded-md text-black">
                <Smartphone size={22} strokeWidth={1.4} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-belleza text-[10px] uppercase tracking-[0.2em] text-black/60 font-medium">
                  Phone Number
                </span>
                <span className="text-sm font-light tracking-wide text-black">
                  +91 8547977486
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
