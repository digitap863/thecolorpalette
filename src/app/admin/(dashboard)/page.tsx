import { getCurrentAdmin } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import ServiceCategory from "@/models/ServiceCategory";
import GalleryImage from "@/models/GalleryImage";
import Link from "next/link";
import {
  Calendar,
  Layers,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  Shield,
  Activity,
  ArrowUpRight,
  Phone,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  await dbConnect();

  // Fetch live stats from database
  const [
    totalBookings,
    pendingBookings,
    totalServices,
    activeServices,
    totalCategories,
    totalGallery,
    recentBookings,
  ] = await Promise.all([
    Booking.countDocuments().catch(() => 0),
    Booking.countDocuments({ status: "pending" }).catch(() => 0),
    Service.countDocuments().catch(() => 0),
    Service.countDocuments({ isActive: true }).catch(() => 0),
    ServiceCategory.countDocuments().catch(() => 0),
    GalleryImage.countDocuments().catch(() => 0),
    Booking.find().sort({ createdAt: -1 }).limit(6).lean().catch(() => []),
  ]);

  const statCards = [
    {
      title: "Client Bookings",
      value: totalBookings,
      subtitle: `${pendingBookings} awaiting confirmation`,
      icon: Calendar,
      color: "from-amber-50/90 to-amber-100/40",
      accent: "text-amber-800 bg-amber-100/90",
    },
    {
      title: "Clinical Services",
      value: totalServices,
      subtitle: `${activeServices} currently published`,
      icon: Layers,
      color: "from-stone-50/90 to-stone-100/60",
      accent: "text-stone-800 bg-stone-200/80",
    },
    {
      title: "Service Categories",
      value: totalCategories,
      subtitle: "Organized treatment tracks",
      icon: Sparkles,
      color: "from-[#f7f1eb] to-[#dfcca5]/30",
      accent: "text-[#7a5f2a] bg-[#dfcca5]/50",
    },
    {
      title: "Gallery Showcase",
      value: totalGallery,
      subtitle: "Portfolio images live",
      icon: ImageIcon,
      color: "from-sky-50/90 to-sky-100/40",
      accent: "text-sky-800 bg-sky-100/90",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#c2a878]/35 p-6 sm:p-8 shadow-xs">
        {/* Soft background glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#dfcca5]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c2a878]/20 border border-[#c2a878]/40 text-[#7a5f2a] text-xs font-poppins font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#c2a878] animate-pulse" />
              Authenticated Session Live
            </div>
            <h1 className="font-belleza text-2xl sm:text-4xl text-[#1c1917] tracking-[0.08em] uppercase">
              Welcome back, {admin?.name || "Administrator"}
            </h1>
            <p className="mt-1 font-poppins text-xs sm:text-sm text-[#1c1917]/70 font-light max-w-xl">
              Welcome to the administrative portal for The Color Palette. Manage treatments, monitor appointment requests, and oversee clinical media.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f7f1eb] hover:bg-[#ecd7b6]/30 border border-[#c2a878]/40 text-[#1c1917] text-xs font-belleza uppercase tracking-[0.15em] font-medium transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </Link>
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-belleza uppercase tracking-[0.15em] font-medium transition-all shadow-md shadow-stone-900/15"
            >
              <span>Manage Treatments</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const href =
            card.title === "Clinical Services"
              ? "/admin/services"
              : card.title === "Gallery Showcase"
              ? "/admin/gallery"
              : card.title === "Service Categories"
              ? "/admin/categories"
              : "/admin/bookings";

          return (
            <Link
              key={card.title}
              href={href}
              className={`block rounded-2xl p-5 bg-gradient-to-br ${card.color} bg-white border border-[#c2a878]/30 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md duration-200 cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-belleza text-xs uppercase tracking-[0.15em] text-[#1c1917]/75 font-semibold group-hover:text-[#1c1917]">
                  {card.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.accent} transition-transform group-hover:scale-110`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-belleza text-3xl font-light text-[#1c1917] tracking-wide mb-1">
                {card.value}
              </div>
              <p className="font-poppins text-[11px] text-[#1c1917]/65">
                {card.subtitle}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Recent Bookings & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Recent Bookings */}
        <div id="recent-appointments" className="lg:col-span-2 rounded-2xl bg-white border border-[#c2a878]/30 p-6 shadow-xs flex flex-col scroll-mt-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-belleza text-xl uppercase tracking-[0.1em] text-[#1c1917]">
                Recent Appointments
              </h2>
              <p className="font-poppins text-xs text-[#1c1917]/65">
                Latest client bookings submitted through the online booking system
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/admin/bookings"
                className="text-xs font-belleza uppercase tracking-wider font-semibold text-[#8c6d36] hover:text-[#5d461e] hover:underline"
              >
                View All &rarr;
              </Link>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-poppins bg-[#c2a878]/20 text-[#7a5f2a] border border-[#c2a878]/30 font-semibold">
                Live Feed
              </span>
            </div>
          </div>

          {recentBookings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-xl bg-[#f7f1eb]/60 border border-dashed border-[#c2a878]/30">
              <Calendar className="w-10 h-10 text-[#8c6d36]/40 mb-3" />
              <p className="font-belleza text-base uppercase text-[#1c1917] tracking-wider font-semibold">
                No Bookings Yet
              </p>
              <p className="font-poppins text-xs text-[#1c1917]/60 max-w-sm mt-1">
                When clients submit appointments via the public booking form, they will appear right here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-poppins">
                <thead>
                  <tr className="border-b border-[#c2a878]/25 text-[#1c1917]/60 uppercase tracking-wider text-[10px] font-belleza">
                    <th className="pb-3 font-normal">Client</th>
                    <th className="pb-3 font-normal">Service</th>
                    <th className="pb-3 font-normal">Preferred Date</th>
                    <th className="pb-3 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c2a878]/15">
                  {recentBookings.map((b: any) => (
                    <tr
                      key={b._id.toString()}
                      className="hover:bg-[#f7f1eb]/50 transition-colors"
                    >
                      <td className="py-3.5 pr-3">
                        <div className="font-medium text-[#1c1917]">{b.name}</div>
                        <div className="flex items-center gap-1 text-[11px] text-[#1c1917]/60 font-mono mt-0.5">
                          <Phone className="w-3 h-3" />
                          {b.phone}
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#f7f1eb] border border-[#c2a878]/30 text-[#1c1917] text-[11px] font-medium">
                          {b.service}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 text-[#1c1917]/75">
                        {b.date || "Not specified"}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider ${
                            b.status === "confirmed"
                              ? "bg-stone-900 text-[#f7f1eb] border border-stone-800"
                              : b.status === "cancelled"
                              ? "bg-red-50 text-red-800 border border-red-300"
                              : b.status === "completed"
                              ? "bg-blue-50 text-blue-800 border border-blue-300"
                              : "bg-amber-50 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Security & System Status */}
        <div className="space-y-6">
          {/* Admin Profile Card */}
          <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#f7f1eb] border border-[#c2a878]/30 flex items-center justify-center text-[#8c6d36]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-belleza text-base uppercase tracking-[0.1em] text-[#1c1917] font-semibold">
                  Session Credential
                </h3>
                <p className="font-poppins text-[11px] text-[#1c1917]/60">
                  Role-based access details
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs font-poppins">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f1eb]/70 border border-[#c2a878]/25">
                <span className="text-[#1c1917]/70">Admin Name</span>
                <span className="font-semibold text-[#1c1917]">
                  {admin?.name}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f1eb]/70 border border-[#c2a878]/25">
                <span className="text-[#1c1917]/70">Email</span>
                <span className="font-mono text-[#1c1917] text-[11px]">
                  {admin?.email}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f1eb]/70 border border-[#c2a878]/25">
                <span className="text-[#1c1917]/70">Access Tier</span>
                <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-[#c2a878]/25 text-[#7a5f2a] font-bold">
                  {admin?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#f7f1eb] border border-[#c2a878]/30 flex items-center justify-center text-[#8c6d36]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-belleza text-base uppercase tracking-[0.1em] text-[#1c1917] font-semibold">
                  Security Architecture
                </h3>
                <p className="font-poppins text-[11px] text-[#1c1917]/60">
                  Authentication & Data Protection
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs font-poppins text-[#1c1917]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8c6d36] shrink-0" />
                <span>Edge & Node JWT Session Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8c6d36] shrink-0" />
                <span>Bcrypt Password Salt & Hashing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8c6d36] shrink-0" />
                <span>HttpOnly & Secure Cookie Session Flag</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8c6d36] shrink-0" />
                <span>Next.js 16 Proxy Route Guard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
