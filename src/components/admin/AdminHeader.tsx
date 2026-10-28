"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ExternalLink,
  Logout,
  ShieldCheck,
  User,
  Image as ImageIcon,
  Layers,
  Menu,
  X,
} from "lucide-react";

interface AdminHeaderProps {
  admin?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlelogo_newut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logo_newut", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("logo_newut failed:", err);
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      name: "Services",
      href: "/services",
      icon: Layers,
      external: true,
    },
    {
      name: "Gallery",
      href: "/gallery",
      icon: ImageIcon,
      external: true,
    },
    {
      name: "Client Website",
      href: "/",
      icon: ExternalLink,
      external: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f7f1eb]/95 backdrop-blur-md border-b border-[#c2a878]/30 text-[#1c1917] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Studio Brand */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#c2a878]/35 flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105">
                <Image
                  src="/logo_new.png"
                  alt="The Color Palette"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-poppins text-base sm:text-lg tracking-[0.15em] uppercase text-[#1c1917] leading-tight font-medium">
                  The Color Palette
                </span>
                <span className="font-poppins text-[10px] uppercase tracking-[0.2em] text-[#8c6d36] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Admin Suite
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 ml-8 pl-8 border-l border-[#c2a878]/25">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs uppercase tracking-[0.15em] font-poppins transition-all ${link.active
                        ? "bg-[#1c1917] text-[#f7f1eb] font-semibold shadow-xs"
                        : "text-[#1c1917]/70 hover:text-[#1c1917] hover:bg-black/5"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Admin Profile & logo_newut */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Admin Badge */}
            <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white border border-[#c2a878]/30 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#c2a878]/20 text-[#8c6d36] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-poppins text-xs text-[#1c1917] font-semibold tracking-wide leading-tight">
                  {admin?.name || "Administrator"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#1c1917]/60">
                    {admin?.email || "admin"}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c2a878]/25 text-[#7a5f2a] font-bold">
                    {admin?.role || "Admin"}
                  </span>
                </div>
              </div>
            </div>

            {/* logo_newut Button */}
            <button
              onClick={handlelogo_newut}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all text-xs font-poppins uppercase tracking-[0.15em] font-medium disabled:opacity-50 cursor-pointer shadow-2xs"
              title="Sign Out"
            >
              <logo_newut className="w-3.5 h-3.5" />
              <span>{loggingOut ? "Exiting..." : "Log Out"}</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white text-[#1c1917] border border-[#c2a878]/30"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-[#c2a878]/20 space-y-3">
            <div className="px-3 py-2.5 rounded-lg bg-white border border-[#c2a878]/20 text-xs font-poppins text-[#1c1917]/80">
              <span className="font-semibold text-[#1c1917] block">
                {admin?.name || "Administrator"}
              </span>
              <span className="text-[11px] text-[#1c1917]/60 block font-mono">
                {admin?.email}
              </span>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-poppins text-[#1c1917] hover:bg-black/5"
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={handlelogo_newut}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-poppins uppercase tracking-wider"
            >
              <logo_newut className="w-4 h-4" />
              <span>{loggingOut ? "Exiting..." : "Log Out"}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
