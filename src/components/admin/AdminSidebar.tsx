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
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  admin?: {
    name?: string;
    email?: string;
    role?: string;
  };
  pendingCount?: number;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  external?: boolean;
  badge?: number;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export default function AdminSidebar({ admin, pendingCount }: AdminSidebarProps) {
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
      group: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          active: pathname === "/admin",
        },
        {
          name: "Bookings",
          href: "/admin/bookings",
          icon: Calendar,
          badge: pendingCount && pendingCount > 0 ? pendingCount : undefined,
          active: pathname === "/admin/bookings" || pathname.startsWith("/admin/bookings/"),
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          name: "Services",
          href: "/admin/services",
          icon: Layers,
          active: pathname === "/admin/services" || pathname.startsWith("/admin/services/"),
        },
        {
          name: "Categories",
          href: "/admin/categories",
          icon: Sparkles,
          active: pathname === "/admin/categories" || pathname.startsWith("/admin/categories/"),
        },
        {
          name: "Hero Banners",
          href: "/admin/banners",
          icon: SlidersHorizontal,
          active: pathname === "/admin/banners" || pathname.startsWith("/admin/banners/"),
        },
        {
          name: "Gallery Showcase",
          href: "/admin/gallery",
          icon: ImageIcon,
          active: pathname === "/admin/gallery" || pathname.startsWith("/admin/gallery/"),
        },
      ],
    },
    {
      group: "Storefront",
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
    <div className="flex flex-col h-full bg-white text-[#1c1917] font-poppins select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#c2a878]/30">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#f7f1eb] border border-[#c2a878]/30 flex items-center justify-center p-2 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="The Color Palette"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[#1c1917] leading-tight truncate tracking-wide">
              The Color Palette
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-[#8c6d36] mt-0.5">
              Admin Suite
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
        {navLinks.map((section) => (
          <div key={section.group}>
            <p className="px-3 text-[11px] uppercase tracking-wider text-[#1c1917]/50 font-semibold mb-2">
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
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      item.active
                        ? "bg-[#1c1917] text-[#f7f1eb] font-semibold shadow-xs"
                        : "text-[#1c1917]/75 hover:text-[#1c1917] hover:bg-[#f7f1eb]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.active
                            ? "text-[#c2a878]"
                            : "text-[#1c1917]/50 group-hover:text-[#1c1917]"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.active
                            ? "bg-[#c2a878] text-[#1c1917]"
                            : "bg-[#c2a878]/30 text-[#8c6d36]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : item.external ? (
                      <ExternalLink className="w-3.5 h-3.5 text-[#1c1917]/40 group-hover:text-[#1c1917]" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Profile & Logout Footer */}
      <div className="p-3.5 border-t border-[#c2a878]/30 bg-[#f7f1eb]/40">
        <div className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white border border-[#c2a878]/25 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#c2a878]/20 text-[#8c6d36] font-semibold text-xs flex items-center justify-center shrink-0">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-[#1c1917] truncate">
                {admin?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-[#1c1917]/60 truncate font-mono">
                {admin?.email || "admin@system"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-[#1c1917]/50 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-68 h-screen sticky top-0 shrink-0 border-r border-[#c2a878]/30 shadow-xs z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-[#c2a878]/30 shadow-xs font-poppins">
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
          <span className="text-sm font-semibold tracking-wide text-[#1c1917]">
            The Color Palette
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
        <div className="md:hidden fixed inset-0 z-50 flex font-poppins">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
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
