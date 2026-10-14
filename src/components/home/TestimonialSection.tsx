"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
  return (
    <section id="testimonials" className="w-full bg-[#f7f1eb] text-[#1e2617] pt-6 pb-6 sm:pt-8 sm:pb-8 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Large Arch Shaped Framed Salon Image */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-t-full overflow-hidden border border-[#1e2617]/10 shadow-xl group">
            <Image
              src="/images/testimonials.png"
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

        {/* Right Column: Customer Testimonial Content with Swiper */}
        <div className="lg:col-span-6 flex flex-col items-start text-left w-full">
          
          {/* Cursive Subtitle */}
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 select-none">
            customers
          </span>

          {/* Main Headline */}
          <h2 className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight mb-6">
            LOVELY CUSTOMERS.
          </h2>

          {/* Swiper Slider Wrapper */}
          <div className="w-full relative pb-2">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: ".testimonial-swiper-prev",
                nextEl: ".testimonial-swiper-next",
              }}
              pagination={{
                clickable: true,
                el: ".testimonial-swiper-pagination",
              }}
              className="w-full"
            >
              {DEFAULT_TESTIMONIALS.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="w-full pb-2">
                  {/* 5 Gold Stars Rating */}
                  <div className="flex items-center gap-1.5 mb-8">
                    {Array.from({ length: testimonial.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-5 h-5 text-[#dfcca5] fill-[#dfcca5]"
                      />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-[#1e2617]/85 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl min-h-[90px]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Horizontal Divider Line */}
                  <div className="w-full border-b border-[#1e2617]/20 my-8" />

                  {/* Bottom Bar: Customer Profile */}
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0">
                        <div className="relative w-full h-full rounded-full overflow-hidden border border-[#1e2617]/20 shadow-md">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
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
                          {testimonial.name}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#1e2617]/60 font-light">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Bottom Controls Bar (Fixed on bottom right across all slides) */}
            <div className="absolute bottom-4 right-0 z-10 flex items-center gap-3">
              {/* Pagination Dots */}
              <div className="testimonial-swiper-pagination flex items-center gap-2 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-[#1e2617]/30 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-pagination-bullet-active]:w-5 [&_.swiper-pagination-bullet-active]:h-5 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet-active]:bg-transparent [&_.swiper-pagination-bullet-active]:border [&_.swiper-pagination-bullet-active]:border-[#dfcca5] [&_.swiper-pagination-bullet-active]:relative [&_.swiper-pagination-bullet-active]:after:content-[''] [&_.swiper-pagination-bullet-active]:after:absolute [&_.swiper-pagination-bullet-active]:after:w-2 [&_.swiper-pagination-bullet-active]:after:h-2 [&_.swiper-pagination-bullet-active]:after:bg-[#dfcca5] [&_.swiper-pagination-bullet-active]:after:rounded-full [&_.swiper-pagination-bullet-active]:after:top-1/2 [&_.swiper-pagination-bullet-active]:after:left-1/2 [&_.swiper-pagination-bullet-active]:after:-translate-x-1/2 [&_.swiper-pagination-bullet-active]:after:-translate-y-1/2 [&_.swiper-pagination-bullet]:cursor-pointer" />

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  className="testimonial-swiper-prev w-7 h-7 rounded-full border border-[#1e2617]/20 bg-white/80 hover:bg-[#1e2617] hover:text-[#f7f1eb] text-[#1e2617] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-40"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="testimonial-swiper-next w-7 h-7 rounded-full border border-[#1e2617]/20 bg-white/80 hover:bg-[#1e2617] hover:text-[#f7f1eb] text-[#1e2617] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-40"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
