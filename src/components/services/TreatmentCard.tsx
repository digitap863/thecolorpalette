"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ServiceData } from "@/types/services";

interface TreatmentCardProps {
  treatment: ServiceData;
  index?: number;
}

const FALLBACK_IMAGE = "/gallery/gallery_medifacial_1_1791351357677.png";

export default function TreatmentCard({ treatment, index = 0 }: TreatmentCardProps) {
  const [imgSrc, setImgSrc] = useState(treatment.image || FALLBACK_IMAGE);

  // Stagger animation delay based on card index (capped at 5 items for smooth feel)
  const animDelay = (index % 6) * 75;

  return (
    <div
      style={{ animationDelay: `${animDelay}ms` }}
      className="group relative bg-white/90 backdrop-blur-xs border border-stone-200/90 rounded-2xl overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:border-stone-400 hover:shadow-md hover:-translate-y-1 animate-item-fade"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
        <Image
          src={imgSrc}
          alt={treatment.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

        {/* Featured Badge */}
        {treatment.featured && (
          <div className="absolute top-3.5 right-3.5 bg-stone-900/90 backdrop-blur-md text-stone-100 text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Signature</span>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-serif text-xl font-medium text-stone-900 tracking-tight leading-snug group-hover:text-stone-700 transition-colors mb-2.5">
            {treatment.name}
          </h3>

          <p className="text-sm font-light text-stone-600 leading-relaxed line-clamp-3">
            {treatment.shortDescription}
          </p>
        </div>

        {/* Bottom CTA Link */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-stone-900 hover:text-stone-600 transition-colors group/link"
          >
            <span>VIEW TREATMENT</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
