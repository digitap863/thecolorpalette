"use client";

import React from "react";
import TreatmentCard from "./TreatmentCard";
import { ServiceCategoryData, ServiceData } from "@/types/services";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface ServiceCategorySectionProps {
  category: ServiceCategoryData;
  treatments: ServiceData[];
  index: number;
  onSelectTreatment?: (treatment: ServiceData) => void;
}

export default function ServiceCategorySection({
  category,
  treatments,
  index,
  onSelectTreatment,
}: ServiceCategorySectionProps) {
  if (treatments.length === 0) return null;

  const prevClass = `service-swiper-prev-${category.slug || index}`;
  const nextClass = `service-swiper-next-${category.slug || index}`;

  return (
    <section
      id={category.slug}
      className="w-full py-7 sm:py-9 border-b border-stone-200/70 scroll-mt-36 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Category Header with Title, Description, and Swiper Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 pb-4 border-b border-stone-200/60">
          
          <div className="border-l-2 border-stone-800 pl-4 sm:pl-6 max-w-3xl">
            {/* Title */}
            <h2 className="font-belleza text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight leading-tight mb-2">
              {category.name}
            </h2>

            {/* Description */}
            {category.shortDescription && (
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                {category.shortDescription}
              </p>
            )}
          </div>

          {/* Swiper Arrow Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <button
              className={`${prevClass} w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center transition-all cursor-pointer bg-white text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-xs disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-200 disabled:cursor-not-allowed`}
              aria-label="Previous treatments"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              className={`${nextClass} w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center transition-all cursor-pointer bg-white text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-xs disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-200 disabled:cursor-not-allowed`}
              aria-label="Next treatments"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Treatments Swiper Row (4 cards per view on large screens, 1.15 on mobile) */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.${prevClass}`,
            nextEl: `.${nextClass}`,
          }}
          slidesPerView={1.15}
          spaceBetween={16}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="w-full pt-1.5 pb-5"
        >
          {treatments.map((treatment, cardIdx) => (
            <SwiperSlide key={treatment.id} className="!h-auto flex flex-col">
              <TreatmentCard
                treatment={treatment}
                index={cardIdx}
                onSelect={onSelectTreatment}
              />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
