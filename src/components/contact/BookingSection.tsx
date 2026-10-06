"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Mail, Calendar, LayoutGrid, MessageSquare, ChevronDown, Check } from "lucide-react";

export interface ServiceItem {
  id: string;
  name: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "facial-treatments",
    name: "Facials & Medifacials",
  },
  {
    id: "laser-treatments",
    name: "Laser & Light-Based Treatments",
  },
  {
    id: "chemical-peels",
    name: "Chemical Peels",
  },
  {
    id: "advance-skin-procedures",
    name: "Advance Skin Procedures",
  },
  {
    id: "gfc",
    name: "GFC",
  },
  {
    id: "prp",
    name: "PRP",
  },
  {
    id: "skin-boosters",
    name: "Skin Boosters",
  },
  {
    id: "hair-treatments",
    name: "Hair & Scalp Treatments",
  },
  {
    id: "body-hand-foot-care",
    name: "Body, Hand & Foot Care",
  },
  {
    id: "iv-therapy",
    name: "IV Therapy",
  },
  {
    id: "nail-services",
    name: "Nail Services",
  },
  {
    id: "lash-services",
    name: "Lash Services",
  },
];

export default function BookingSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    service: "",
    message: "",
    agreed: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.agreed) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          date: "",
          service: "",
          message: "",
          agreed: false,
        });
      }, 5000);
    }
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#f7f1eb] text-[#1e2617] pt-6 pb-12 sm:pt-8 sm:pb-16 px-6 sm:px-12 md:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Form & Titles */}
        <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
          
          {/* Cursive Subtitle */}
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 select-none">
            reserve
          </span>

          {/* Main Headline */}
          <h2 className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight mb-12">
            BOOK A SEAT
          </h2>

          {/* Booking / Contact Form */}
          <form onSubmit={handleSubmit} className="w-full font-poppins">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 mb-8">
              
              {/* Field 1: Your Name */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5">
                <User className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3" strokeWidth={1.5} />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light"
                />
              </div>

              {/* Field 2: Your Email */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5">
                <Mail className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3" strokeWidth={1.5} />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light"
                />
              </div>

              {/* Field 3: Select Date */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5">
                <Calendar className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3 pointer-events-none" strokeWidth={1.5} />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light cursor-pointer appearance-none"
                />
                <ChevronDown className="w-4 h-4 text-[#1e2617]/60 pointer-events-none ml-2 shrink-0" />
              </div>

              {/* Field 4: Service Type */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5">
                <LayoutGrid className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3 pointer-events-none" strokeWidth={1.5} />
                <select
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light cursor-pointer appearance-none pr-6"
                >
                  <option value="" disabled className="text-gray-500 bg-[#f7f1eb]">
                    Service type
                  </option>
                  {DEFAULT_SERVICES.map((service) => (
                    <option key={service.id} value={service.id} className="bg-[#f7f1eb]">
                      {service.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#1e2617]/60 pointer-events-none absolute right-0 shrink-0" />
              </div>

              {/* Field 5: Message (Full Width) */}
              <div className="sm:col-span-2 relative flex items-start border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5 pt-2">
                <MessageSquare className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3 mt-1" strokeWidth={1.5} />
                <textarea
                  rows={2}
                  placeholder="How can we help you? Feel free to get in touch!"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent text-sm sm:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light resize-none"
                />
              </div>

            </div>

            {/* Subtle Divider Line */}
            <div className="w-full border-b border-[#1e2617]/20 my-10" />

            {/* Action Row: SUBMIT button & Checkbox */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              {/* Submit Button */}
              <button
                type="submit"
                className="font-belleza px-9 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer shrink-0"
              >
                SUBMIT
              </button>

              {/* Checkbox Agreement */}
              <label className="flex items-center gap-3 text-xs sm:text-sm font-light text-[#1e2617]/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  className="w-4 h-4 rounded-none border border-[#1e2617]/50 accent-[#1e2617] cursor-pointer"
                />
                <span>
                  I agree that my submitted data is{" "}
                  <a href="#" className="underline hover:text-[#1e2617] transition-colors">
                    collected and stored
                  </a>
                  .
                </span>
              </label>

            </div>

            {/* Success Notification Banner */}
            {submitted && (
              <div className="mt-6 p-4 border border-[#1e2617]/30 bg-[#dfcca5]/20 text-[#1e2617] text-sm font-light flex items-center gap-3 animate-fade-in">
                <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Thank you! Your seat reservation request has been received. We will contact you shortly.</span>
              </div>
            )}

          </form>

        </div>

        {/* Right Column: Large Arch Shaped Framed Image */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative w-full max-w-[460px] aspect-[3/4] rounded-t-full overflow-hidden border border-[#1e2617]/10 shadow-2xl group">
            <Image
              src="/images/contactUs.png"
              alt="Book a seat - The Color Palette"
              fill
              className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e2617]/20 pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
