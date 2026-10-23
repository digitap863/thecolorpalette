"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import TypewriterText from "@/components/common/TypewriterText";

export interface StudioValuePoint {
  number: string;
  title: string;
  description: string;
}

const STUDIO_VALUES: StudioValuePoint[] = [
  {
    number: "01",
    title: "ADVANCED TECHNOLOGY",
    description: "Modern aesthetic treatments designed around individual needs.",
  },
  {
    number: "02",
    title: "PERSONALISED CARE",
    description: "A treatment approach guided by your concerns and goals.",
  },
  {
    number: "03",
    title: "PROFESSIONAL EXPERIENCE",
    description: "A calm environment focused on comfort and attentive care.",
  },
];

export default function AboutStudioSection() {
  return (
    <section className="w-full bg-[#f7f1eb] text-[#1e2617] py-15 sm:py-20 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* LEFT COLUMN: Large Portrait Clinical Aesthetic Image (45% Split / 5 cols) */}
        <div className="lg:col-span-5 flex justify-center w-full order-1">
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[24px] overflow-hidden border border-[#1e2617]/10 shadow-[0_12px_40px_rgba(30,38,23,0.06)] group">
            <Image
              src="/images/about_clinical_studio.webp"
              alt="The Color Pallete - Advanced Aesthetic Clinical Studio"
              fill
              className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
            {/* Subtle luxury vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e2617]/15 pointer-events-none" />
          </div>
        </div>

        {/* RIGHT COLUMN: Content Area (55% Split / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left w-full order-2">

          {/* Eyebrow */}
          <span className="font-poppins text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-[#c2a878] mb-4 block">
            ABOUT THE COLOR PALLETE
          </span>

          {/* Main Heading with Writing Animation */}
          <TypewriterText
            text="Where Luxury Meets Science"
            as="h2"
            className="font-belleza text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-[1.18] mb-6"
            cursorColor="#c2a878"
          />

          {/* Supporting Text */}
          <div className="space-y-4 font-poppins text-sm sm:text-base font-light leading-relaxed text-[#1e2617]/85 mb-10 max-w-2xl">
            <p>
              At The Color Pallete, we believe aesthetic care should be personal, thoughtful and purposeful.
            </p>
            <p>
              We bring together advanced aesthetic technology, professional expertise and personalised care to create treatment experiences designed around individual skin, hair and scalp needs.
            </p>
            <p>
              From advanced skin treatments and laser care to specialised hair and scalp therapies, every experience is approached with attention to detail, comfort and your individual goals.
            </p>
          </div>

          {/* Three Value Points Grid / Stack */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#1e2617]/15 mb-10">
            {STUDIO_VALUES.map((item) => (
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

          {/* Subtle CTA Button */}
          <Link
            href="/#services"
            className="font-belleza px-8 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 inline-block"
          >
            EXPLORE OUR TREATMENTS
          </Link>

        </div>

      </div>
    </section>
  );
}
