"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const IconX = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconFacebook = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const IconInstagram = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconLinkedin = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#f7f1eb] text-[#1e2617] pt-8 pb-3 px-6 sm:px-12 md:px-16 border-t border-black/10">
      <div className="max-w-7xl mx-auto">

        {/* Main 3 Column Grid - Equal vertical alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-black/10 pb-6 items-stretch">

          {/* Column 1: Website Map */}
          <div className="lg:col-span-4 lg:pr-10 pb-4 lg:pb-0 pt-2 lg:pt-0 flex flex-col justify-start">
            <h3 className="font-belleza text-base sm:text-lg font-medium uppercase tracking-[0.18em] text-[#1e2617] mb-3">
              WEBSITE MAP
            </h3>

            <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-xs sm:text-sm font-light text-[#1e2617]/80">
              <Link href="/" className="hover:text-[#1e2617] transition-colors">Home</Link>
              <Link href="/#about" className="hover:text-[#1e2617] transition-colors">About Us</Link>
              <Link href="/#services" className="hover:text-[#1e2617] transition-colors">Services</Link>
              <Link href="/#testimonials" className="hover:text-[#1e2617] transition-colors">Testimonials</Link>
              <Link href="/#faq" className="hover:text-[#1e2617] transition-colors">FAQ</Link>
              <Link href="/contact" className="hover:text-[#1e2617] transition-colors">Booking</Link>
              <Link href="/#gallery" className="hover:text-[#1e2617] transition-colors">Gallery</Link>
              <Link href="/contact" className="hover:text-[#1e2617] transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Column 2: Center Brand logo_new */}
          <div className="lg:col-span-4 lg:px-6 py-4 lg:py-0 flex flex-col items-center justify-center text-center">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo_new/logo_new.png"
                alt="The Color Palette logo_new"
                width={360}
                height={150}
                className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Column 3: Contact & Follow */}
          <div className="lg:col-span-4 lg:pl-10 pb-4 lg:pb-0 pt-2 lg:pt-0 flex flex-col justify-start">
            <h3 className="font-belleza text-base sm:text-lg font-medium uppercase tracking-[0.18em] text-[#1e2617] mb-2">
              CONTACT
            </h3>

            <div className="text-xs sm:text-sm font-light text-[#1e2617]/80 space-y-1 mb-4 leading-relaxed">
              <p>Geo Centre, Chakkaraparambu,</p>
              <p>Vennala, Kochi, Kerala – 682032</p>
              <p className="pt-0.5">P: +91 8547977486</p>
              <p>E: Info@thecolorpalette.in</p>
              <p className="text-[#1e2617]/60 text-[11px] sm:text-xs pt-1">
                Hours: 10:00 AM – 7:00 PM (All Days)
              </p>
            </div>

            <h3 className="font-belleza text-base sm:text-lg font-medium uppercase tracking-[0.18em] text-[#1e2617] mb-2">
              FOLLOW
            </h3>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/the_color_palette_aesthetics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-colors"
              >
                <IconInstagram />
              </a>
              <a
                href="#"
                aria-label="X"
                className="w-8 h-8 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-colors"
              >
                <IconX />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-colors"
              >
                <IconFacebook />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-colors"
              >
                <IconLinkedin />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar Divider Line */}
        <div className="pt-3 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-light text-[#1e2617]/75">
          <div>
            © 2026 The Color Palette. All rights reserved. Developed & powered by <span className="font-semibold text-[#1e2617]"><a href="https://tapclone.in" target="_blank" rel="noopener noreferrer">Tapclone</a></span>.
          </div>

          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-[#1e2617] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#1e2617] transition-colors">
              Terms & Conditions
            </Link>

            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="w-7 h-7 border border-[#1e2617]/50 flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-colors cursor-pointer ml-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
