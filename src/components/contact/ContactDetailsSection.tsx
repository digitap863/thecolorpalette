"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, Share2 } from "lucide-react";

const IconInstagram = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconX = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconFacebook = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const IconLinkedin = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function ContactDetailsSection() {
  return (
    <section className="w-full bg-[#f7f1eb] text-[#1e2617]  pb-6  px-6 sm:px-12 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 block select-none">
            get in touch
          </span>
          <h1 className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617]">
            CONTACT DETAILS
          </h1>
        </div>

        {/* 3 Column Aligned Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16 font-poppins">
          
          {/* Card 1: CONTACT INFO */}
          <div className="bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(74,65,58,0.04)] flex flex-col justify-between border-t-2 border-[#dfcca5]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#f7f1eb] text-[#1e2617] rounded-full">
                  <MapPin className="w-5 h-5 text-[#1e2617]" strokeWidth={1.6} />
                </div>
                <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-[#1e2617] font-belleza text-lg">
                  CONTACT
                </h3>
              </div>

              <p className="text-sm font-light text-neutral-700 leading-relaxed mb-4">
                Geo Centre, Chakkaraparambu, <br />
                Vennala, Kochi, Kerala – 682032
              </p>

              <div className="flex flex-col gap-1.5 text-sm font-light text-neutral-800">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#dfcca5]" strokeWidth={1.8} />
                  <span>P: +91 8547977486</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#dfcca5]" strokeWidth={1.8} />
                  <span>E: Info@thecolorpalette.in</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: WORKING HOURS */}
          <div className="bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(74,65,58,0.04)] flex flex-col justify-between border-t-2 border-[#dfcca5]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#f7f1eb] text-[#1e2617] rounded-full">
                  <Clock className="w-5 h-5 text-[#1e2617]" strokeWidth={1.6} />
                </div>
                <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-[#1e2617] font-belleza text-lg">
                  WORKING HOURS
                </h3>
              </div>

              <div className="space-y-3 text-sm font-light text-neutral-700">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <span>Monday – Sunday:</span>
                  <span className="font-medium text-[#1e2617]">10:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <span>Operating Schedule:</span>
                  <span className="font-medium text-[#1e2617]">Open All Days (7 Days)</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-xs text-[#dfcca5] font-medium">
                  <span>✦ Appointments Preferred</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: FOLLOW US */}
          <div className="bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(74,65,58,0.04)] flex flex-col justify-between border-t-2 border-[#dfcca5]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#f7f1eb] text-[#1e2617] rounded-full">
                  <Share2 className="w-5 h-5 text-[#1e2617]" strokeWidth={1.6} />
                </div>
                <h3 className="text-sm font-medium tracking-[0.2em] uppercase text-[#1e2617] font-belleza text-lg">
                  FOLLOW US
                </h3>
              </div>

              <p className="text-sm font-light text-neutral-700 leading-relaxed mb-6">
                Connect with us on social media for daily beauty inspiration, bridal transformations, and exclusive offers.
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/the_color_palette_aesthetics"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-all duration-300 transform hover:scale-105"
                >
                  <IconInstagram />
                </a>
                <a
                  href="#"
                  aria-label="X"
                  className="w-10 h-10 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-all duration-300 transform hover:scale-105"
                >
                  <IconX />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-all duration-300 transform hover:scale-105"
                >
                  <IconFacebook />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full border border-[#1e2617] flex items-center justify-center text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] transition-all duration-300 transform hover:scale-105"
                >
                  <IconLinkedin />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Embedded Google Map Section */}
        <div className="w-full">
          <div className="text-center mb-6">
            <h3 className="font-belleza text-xl sm:text-2xl font-light uppercase tracking-wider text-[#1e2617]">
              OUR LOCATION
            </h3>
          </div>

          <div className="w-full h-[350px] sm:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-black/10">
            <iframe
              title="The Color Palette Location Map"
              src="https://maps.google.com/maps?q=Geo%20Centre%2C%20Chakkaraparambu%2C%20Vennala%2C%20Kochi%2C%20Kerala%20682032&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
