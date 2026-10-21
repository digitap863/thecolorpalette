import { getCurrentAdmin } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import ServiceCategory from "@/models/ServiceCategory";
import GalleryImage from "@/models/GalleryImage";
import BannerSlide from "@/models/BannerSlide";
import Link from "next/link";
import {
  Calendar,
  Layers,
  FolderTree,
  Image as ImageIcon,
  SlidersHorizontal,
  ExternalLink,
  Plus,
  Phone,
  ArrowRight,
  ArrowUpRight,
  Settings,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  await dbConnect();

  // Fetch operational statistics from database
  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalServices,
    activeServices,
    totalCategories,
    totalGallery,
    totalBanners,
    activeBanners,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments().catch(() => 0),
    Booking.countDocuments({ status: "pending" }).catch(() => 0),
    Booking.countDocuments({ status: "confirmed" }).catch(() => 0),
    Booking.countDocuments({ status: "completed" }).catch(() => 0),
    Booking.countDocuments({ status: "cancelled" }).catch(() => 0),
    Service.countDocuments().catch(() => 0),
    Service.countDocuments({ isActive: true }).catch(() => 0),
    ServiceCategory.countDocuments().catch(() => 0),
    GalleryImage.countDocuments().catch(() => 0),
    BannerSlide.countDocuments().catch(() => 0),
    BannerSlide.countDocuments({ isActive: true }).catch(() => 0),
    Booking.find().sort({ createdAt: -1 }).limit(6).lean().catch(() => []),
  ]);

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const statCards = [
    {
      label: "Total Bookings",
      value: totalBookings,
      subtitle:
        pendingBookings > 0
          ? `${pendingBookings} awaiting confirmation`
          : "All inquiries handled",
      isPending: pendingBookings > 0,
      icon: Calendar,
      href: "/admin/bookings",
    },
    {
      label: "Services",
      value: totalServices,
      subtitle: `${activeServices} active · ${totalCategories} categories`,
      icon: Layers,
      href: "/admin/services",
    },
    {
      label: "Hero Banners",
      value: activeBanners,
      subtitle: `${totalBanners} total slides`,
      icon: SlidersHorizontal,
      href: "/admin/banners",
    },
    {
      label: "Gallery Media",
      value: totalGallery,
      subtitle: "Showcase portfolio images",
      icon: ImageIcon,
      href: "/admin/gallery",
    },
  ];

  const quickActions = [
    {
      title: "Add Service",
      description: "Publish a new clinic procedure",
      href: "/admin/services",
      icon: Plus,
    },
    {
      title: "Review Appointments",
      description:
        pendingBookings > 0
          ? `${pendingBookings} new requests pending review`
          : "Check upcoming client schedule",
      href: "/admin/bookings",
      badge: pendingBookings > 0 ? `${pendingBookings} pending` : undefined,
      icon: Calendar,
    },
    {
      title: "Manage Hero Banners",
      description: "Update homepage banners and promotion slides",
      href: "/admin/banners",
      icon: SlidersHorizontal,
    },
    {
      title: "Service Categories",
      description: "Organize service tracks and categories",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      title: "Clinic Settings",
      description: "Toggle Free Doctor Consultation & manage promotional text",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="font-poppins space-y-7">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#1c1917]/60 mb-1">
            <span className="font-medium text-[#8c6d36]">The Color Palette</span>
            <span>·</span>
            <span>{todayStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1c1917] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#1c1917]/70 mt-0.5">
            Welcome back, {admin?.name || "Administrator"}. Here is what is happening today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f7f1eb] border border-[#c2a878]/35 text-[#1c1917] text-xs font-medium transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8c6d36]" />
            <span>View Live Site</span>
          </Link>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1917] hover:bg-[#2d2926] text-[#f7f1eb] text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#c2a878]" />
            <span>New Service</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group block p-5 rounded-2xl bg-white border border-[#c2a878]/30 hover:border-[#c2a878]/70 hover:shadow-md transition-all duration-200 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-[#1c1917]/60">
                  {card.label}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#f7f1eb] border border-[#c2a878]/30 text-[#8c6d36] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 text-3xl font-semibold tracking-tight text-[#1c1917]">
                {card.value}
              </div>

              <div className="mt-1.5 flex items-center gap-1.5">
                {card.isPending && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                )}
                <span
                  className={`text-xs truncate ${
                    card.isPending
                      ? "text-amber-800 font-semibold"
                      : "text-[#1c1917]/60"
                  }`}
                >
                  {card.subtitle}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-Column Grid: Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Bookings Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#c2a878]/30 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#c2a878]/20">
            <div>
              <h2 className="text-base font-semibold text-[#1c1917]">
                Recent Appointments
              </h2>
              <p className="text-xs text-[#1c1917]/60 mt-0.5">
                Latest client bookings submitted through the booking form
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-[#8c6d36] hover:text-[#5d461e] flex items-center gap-1 transition-colors"
            >
              <span>View all ({totalBookings})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center text-center p-8 rounded-xl bg-[#f7f1eb]/50 border border-dashed border-[#c2a878]/30">
              <Calendar className="w-8 h-8 text-[#8c6d36]/50 mb-2" />
              <p className="text-xs font-semibold text-[#1c1917]">
                No appointment requests yet
              </p>
              <p className="text-[11px] text-[#1c1917]/60 max-w-xs mt-1">
                When clients request an appointment online, it will show up here immediately.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#1c1917]/50 uppercase tracking-wider text-[10px] font-semibold border-b border-[#c2a878]/20">
                    <th className="pb-3 pr-4 font-medium">Client</th>
                    <th className="pb-3 pr-4 font-medium">Service</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c2a878]/15">
                  {recentBookings.map((b: any) => (
                    <tr
                      key={b._id.toString()}
                      className="hover:bg-[#f7f1eb]/50 transition-colors group"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-[#1c1917]">
                          {b.name}
                        </div>
                        <a
                          href={`tel:${b.phone}`}
                          className="inline-flex items-center gap-1 text-[11px] text-[#1c1917]/60 hover:text-[#8c6d36] font-mono mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-[#8c6d36]" />
                          {b.phone}
                        </a>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#f7f1eb] text-[#1c1917] border border-[#c2a878]/30 text-[11px] font-medium truncate max-w-[170px]">
                          {b.service}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-[#1c1917]/70 whitespace-nowrap">
                        {b.date || "—"}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            b.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                              : b.status === "cancelled"
                              ? "bg-rose-50 text-rose-800 border border-rose-300"
                              : b.status === "completed"
                              ? "bg-stone-100 text-stone-800 border border-stone-300"
                              : "bg-amber-50 text-amber-800 border border-amber-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              b.status === "confirmed"
                                ? "bg-emerald-600"
                                : b.status === "cancelled"
                                ? "bg-rose-600"
                                : b.status === "completed"
                                ? "bg-stone-600"
                                : "bg-amber-600"
                            }`}
                          />
                          <span className="capitalize">{b.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href="/admin/bookings"
                          className="inline-flex items-center text-[#8c6d36] hover:text-[#1c1917] text-xs font-semibold"
                          title="View booking"
                        >
                          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Quick Actions & Appointments Breakdown */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-[#1c1917] mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f7f1eb] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#f7f1eb] border border-[#c2a878]/30 text-[#8c6d36] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#1c1917] group-hover:text-[#f7f1eb] group-hover:border-[#1c1917] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-[#1c1917] truncate">
                          {item.title}
                        </p>
                        {item.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#1c1917]/60 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bookings Status Distribution */}
          <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#1c1917]">
                Bookings Pipeline
              </h3>
              <span className="text-xs font-mono text-[#8c6d36] font-semibold">
                {totalBookings} Total
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[#1c1917]/75 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Pending Action
                  </span>
                  <span className="font-semibold text-[#1c1917]">
                    {pendingBookings}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f7f1eb] rounded-full overflow-hidden border border-[#c2a878]/20">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{
                      width: totalBookings
                        ? `${(pendingBookings / totalBookings) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#1c1917]/75 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Confirmed
                  </span>
                  <span className="font-semibold text-[#1c1917]">
                    {confirmedBookings}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f7f1eb] rounded-full overflow-hidden border border-[#c2a878]/20">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{
                      width: totalBookings
                        ? `${(confirmedBookings / totalBookings) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#1c1917]/75 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-stone-500" />
                    Completed
                  </span>
                  <span className="font-semibold text-[#1c1917]">
                    {completedBookings}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f7f1eb] rounded-full overflow-hidden border border-[#c2a878]/20">
                  <div
                    className="h-full bg-stone-500 rounded-full transition-all"
                    style={{
                      width: totalBookings
                        ? `${(completedBookings / totalBookings) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#1c1917]/75 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Cancelled
                  </span>
                  <span className="font-semibold text-[#1c1917]">
                    {cancelledBookings}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f7f1eb] rounded-full overflow-hidden border border-[#c2a878]/20">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all"
                    style={{
                      width: totalBookings
                        ? `${(cancelledBookings / totalBookings) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
