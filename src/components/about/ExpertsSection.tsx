"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface ExpertiseItem {
  number: string;
  title: string;
  description: string;
}

const FOUNDER_PROFILE = {
  id: "safa-rastham-khan",
  name: "Safa Rastham Khan",
  role: "FOUNDER & AESTHETIC PROFESSIONAL",
  bio: "Bringing together advanced aesthetic technology, personalised care, and a refined treatment experience across skin, hair, and aesthetic wellness.",
  supportingText:
    "Creating a thoughtful approach to aesthetic care where modern technology meets personalised attention.",
  image: "/about/safa.png",
};

const EXPERTISE_POINTS: ExpertiseItem[] = [
  {
    number: "01",
    title: "ADVANCED AESTHETICS",
    description: "Modern treatment approaches focused on individual needs.",
  },
  {
    number: "02",
    title: "PERSONALISED CARE",
    description: "Thoughtful treatment experiences designed around each client.",
  },
  {
    number: "03",
    title: "SKIN, HAIR & SCALP",
    description: "A comprehensive approach across aesthetic and wellness care.",
  },
];

export default function ExpertsSection() {
  return (
    <section className="w-full bg-[#f7f1eb] text-[#1e2617] py-25 sm:py-20 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: Large Editorial Portrait of Safa Rastham Khan (45% Split / 5 cols) */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[28px] overflow-hidden border border-[#1e2617]/10 shadow-[0_12px_40px_rgba(30,38,23,0.06)] group">
            <Image
              src={FOUNDER_PROFILE.image}
              alt={FOUNDER_PROFILE.name}
              fill
              className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
            {/* Soft luxury vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e2617]/15 pointer-events-none" />
          </div>
        </div>

        {/* RIGHT COLUMN: Founder Vision Content Area (55% Split / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
          
          {/* Eyebrow */}
          <span className="font-poppins text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-[#c2a878] mb-3 block">
            THE VISION BEHIND THE COLOR PALLETE
          </span>

          {/* Large Serif Heading (No decorative script) */}
          <h2 className="font-belleza text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight mb-2">
            Meet {FOUNDER_PROFILE.name}
          </h2>

          {/* Role in uppercase gold */}
          <span className="font-poppins text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#c2a878] mb-6 block">
            {FOUNDER_PROFILE.role}
          </span>

          {/* Bio Paragraph & Supporting Statement */}
          <div className="space-y-4 font-poppins text-sm sm:text-base font-light leading-relaxed text-[#1e2617]/85 mb-8 max-w-xl">
            <p>{FOUNDER_PROFILE.bio}</p>
            <p className="text-[#1e2617]/75 font-normal text-xs sm:text-sm border-l-2 border-[#c2a878] pl-3.5 py-0.5">
              {FOUNDER_PROFILE.supportingText}
            </p>
          </div>

          {/* Three Expertise Points with Thin Divider */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1e2617]/15 mb-10">
            {EXPERTISE_POINTS.map((item) => (
              <div key={item.number} className="flex flex-col items-start pr-2">
                <span className="font-poppins text-xs font-semibold text-[#c2a878] tracking-widest mb-2 block">
                  {item.number}
                </span>
                <h3 className="font-belleza text-sm sm:text-base font-medium uppercase tracking-wider text-[#1e2617] mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="font-poppins text-xs sm:text-sm font-light text-[#1e2617]/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/#services"
            className="font-belleza px-8 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 inline-block"
          >
            EXPLORE OUR APPROACH
          </Link>

        </div>

      </div>
    </section>
  );
}
