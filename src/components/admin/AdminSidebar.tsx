"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Sparkles,
  Image as ImageIcon,
  SlidersHorizontal,
  ExternalLink,
  LogOut,
  ShieldCheck,
  User,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  admin?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  external?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks: NavSection[] = [
    {
      group: "Management",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          active: pathname === "/admin",
        },
        {
          name: "Hero Banners",
          href: "/admin/banners",
          icon: SlidersHorizontal,
          active: pathname === "/admin/banners" || pathname.startsWith("/admin/banners"),
        },
        {
          name: "Bookings",
          href: "/admin/bookings",
          icon: Calendar,
          active: pathname === "/admin/bookings" || pathname.startsWith("/admin/bookings"),
        },
        {
          name: "Clinical Services",
          href: "/admin/services",
          icon: Layers,
          active: pathname === "/admin/services" || pathname.startsWith("/admin/services"),
        },
        {
          name: "Service Categories",
          href: "/admin/categories",
          icon: Sparkles,
          active: pathname === "/admin/categories" || pathname.startsWith("/admin/categories"),
        },
        {
          name: "Gallery Showcase",
          href: "/admin/gallery",
          icon: ImageIcon,
          active: pathname === "/admin/gallery" || pathname.startsWith("/admin/gallery"),
        },
      ],
    },
    {
      group: "Live Site",
      items: [
        {
          name: "Client Website",
          href: "/",
          icon: ExternalLink,
          external: true,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-[#1c1917] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#c2a878]/25">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#f7f1eb] border border-[#c2a878]/35 flex items-center justify-center p-2 shadow-xs transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="The Color Palette"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-belleza text-base tracking-[0.14em] uppercase text-[#1c1917] leading-tight font-medium">
              The Color Palette
            </span>
            <span className="font-poppins text-[10px] uppercase tracking-[0.2em] text-[#8c6d36] font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-[#8c6d36]" />
              Admin Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {navLinks.map((section) => (
          <div key={section.group}>
            <p className="px-3 text-[10px] uppercase tracking-[0.2em] font-belleza text-[#1c1917]/50 font-semibold mb-2">
              {section.group}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-[0.14em] font-belleza transition-all duration-150 ${
                      item.active
                        ? "bg-[#1c1917] text-[#f7f1eb] font-semibold shadow-xs"
                        : "text-[#1c1917]/75 hover:text-[#1c1917] hover:bg-[#f7f1eb]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.external && (
                      <ExternalLink className="w-3 h-3 text-[#1c1917]/40" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-4 border-t border-[#c2a878]/25 space-y-3 bg-[#f7f1eb]/40">
        {/* Profile Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#c2a878]/25 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-[#c2a878]/20 text-[#8c6d36] flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-belleza text-xs text-[#1c1917] font-semibold tracking-wide truncate">
              {admin?.name || "Administrator"}
            </p>
            <p className="text-[10px] font-mono text-[#1c1917]/60 truncate">
              {admin?.email}
            </p>
          </div>
          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c2a878]/25 text-[#7a5f2a] font-bold shrink-0">
            {admin?.role || "Admin"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all text-xs font-belleza uppercase tracking-[0.15em] font-medium disabled:opacity-50 cursor-pointer shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 shrink-0 border-r border-[#c2a878]/30 shadow-xs z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-[#c2a878]/30 shadow-xs">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f7f1eb] border border-[#c2a878]/30 flex items-center justify-center p-1">
            <Image
              src="/logo.png"
              alt="Logo"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <span className="font-belleza text-sm uppercase tracking-wider text-[#1c1917] font-semibold">
            Admin Suite
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-[#f7f1eb] text-[#1c1917] border border-[#c2a878]/30"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-[#f7f1eb] text-[#1c1917] border border-[#c2a878]/30"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
