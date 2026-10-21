"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useServicesContext } from "@/context/ServicesContext";
import {
  User,
  Calendar,
  LayoutGrid,
  MessageSquare,
  ChevronDown,
  Check,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import TypewriterText from "@/components/common/TypewriterText";

export interface ServiceItem {
  id: string;
  name: string;
}

export interface GroupedServiceCategory {
  categoryId: string;
  categoryName: string;
  services: ServiceItem[];
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
  {
    id: "other",
    name: "Other / Not Sure",
  },
];

export default function BookingSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    service: "",
    message: "",
    agreed: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Consume dynamic services and categories from ServicesContext
  const { categories, services: contextServices } = useServicesContext();

  // Group services by category from ServicesContext
  const groupedServices = useMemo(() => {
    const hasCat = Array.isArray(categories) && categories.length > 0;
    const hasSrv = Array.isArray(contextServices) && contextServices.length > 0;

    if (!hasCat && !hasSrv) return [];

    const groups: GroupedServiceCategory[] = [];
    const assignedIds = new Set<string>();

    if (hasCat) {
      categories
        .filter((c) => c.isActive !== false)
        .forEach((cat) => {
          const catId = cat.id || cat.slug;
          const matchingServices = (hasSrv ? contextServices : [])
            .filter(
              (s) =>
                s.isActive !== false &&
                (s.categoryId === cat.id || s.categoryId === cat.slug)
            )
            .map((s) => {
              assignedIds.add(s.id);
              return {
                id: s.id || s.slug,
                name: s.name,
              };
            });

          groups.push({
            categoryId: catId,
            categoryName: cat.name,
            services: matchingServices,
          });
        });

      if (hasSrv) {
        const otherServices = contextServices
          .filter((s) => s.isActive !== false && !assignedIds.has(s.id))
          .map((s) => ({
            id: s.id || s.slug,
            name: s.name,
          }));

        if (otherServices.length > 0) {
          groups.push({
            categoryId: "other",
            categoryName: "Other Treatments",
            services: otherServices,
          });
        }
      }
    }

    return groups;
  }, [categories, contextServices]);

  // Flat list fallback
  const dynamicServices = useMemo(() => {
    const flatList: ServiceItem[] = [];
    const seen = new Set<string>();

    if (Array.isArray(contextServices) && contextServices.length > 0) {
      contextServices
        .filter((s) => s.isActive !== false)
        .forEach((s) => {
          const name = s.name?.trim();
          if (name && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            flatList.push({ id: s.id || s.slug || name, name });
          }
        });
    }

    if (Array.isArray(categories) && categories.length > 0) {
      categories
        .filter((c) => c.isActive !== false)
        .forEach((c) => {
          const name = c.name?.trim();
          if (name && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            flatList.push({ id: c.id || c.slug || name, name });
          }
        });
    }

    return flatList.length > 0 ? flatList : DEFAULT_SERVICES;
  }, [categories, contextServices]);

  // Dynamic Site Settings for Consultation Notice (Controlled from Admin)
  const [siteSettings, setSiteSettings] = useState<{
    freeConsultationActive: boolean;
    freeConsultationBadge: string;
    freeConsultationTitle: string;
    freeConsultationDescription: string;
  }>({
    freeConsultationActive: false,
    freeConsultationBadge: "COMPLIMENTARY OFFER",
    freeConsultationTitle: "DOCTOR CONSULTATION IS FREE",
    freeConsultationDescription:
      "Schedule your appointment today & receive a personalized 1-on-1 skin & hair evaluation by certified specialists at zero consultation fee.",
  });

  // Fetch dynamic consultation notice setting (no-store ensures fresh status from DB)
  useEffect(() => {
    let isMounted = true;
    fetch("/api/settings", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setSiteSettings({
            freeConsultationActive: data.freeConsultationActive === true,
            freeConsultationBadge:
              data.freeConsultationBadge || "COMPLIMENTARY OFFER",
            freeConsultationTitle:
              data.freeConsultationTitle ||
              data.freeConsultationText ||
              "DOCTOR CONSULTATION IS FREE",
            freeConsultationDescription:
              data.freeConsultationDescription !== undefined
                ? data.freeConsultationDescription
                : "Schedule your appointment today & receive a personalized 1-on-1 skin & hair evaluation by certified specialists at zero consultation fee.",
          });
        }
      })
      .catch((err) => {
        console.warn("Settings fetch skipped or failed:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          date: formData.date,
          service: formData.service,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          phone: "",
          date: "",
          service: "",
          message: "",
          agreed: false,
        });
        setTimeout(() => {
          setSubmitted(false);
        }, 7000);
      } else {
        setErrorMessage(data.error || "Failed to submit booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#f7f1eb] text-[#1e2617] py-6 sm:py-12  px-6 sm:px-12 md:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Form & Titles */}
        <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
          
          {/* Cursive Subtitle */}
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 select-none">
            reserve
          </span>

          {/* Main Headline with Writing Animation */}
          <TypewriterText
            text="BOOK A SEAT"
            as="h2"
            delay={10}
             speed={80}
            className={`font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight ${
              siteSettings.freeConsultationActive ? "mb-3" : "mb-10"
            }`}
            cursorColor="#dfcca5"
          />

          {/* Complimentary Consultation Notice (Visible only when turned ON from admin) */}
          {siteSettings.freeConsultationActive && (
            <div className="w-full mb-8">
              <div className="flex flex-wrap items-center gap-2 font-belleza text-xs sm:text-sm tracking-[0.18em] uppercase mb-2">
                <span className="text-[#8c6d36] font-medium">
                  {siteSettings.freeConsultationBadge || "COMPLIMENTARY OFFER"}
                </span>
                <span className="text-[#1e2617]/40 text-xs">·</span>
                <span className="text-[#1e2617] font-normal">
                  {siteSettings.freeConsultationTitle || "DOCTOR CONSULTATION IS FREE"}
                </span>
                <span className="text-[#1e2617]/40 text-xs">·</span>
              </div>
              {siteSettings.freeConsultationDescription && (
                <p className="font-poppins text-xs sm:text-[13px] text-[#1e2617]/70 font-light leading-relaxed mb-4">
                  {siteSettings.freeConsultationDescription}
                </p>
              )}
              <div className="w-full border-b border-[#1e2617]/15" />
            </div>
          )}

          {/* Booking / Contact Form */}
          <form onSubmit={handleSubmit} className="w-full font-poppins">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 mb-10 sm:mb-12">
              
              {/* Field 1: Your Name */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5 min-w-0">
                <User className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3" strokeWidth={1.5} />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent text-base sm:text-sm md:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light min-w-0"
                />
              </div>

              {/* Field 2: Your phone */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5 min-w-0">
                <Phone className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3" strokeWidth={1.5} />
                <input
                  type="tel"
                  required
                  placeholder="Your Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent text-base sm:text-sm md:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light min-w-0"
                />
              </div>

              {/* Field 3: Select Date */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5 min-w-0">
                <Calendar className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3 pointer-events-none" strokeWidth={1.5} />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-transparent text-base sm:text-sm md:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light cursor-pointer appearance-none min-w-0 pr-8"
                />
                <ChevronDown className="w-4 h-4 text-[#1e2617]/60 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 shrink-0" />
              </div>

              {/* Field 4: Service Type (Mobile Responsive) */}
              <div className="relative flex items-center border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors pb-2.5 min-w-0 w-full">
                <LayoutGrid className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3 pointer-events-none" strokeWidth={1.5} />
                <div className="relative flex-1 min-w-0">
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-transparent text-base sm:text-sm md:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light cursor-pointer appearance-none pr-8 truncate py-0.5"
                  >
                    <option value="" disabled className="text-gray-500 bg-[#f7f1eb]">
                      Select Service / Treatment
                    </option>
                    {groupedServices.length > 0 ? (
                      <>
                        {groupedServices.map((group) =>
                          group.services.length > 0 ? (
                            <optgroup
                              key={group.categoryId}
                              label={group.categoryName}
                              className="font-medium text-[#1e2617] bg-[#f7f1eb]"
                            >
                              {group.services.map((service) => (
                                <option key={service.id} value={service.name} className="font-light bg-[#f7f1eb]">
                                  {service.name}
                                </option>
                              ))}
                            </optgroup>
                          ) : (
                            <option key={group.categoryId} value={group.categoryName} className="bg-[#f7f1eb]">
                              {group.categoryName}
                            </option>
                          )
                        )}
                        <option value="Other / Not Sure" className="font-light bg-[#f7f1eb]">
                          Other / Not Sure
                        </option>
                      </>
                    ) : (
                      <>
                        {dynamicServices.map((service) => (
                          <option key={service.id} value={service.name} className="bg-[#f7f1eb]">
                            {service.name}
                          </option>
                        ))}
                        {!dynamicServices.some(
                          (s) =>
                            s.name.toLowerCase().includes("not sure") ||
                            s.name.toLowerCase().includes("other")
                        ) && (
                          <option value="Other / Not Sure" className="bg-[#f7f1eb]">
                            Other / Not Sure
                          </option>
                        )}
                      </>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#1e2617]/60 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 shrink-0" />
                </div>
              </div>

              {/* Field 5: Message (Full Width - extends to the lower line) */}
              <div className="sm:col-span-2 relative flex items-start border-b border-[#1e2617]/30 focus-within:border-[#1e2617] transition-colors  pt-2">
                <MessageSquare className="w-5 h-5 text-[#1e2617]/60 shrink-0 mr-3 mt-1" strokeWidth={1.5} />
                <textarea
                  rows={4}
                  placeholder="How can we help you? Feel free to get in touch!"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent text-base sm:text-sm md:text-base text-[#1e2617] placeholder-[#1e2617]/60 focus:outline-none font-light resize-none leading-relaxed min-h-[40px]"
                />
              </div>

            </div>

            {/* Action Row: SUBMIT button & Checkbox */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-belleza px-9 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1e2617]" />
                    <span>SENDING...</span>
                  </>
                ) : (
                  <span>SUBMIT</span>
                )}
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
              <div className="mt-6 p-4 border border-emerald-800/30 bg-emerald-50 text-[#1e2617] text-sm font-light flex items-center gap-3 animate-fade-in rounded-md">
                <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Thank you! Your appointment request has been submitted. Our team will contact you shortly.</span>
              </div>
            )}

            {/* Error Alert Banner */}
            {errorMessage && (
              <div className="mt-6 p-4 border border-rose-800/30 bg-rose-50 text-rose-900 text-sm font-light flex items-center gap-3 animate-fade-in rounded-md">
                <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                <span>{errorMessage}</span>
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

