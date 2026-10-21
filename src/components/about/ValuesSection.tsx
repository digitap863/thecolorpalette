"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import TypewriterText from "@/components/common/TypewriterText";

export default function ValuesSection() {
  const values = [
    {
      number: "01",
      category: "Advanced Aesthetic Care",
      title: "Technology With Purpose",
      description:
        "We use advanced aesthetic technologies and treatment techniques designed to address individual skin, hair, and scalp concerns with precision.",
      link: "/about",
      variant: "light",
    },
    {
      number: "02",
      category: "Personalised Consultation",
      title: "Care Designed Around You",
      description:
        "Every treatment begins with understanding your concerns, goals, and needs so your experience is tailored rather than one-size-fits-all.",
      link: "/contact",
      variant: "dark",
      image: "/images/our_values.png",
    },
    {
      number: "03",
      category: "Professional Treatment Environment",
      title: "Clinical Care, Luxury Comfort",
      description:
        "Experience professional treatment in a calm, refined environment where comfort, hygiene, and attentive care come together.",
      link: "/#services",
      variant: "light",
    },
  ];

  return (
    <section className="w-full bg-white text-[#1e2617] py-20 sm:py-28 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section: Two Columns (Title Left, Description Right) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          
          {/* Left Column: Eyebrow + Dual Typography Headline */}
          <div className="flex flex-col items-start max-w-xl">
            <span className="font-poppins text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-[#c2a878] mb-3 block">
              OUR VALUES
            </span>
            <TypewriterText
              as="h2"
              className="w-full"
              cursorColor="#c2a878"
              lines={[
                {
                  text: "What Makes",
                  className: "font-belleza text-4xl sm:text-5xl lg:text-6xl font-light text-[#1e2617] leading-[1.15]",
                },
                {
                  text: "The Color Palette Different",
                  className: "font-script text-3xl sm:text-4xl lg:text-5xl text-[#1e2617] font-normal leading-[1.15] -mt-1 sm:-mt-2",
                },
              ]}
            />
          </div>

          {/* Right Column: Paragraph Text */}
          <div className="max-w-md lg:pb-1">
            <p className="font-poppins text-sm sm:text-base font-light text-[#1e2617]/75 leading-relaxed">
              We combine advanced aesthetic technology with personalised care to create thoughtful treatment experiences in a calm, professional environment.
            </p>
          </div>

        </div>

        {/* 3 Values Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {values.map((item) => {
            const isDark = item.variant === "dark";

            return (
              <div
                key={item.number}
                className={`relative rounded-[24px] p-6 sm:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-[270px] transition-all duration-500 hover:-translate-y-2 group overflow-hidden ${
                  isDark
                    ? "bg-[#1a1f14] text-white shadow-xl hover:shadow-2xl"
                    : "bg-[#f7f1eb] text-[#1e2617] border border-[#1e2617]/5 shadow-[0_8px_30px_rgba(30,38,23,0.03)] hover:shadow-xl"
                }`}
              >
                {/* Background Decor Image for Dark Card */}
                {isDark && item.image && (
                  <div className="absolute right-0 bottom-0 w-3/5 h-full opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity duration-700">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-right"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a1f14]/70 to-[#1a1f14]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#1a1f14]/40 to-[#1a1f14]" />
                  </div>
                )}

                {/* Top Section: Number & Title */}
                <div className="relative z-10">
                  <span
                    className={`font-poppins text-xs sm:text-sm font-medium mb-3 block tracking-wider ${
                      isDark ? "text-[#dfcca5]" : "text-[#c2a878]"
                    }`}
                  >
                    {item.number} — {item.category}
                  </span>

                  <h3
                    className={`font-belleza text-xl sm:text-2xl font-normal leading-snug mb-3 ${
                      isDark ? "text-white" : "text-[#1e2617]"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`font-poppins text-xs sm:text-sm font-light leading-relaxed ${
                      isDark ? "text-white/80 max-w-[88%]" : "text-[#1e2617]/75"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
