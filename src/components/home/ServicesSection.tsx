"use client";

import Image from "next/image";
import Link from "next/link";
import { useServicesContext } from "@/context/ServicesContext";

export default function ServicesSection() {
  const { categories } = useServicesContext();

  return (
    <section id="services" className="w-full bg-white text-black py-20 sm:py-28 px-6 sm:px-12 md:px-16 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Column: Asymmetrical Arch Framed Service Image */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-tl-[160px] sm:rounded-tl-[200px] rounded-br-[160px] sm:rounded-br-[200px] rounded-tr-md rounded-bl-md overflow-hidden border border-black/10 shadow-2xl group">
            <Image
              src="/images/service.png"
              alt="Colorpellet Salon Services"
              fill
              className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Menu Header & Service List */}
        <div className="lg:col-span-7 flex flex-col items-center text-center w-full">
          
          {/* Cursive Subtitle */}
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 select-none">
            Bespoke
          </span>

          {/* Main Headline */}
          <h2 className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight mb-10">
            SERVICES
          </h2>

          {/* Services List */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6 mb-12">
            {categories.map((category) => (
              <Link
                key={category.id || category.slug}
                href={`/services?category=${category.slug}`}
                className="w-full flex items-center min-w-0 group hover:opacity-80 transition-opacity"
              >
                <span className="font-belleza text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider text-[#1e2617] shrink-0 group-hover:text-amber-800 transition-colors">
                  {category.name}
                </span>

                {/* Dotted border connector */}
                <div className="flex-1 ml-2 border-b border-dotted border-black/20 h-1 min-w-[12px]" />
              </Link>
            ))}
          </div>

          {/* Action Button: VIEW MORE SERVICES */}
          <Link
            href="/services"
            className="font-belleza px-8 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 inline-block"
          >
            VIEW MORE SERVICES
          </Link>

        </div>

      </div>
    </section>
  );
}

