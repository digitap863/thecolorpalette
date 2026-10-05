"use client";

import Image from "next/image";
import Link from "next/link";

export interface ServiceItem {
  id: string;
  name: string;
  isSpecial?: boolean;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "facial-treatments",
    name: "FACIAL TREATMENTS",
  },
  {
    id: "bridal-makeup",
    name: "BRIDAL MAKEUP",
    isSpecial: true,
  },
  {
    id: "premium-medi-facials",
    name: "PREMIUM MEDI FACIALS",
  },
  {
    id: "laser-treatments",
    name: "LASER TREATMENTS",
  },
  {
    id: "hair-treatments",
    name: "HAIR TREATMENTS",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="w-full bg-white text-black py-20 sm:py-28 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Asymmetrical Arch Framed Service Image */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-tl-[160px] sm:rounded-tl-[200px] rounded-br-[160px] sm:rounded-br-[200px] rounded-tr-md rounded-bl-md overflow-hidden border border-black/10 shadow-2xl group">
            <Image
              src="/Banner/vlcsnap-2026-09-30-11h16m23s869.png"
              alt="Colorpellet Salon Services"
              fill
              className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Menu Header & Service List */}
        <div className="lg:col-span-6 flex flex-col items-start text-left w-full">
          
          {/* Cursive Subtitle */}
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 select-none">
            Bespoke
          </span>

          {/* Main Headline */}
          <h2 className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight mb-10">
            SERVICES
          </h2>

          {/* Services List */}
          <div className="w-full space-y-6 mb-12">
            {DEFAULT_SERVICES.map((service) => (
              <div key={service.id} className="w-full flex items-center">
                <span className="font-belleza text-base sm:text-lg md:text-xl font-medium uppercase tracking-wider text-[#1e2617] shrink-0">
                  {service.name}
                </span>

                {service.isSpecial && (
                  <span className="ml-3 bg-[#dfcca5] text-[#1e2617] text-[10px] sm:text-[11px] font-bold tracking-widest px-2 py-0.5 uppercase shrink-0">
                    SPECIAL
                  </span>
                )}

                {/* Dotted border connector */}
                <div className="flex-1 ml-3 border-b border-dotted border-black/20 h-1 min-w-[20px]" />
              </div>
            ))}
          </div>

          {/* Action Button: VIEW MORE SERVICES */}
          <Link
            href="#services"
            className="font-belleza px-8 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 inline-block"
          >
            VIEW MORE SERVICES
          </Link>

        </div>

      </div>
    </section>
  );
}
