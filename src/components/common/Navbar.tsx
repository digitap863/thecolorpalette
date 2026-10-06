"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NavLink from "./NavLink";

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

const IconInstagram = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconLinkedin = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinksLeft = [
    { name: "Home", path: "/" },
    { name: "About", path: "#about" },
    
  ];

  const navLinksRight = [
    { name: "Services", path: "#services" },
    { name: "Gallery", path: "#gallery" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar near top of page
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide navbar when scrolling DOWN
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Show navbar when scrolling UP
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Full-width sticky white navbar header with hide-on-scroll-down effect */}
      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Far Left: Outlined Contact Us Button */}
          <div className="flex items-center shrink-0">
            <Link
              href="/contact"
              className="px-4 py-2 border border-neutral-800 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Center Cluster: Left Nav Links + Brand Logo + Right Nav Links */}
          <div className="flex items-center gap-6 sm:gap-10 mx-auto">
            {/* Left Nav Links (next to logo) */}
            <nav className="hidden lg:flex items-center gap-6 sm:gap-8">
              {navLinksLeft.map((link) => (
                <NavLink
                  key={link.name}
                  href={link.path}
                  className="text-xs sm:text-sm uppercase tracking-[0.2em] transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Center Brand Logo Image */}
            <Link
              href="/"
              className="flex items-center justify-center group py-1 shrink-0"
            >
              <Image
                src="/Logo/logo.png"
                alt="colorpellet logo"
                width={250}
                height={100}
              className="h-25 sm:h-50 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Right Nav Links (next to logo) */}
            <nav className="hidden lg:flex items-center gap-6 sm:gap-8">
              {navLinksRight.map((link) => (
                <NavLink
                  key={link.name}
                  href={link.path}
                  className="text-xs sm:text-sm uppercase tracking-[0.2em] transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Far Right: Hamburger Menu Button */}
          <div className="flex items-center justify-end shrink-0">
            <button
              onClick={toggleSidebar}
              className="p-2 text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
              aria-label="Open menu drawer"
            >
              <Menu size={28} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer div to prevent content clipping under fixed header */}
      <div className="h-20 w-full" />

      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Right Sidebar Drawer with #f7f1eb background */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-[380px] sm:max-w-[420px] bg-[#f7f1eb] text-neutral-900 shadow-2xl transform transition-transform duration-400 ease-in-out flex flex-col p-8 sm:p-12 overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button at top right */}
        <div className="flex justify-end w-full mb-12">
          <button
            onClick={closeSidebar}
            className="p-2 text-neutral-800 hover:text-black transition-colors rounded-full border border-neutral-300 hover:border-neutral-800 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>

        {/* Sidebar Navigation Links (Mobile Only - Hidden on Desktop) */}
        <nav className="flex flex-col gap-4 mb-12 border-b border-neutral-300/60 pb-8 lg:hidden">
          {[...navLinksLeft, ...navLinksRight].map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={closeSidebar}
              className="text-lg uppercase tracking-[0.2em] font-light text-neutral-900 hover:text-amber-800 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CONTACT Section */}
        <div className="mb-12">
          <h3 className="text-sm font-medium tracking-[0.25em] uppercase text-neutral-900 mb-6">
            CONTACT
          </h3>
          <p className="text-base font-light text-neutral-800 leading-relaxed">
           Geo Centre, Chakkaraparambu, <br />
            Vennala, Kochi, Kerala – 682032
          </p>
          <div className="mt-6 flex flex-col gap-1 text-base font-light text-neutral-800">
            <p>P: +91 8547977486</p>
            <p>E: Info@thecolorpalette.in</p>
          </div>
        </div>

        {/* FOLLOW Section with Circular Social Icons */}
        <div>
          <h3 className="text-sm font-medium tracking-[0.25em] uppercase text-neutral-900 mb-6">
            FOLLOW
          </h3>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/the_color_palette_aesthetics"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-[#f7f1eb] transition-colors"
            >
              <IconInstagram />
            </a>
            <a
              href="#"
              aria-label="X"
              className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-[#f7f1eb] transition-colors"
            >
              <IconX />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-[#f7f1eb] transition-colors"
            >
              <IconFacebook />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-[#f7f1eb] transition-colors"
            >
              <IconLinkedin />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;