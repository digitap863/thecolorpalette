"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";

export default function ServicesCTA() {
  return (
    <section className="w-full bg-[#FAF6F0] py-20 sm:py-28 relative overflow-hidden">
      {/* Background soft glow circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stone-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-300/60 shadow-xs mb-6">
            <Calendar className="w-3.5 h-3.5 text-stone-700" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone-800">
              PERSONAL CONSULTATION
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-stone-900 font-light tracking-tight leading-tight mb-6">
            Not sure where to begin?
          </h2>

          <p className="text-base sm:text-xl text-stone-600 font-light max-w-xl leading-relaxed mb-10">
            Every treatment begins with understanding your individual needs. Schedule a private consultation with our aesthetic clinical specialists.
          </p>

          <Link
            href="/contact"
            className="px-9 py-4.5 bg-stone-900 text-stone-50 text-xs sm:text-sm uppercase tracking-[0.22em] font-medium rounded-full hover:bg-stone-800 transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 group"
          >
            <span>BOOK A CONSULTATION</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

        </div>
      </div>
    </section>
  );
}
