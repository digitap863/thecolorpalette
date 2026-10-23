"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import TypewriterText from "@/components/common/TypewriterText";

export interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    quote: "Soft lighting, calming music, and expert service made my appointment peaceful and memorable from start to finish.",
    name: "SAMANTA FOX",
    role: "CUSTOMER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    quote: "The bridal makeup experience at The Color Palette was nothing short of magical. Every detail was crafted with pure elegance.",
    name: "ANNA SHERMAN",
    role: "BRIDAL CLIENT",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    quote: "Their skin aesthetic & facial treatments left my skin glowing for weeks. The salon atmosphere is truly a serene escape.",
    name: "PRIYA SHARMA",
    role: "REGULAR CLIENT",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop",
    rating: 5,
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeTestimonial = DEFAULT_TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="w-full bg-[#f7f1eb] text-[#1e2617] pt-6 pb-6 sm:pt-8 sm:pb-8 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left Column: Large Arch Shaped Framed Salon Image */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-t-full overflow-hidden border border-[#1e2617]/10 shadow-xl group">
            <Image
              src="/images/testimonials.webp"
              alt="The Color Palette Salon Interior & Stylists"
              fill
              className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e2617]/20 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Customer Testimonial Content */}
        <div className="lg:col-span-6 flex flex-col items-start text-left w-full">

          {/* Cursive Subtitle */}
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 select-none">
            customers
          </span>

          {/* Main Headline with Writing Animation */}
          <TypewriterText
            text="LOVELY CUSTOMERS."
            as="h2"
            className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight mb-6"
            cursorColor="#dfcca5"
          />

          {/* 5 Gold Stars Rating */}
          <div className="flex items-center gap-1.5 mb-8">
            {Array.from({ length: activeTestimonial.rating }).map((_, idx) => (
              <Star
                key={idx}
                className="w-5 h-5 text-[#dfcca5] fill-[#dfcca5]"
              />
            ))}
          </div>

          {/* Testimonial Quote */}
          <p className="text-[#1e2617]/85 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl min-h-[90px] transition-opacity duration-300">
            &ldquo;{activeTestimonial.quote}&rdquo;
          </p>

          {/* Horizontal Divider Line */}
          <div className="w-full border-b border-[#1e2617]/20 my-8" />

          {/* Bottom Bar: Customer Profile & Carousel Dots */}
          <div className="w-full flex items-center justify-between">

            {/* Customer Avatar & Info */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <div className="relative w-full h-full rounded-full overflow-hidden border border-[#1e2617]/20 shadow-md">
                  <Image
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    fill
                    className="object-cover object-center"
                    sizes="60px"
                  />
                </div>

                {/* Floating Quote Badge on top right of avatar */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#dfcca5] text-[#1e2617] rounded-full flex items-center justify-center shadow-xs">
                  <Quote className="w-3 h-3 fill-current rotate-180" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-belleza text-base sm:text-lg uppercase tracking-wider text-[#1e2617] font-medium">
                  {activeTestimonial.name}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#1e2617]/60 font-light">
                  {activeTestimonial.role}
                </span>
              </div>
            </div>

            {/* Carousel Dot Indicators */}
            <div className="flex items-center gap-3 select-none">
              {DEFAULT_TESTIMONIALS.map((item, index) => {
                const isActive = index === currentIndex;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`transition-all duration-300 cursor-pointer flex items-center justify-center ${isActive
                      ? "w-6 h-6 rounded-full border border-[#dfcca5]"
                      : "w-3 h-3"
                      }`}
                  >
                    <span
                      className={`rounded-full transition-all duration-300 ${isActive
                        ? "w-2 h-2 bg-[#dfcca5]"
                        : "w-2 h-2 bg-[#1e2617]/30 hover:bg-[#1e2617]/60"
                        }`}
                    />
                  </button>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
