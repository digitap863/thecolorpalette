"use client";

import React from "react";

// Crisp SVG Icons matching the reference image
const IconSalonTools = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="46" r="6" />
    <circle cx="32" cy="48" r="6" />
    <line x1="22.5" y1="41.5" x2="44" y2="16" />
    <line x1="28" y1="43" x2="16" y2="28" />
    <circle cx="29" cy="34" r="1.3" fill="currentColor" />
    <path d="M38 18 L54 34" strokeWidth="2.2" />
    <line x1="41" y1="21" x2="47" y2="15" />
    <line x1="44" y1="24" x2="50" y2="18" />
    <line x1="47" y1="27" x2="53" y2="21" />
    <line x1="50" y1="30" x2="56" y2="24" />
    <line x1="53" y1="33" x2="59" y2="27" />
  </svg>
);

const IconOpenSign = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M32 10 L20 22" />
    <path d="M32 10 L44 22" />
    <circle cx="32" cy="10" r="2.5" />
    <rect x="13" y="22" width="38" height="26" rx="3" strokeWidth="1.8" />
    <text
      x="32"
      y="39"
      textAnchor="middle"
      fontSize="9.5"
      fontWeight="bold"
      letterSpacing="1.8"
      fill="currentColor"
      stroke="none"
      fontFamily="sans-serif"
    >
      OPEN
    </text>
  </svg>
);

const IconSalonChair = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="28" y="9" width="8" height="5" rx="1.5" />
    <line x1="32" y1="14" x2="32" y2="18" />
    <path d="M22 18 H42 C44 18 45 19 45 21 V35 C45 36 44 37 42 37 H22 C20 37 19 36 19 35 V21 C19 19 20 18 22 18 Z" />
    <path d="M15 27 H19 V34 H15 V27 Z" />
    <path d="M45 27 H49 V34 H45 V27 Z" />
    <rect x="18" y="37" width="28" height="6" rx="2" />
    <line x1="32" y1="43" x2="32" y2="52" strokeWidth="2.2" />
    <ellipse cx="32" cy="53" rx="14" ry="4" />
  </svg>
);

const IconProProducts = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 34 C14 46 22 52 32 52 C42 52 50 46 50 34 H14 Z" />
    <line x1="11" y1="34" x2="53" y2="34" strokeWidth="2" />
    <path d="M20 34 C22 29 26 29 28 34 C30 29 34 29 36 34" strokeWidth="1.2" />
    <path d="M42 42 L55 16" strokeWidth="1.8" />
    <line x1="51" y1="13" x2="58" y2="20" />
    <line x1="54" y1="11" x2="60" y2="17" />
    <line x1="48" y1="15" x2="55" y2="22" />
  </svg>
);

const IconQuickDry = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="20" y="18" width="22" height="14" rx="3" />
    <path d="M20 21 H12 V29 H20" />
    <path d="M25 32 L21 48 C20.5 50 22 52 24 52 H28 C30 52 31 50 30.5 48 L28 32" />
    <line x1="47" y1="21" x2="55" y2="19" />
    <line x1="47" y1="25" x2="57" y2="25" strokeWidth="2" />
    <line x1="47" y1="29" x2="55" y2="31" />
  </svg>
);

const IconHairExperts = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="20" cy="46" r="6" />
    <circle cx="44" cy="46" r="6" />
    <line x1="24.5" y1="41.5" x2="48" y2="16" />
    <line x1="39.5" y1="41.5" x2="16" y2="16" />
    <circle cx="32" cy="33.5" r="1.5" fill="currentColor" />
    <path
      d="M32 9 L33.5 13 L37.5 13 L34.5 16 L35.5 20 L32 17.5 L28.5 20 L29.5 16 L26.5 13 L30.5 13 Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export interface FeatureCardItem {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "dark" | "light";
}

const FEATURE_CARDS: FeatureCardItem[] = [
  {
    id: "salon-tools",
    subtitle: "Pro Equipment",
    title: "SALON TOOLS",
    description: "Sed ut unde omnis iste natus ut perspic iatis unde omnis",
    icon: <IconSalonTools />,
    variant: "dark",
  },
  {
    id: "open-24-7",
    subtitle: "Available Anytime",
    title: "OPEN 24/7",
    description: "Sed ut unde omnis iste natus ut perspic iatis unde omnis",
    icon: <IconOpenSign />,
    variant: "light",
  },
  {
    id: "interior",
    subtitle: "Comfort Zone",
    title: "INTERIOR",
    description: "Sed ut unde omnis iste natus ut perspic iatis unde omnis",
    icon: <IconSalonChair />,
    variant: "dark",
  },
  {
    id: "pro-products",
    subtitle: "Styling Essentials",
    title: "PRO PRODUCTS",
    description: "Sed ut unde omnis iste natus ut perspic iatis unde omnis",
    icon: <IconProProducts />,
    variant: "light",
  },
  {
    id: "quick-dry",
    subtitle: "Fast Styling",
    title: "QUICK DRY",
    description: "Sed ut unde omnis iste natus ut perspic iatis unde omnis",
    icon: <IconQuickDry />,
    variant: "dark",
  },
  {
    id: "hair-experts",
    subtitle: "Certified",
    title: "HAIR EXPERTS",
    description: "Sed ut unde omnis iste natus ut perspic iatis unde omnis",
    icon: <IconHairExperts />,
    variant: "light",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-[#f7f1eb] py-12 sm:py-16 px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Grid Container: 3 Columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURE_CARDS.map((card) => {
            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between p-8 sm:p-10 min-h-[300px] sm:min-h-[340px] bg-white text-[#3c3530] border-none shadow-[0_8px_30px_rgba(74,65,58,0.04)] hover:shadow-[0_12px_40px_rgba(74,65,58,0.08)] transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Top Section: Subtitle (Left) & Icon (Right) */}
                <div className="flex items-start justify-between w-full mb-8">
                  <span className="font-sans text-xs sm:text-sm tracking-wider font-light text-[#3c3530]/75">
                    {card.subtitle}
                  </span>

                  <div className="text-[#3c3530] transform transition-transform duration-500 group-hover:scale-110">
                    {card.icon}
                  </div>
                </div>

                {/* Middle Section: Main Uppercase Title */}
                <div className="my-auto">
                  <h3 className="font-belleza text-2xl sm:text-3xl md:text-3.5xl font-normal uppercase tracking-[0.12em] leading-tight text-[#3c3530]">
                    {card.title}
                  </h3>
                </div>

                {/* Bottom Section: Divider Line & Description Text */}
                <div className="mt-8 pt-5 border-t border-[#3c3530]/15">
                  <p className="text-xs sm:text-sm font-light leading-relaxed text-[#3c3530]/80">
                    {card.description}
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
