"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLink from "./NavLink";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinksLeft = [
        { name: "About", path: "#" },
        { name: "Shop", path: "#" },
        { name: "Collection", path: "#" },
    ];
    const navLinksRight = [
        { name: "Contact Us", path: "#" },
        { name: "Bag(00)", path: "#" },

    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className="w-full z-100 fixed px-4 md:px-10">
                <div className="text-white flex items-center justify-between md:justify-center w-full font-heading py-5">

                    {/* Mobile Top Bar — Logo left, Burger right */}
                    <Link href="/" className="md:hidden flex items-center gap-2">
                        <Image
                            src="/images/logo.png"
                            width={64}
                            height={60}
                            alt="logo"
                        />
                    </Link>

                    {/* Desktop Navigation - unchanged */}
                    <nav className="relative py-1 w-7xl justify-between items-center px-1.5 bg-[#0D0C0C]/50 rounded-full gap-1 hidden md:flex pl-8 pr-4">
                        {/* Left */}
                        <div className="flex items-center gap-10">
                            {navLinksLeft.map((link) => (
                                <NavLink
                                    key={link.path}
                                    href={link.path}
                                    className="text-[16px] py-8 px-4 uppercase"
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        {/* Center Logo */}
                        <Link
                            href="/"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <Image
                                className="h-[85px] w-[112px]"
                                src="/images/logo.png"
                                width={112}
                                height={85}
                                alt="logo"
                            />
                        </Link>

                        {/* Right */}
                        <div className="flex items-center gap-10">
                            {navLinksRight.map((link) => (
                                <NavLink
                                    key={link.path}
                                    href={link.path}
                                    className="text-[16px] py-8 px-4 uppercase"
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </nav>

                    {/* Mobile Hamburger Icon */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden text-white p-2"
                        aria-label="Toggle menu"
                    >
                        <Menu size={28} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-[#271F16]/80 backdrop-blur-sm z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Sidebar Menu */}
            <div
                className={`md:hidden fixed top-0 z-150 left-0 h-full w-[85%] max-w-[360px] bg-[#271F16] shadow-2xl transform transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${isMobileMenuOpen ? "translate-x-0 visible" : "-translate-x-full invisible"
                    }`}
            >
                {/* Decorative top accent line */}
                <div className="h-[3px] w-full bg-linear-to-r from-[#88631A] via-[#F69B00] to-[#88631A]" />

                {/* Sidebar Header — Logo + Close */}
                <div className="flex items-center justify-between px-6 py-5">
                    <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3">
                        <Image
                            src="/images/logo.png"
                            width={44}
                            height={40}
                            alt="logo"
                            className="shrink-0"
                        />
                    </Link>
                    <button
                        onClick={closeMobileMenu}
                        className="text-white/70 p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all active:scale-95"
                        aria-label="Close menu"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-white/8" />

                {/* Navigation Links */}
                <nav className="flex flex-col px-4 py-6 gap-1">
                    {navLinksRight.map((link, index) => (
                        <div
                            key={link.path}
                            onClick={closeMobileMenu}
                            style={{
                                animation: isMobileMenuOpen
                                    ? `sidebarSlideIn 0.35s ease-out ${index * 0.06}s both`
                                    : "none",
                            }}
                        >
                            <Link
                                href={link.path}
                                className="group flex items-center gap-3 font-sans py-3.5 px-4 rounded-xl text-white/80 text-[15px] font-medium tracking-wide hover:bg-white/5 hover:text-white transition-all"
                            >
                                <span className="w-1 h-1 rounded-full bg-[#F69B00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                {link.name}
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Divider */}
                <div className="mx-6 h-px bg-white/8" />

                <div
                    className="px-6 pt-6"
                    style={{
                        animation: isMobileMenuOpen
                            ? `sidebarSlideIn 0.35s ease-out ${navLinksRight.length * 0.06 + 0.15}s both`
                            : "none",
                    }}
                >
                    <Link
                        href="/contactus"
                        onClick={closeMobileMenu}
                        className="bg-linear-to-br from-[#ffffff]/80 to-[#d3d3d3]/10 p-px rounded-full block"
                    >
                        <div className="py-3.5 text-base text-white font-sans font-semibold text-center bg-linear-to-r from-[#88631A] to-[#F69B00] rounded-full active:scale-[0.98] transition-transform">
                            Contact Us
                        </div>
                    </Link>
                </div>

                {/* Contact Info Footer */}
                <div
                    className="px-6 pt-8 pb-10 mt-auto"
                    style={{
                        animation: isMobileMenuOpen
                            ? `sidebarSlideIn 0.35s ease-out ${navLinksRight.length * 0.06 + 0.25}s both`
                            : "none",
                    }}
                >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-sans mb-4">
                        Get in touch
                    </p>
                    <div className="flex flex-col gap-3 text-white/50 text-[13px] font-sans">
                        <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-white/70 transition-colors">
                            <svg className="w-4 h-4 text-[#F69B00] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            +91 98765 43210
                        </a>
                        <a href="mailto:info@bluepeak.com" className="flex items-center gap-2.5 hover:text-white/70 transition-colors">
                            <svg className="w-4 h-4 text-[#F69B00] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            info@bluepeak.com
                        </a>
                    </div>

                    {/* Faded logo watermark */}
                    <div className="mt-8 flex justify-center">
                        <Image
                            src="/images/logo.png"
                            width={40}
                            height={36}
                            alt="logo"
                            className="opacity-15"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes sidebarSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;