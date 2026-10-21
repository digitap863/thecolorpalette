"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  UserCheck,
  Eye,
  Trash2,
  RefreshCw,
  Send,
  MessageSquare,
  LayoutGrid,
  List,
  AlertCircle,
  ChevronDown,
  Settings,
} from "lucide-react";
import { BookingItem, BookingStatus } from "@/components/admin/bookings/types";
import BookingsStatsBar from "@/components/admin/bookings/BookingsStatsBar";
import BookingDetailModal from "@/components/admin/bookings/BookingDetailModal";
import BookingFormModal from "@/components/admin/bookings/BookingFormModal";
import BookingDeleteModal from "@/components/admin/bookings/BookingDeleteModal";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Promotion Toggle
  const [consultationFreeActive, setConsultationFreeActive] = useState<boolean>(true);
  const [togglingOffer, setTogglingOffer] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "upcoming" | "past">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState<BookingItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch bookings & existing service names
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/services"),
      ]);

      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        setBookings(Array.isArray(bData) ? bData : []);
      }

      if (servicesRes.ok) {
        const sData = await servicesRes.json();
        if (Array.isArray(sData)) {
          setServices(sData.map((s: any) => s.name));
        }
      }
    } catch {
      showToast("error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();

    // Fetch active state of consultation banner
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.freeConsultationActive === "boolean") {
          setConsultationFreeActive(data.freeConsultationActive);
        }
      })
      .catch(() => {});
  }, [fetchBookings]);

  const handleToggleConsultation = async () => {
    if (togglingOffer) return;
    setTogglingOffer(true);
    const nextState = !consultationFreeActive;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freeConsultationActive: nextState }),
      });
      if (res.ok) {
        setConsultationFreeActive(nextState);
        showToast(
          "success",
          nextState
            ? "Doctor Consultation is Free banner is now ACTIVE on website"
            : "Doctor Consultation is Free banner is now HIDDEN from website"
        );
      } else {
        showToast("error", "Failed to update consultation banner setting");
      }
    } catch {
      showToast("error", "Network error updating setting");
    } finally {
      setTogglingOffer(false);
    }
  };

  // Counts by status
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  // Filtered & sorted bookings
  const filteredBookings = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    return bookings.filter((b) => {
      // Status filter
      if (statusFilter !== "all" && b.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter === "today") {
        if (!b.date.includes(todayStr)) return false;
      } else if (dateFilter === "upcoming") {
        if (b.date < todayStr) return false;
      } else if (dateFilter === "past") {
        if (b.date > todayStr) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          b.name.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.service.toLowerCase().includes(q) ||
          (b.message && b.message.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [bookings, statusFilter, dateFilter, searchQuery]);

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      // Also update selected booking if detail modal is open
      setSelectedBooking((prev) =>
        prev && prev.id === id ? { ...prev, status: newStatus } : prev
      );

      showToast("success", `Appointment status updated to ${newStatus}`);
    } catch {
      showToast("error", "Failed to update booking status");
    }
  };

  // Delete Booking
  const handleDeleteBooking = async () => {
    if (!deletingBooking) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${deletingBooking.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete booking");

      setBookings((prev) => prev.filter((b) => b.id !== deletingBooking.id));
      showToast("success", `Booking for ${deletingBooking.name} deleted`);
      setDeletingBooking(null);
    } catch {
      showToast("error", "Failed to delete booking");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Save New Booking
  const handleBookingCreated = (newBooking: BookingItem) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast("success", `Appointment created for ${newBooking.name}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-poppins transition-all border ${
            toast.type === "success"
              ? "bg-[#1c1917] text-[#f7f1eb] border-[#c2a878]/40"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#c2a878]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#c2a878]/35 p-6 sm:p-8 shadow-xs">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#dfcca5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c2a878]/20 border border-[#c2a878]/40 text-[#7a5f2a] text-xs font-poppins font-semibold mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Clinical Scheduling &amp; Appointments</span>
            </div>
            <h1 className="font-poppins text-2xl sm:text-4xl text-[#1c1917] tracking-[0.08em] uppercase">
              Client Bookings
            </h1>
            <p className="mt-1 font-poppins text-xs sm:text-sm text-[#1c1917]/70 font-light max-w-xl">
              Track incoming consultation requests, confirm patient appointments, view clinical notes, and coordinate schedules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f7f1eb] hover:bg-[#ecd7b6]/30 border border-[#c2a878]/40 text-[#1c1917] text-xs font-poppins uppercase tracking-[0.15em] font-medium transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsFormModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-poppins uppercase tracking-[0.15em] font-medium transition-all shadow-md shadow-stone-900/15 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Consultation Notice Bar */}
      <div className="rounded-xl border border-[#c2a878]/30 bg-white px-5 py-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-poppins">
        <div className="flex items-center gap-3">
          <span className="font-semibold uppercase tracking-wider text-[#1c1917]">
            Doctor Consultation Notice:
          </span>
          {consultationFreeActive ? (
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Active on Site
            </span>
          ) : (
            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full">
              Hidden
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          <Link
            href="/admin/settings"
            className="text-xs text-[#8c6d36] hover:underline font-medium"
          >
            Edit text
          </Link>
          <button
            onClick={handleToggleConsultation}
            disabled={togglingOffer}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              consultationFreeActive
                ? "text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-red-50"
                : "text-white bg-[#1c1917] hover:bg-black"
            }`}
          >
            {togglingOffer ? "Updating..." : consultationFreeActive ? "Turn Off" : "Turn On"}
          </button>
        </div>
      </div>

      {/* Live Stats Bar */}
      <BookingsStatsBar bookings={bookings} />

      {/* Search & Status Toolbar */}
      <div className="bg-white rounded-2xl border border-[#c2a878]/30 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Status Tabs with Counters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#c2a878]/20 no-scrollbar">
          {[
            { key: "all", label: "All Bookings", count: counts.all },
            { key: "pending", label: "Pending", count: counts.pending, alert: counts.pending > 0 },
            { key: "confirmed", label: "Confirmed", count: counts.confirmed },
            { key: "completed", label: "Completed", count: counts.completed },
            { key: "cancelled", label: "Cancelled", count: counts.cancelled },
          ].map((tab) => {
            const isSelected = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-poppins uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1c1917] text-[#f7f1eb] shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-[#f7f1eb]/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isSelected
                      ? "bg-[#c2a878] text-[#1c1917]"
                      : tab.alert
                      ? "bg-amber-100 text-amber-800"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by client name, phone, treatment or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-poppins focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Filter Dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-poppins uppercase tracking-wider focus:outline-none focus:border-[#7a5f2a]"
            >
              <option value="all">All Dates</option>
              <option value="today">Today&apos;s Schedule</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clear Filters Banner */}
        {(searchQuery || statusFilter !== "all" || dateFilter !== "all") && (
          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-[#c2a878]/20 font-poppins">
            <span>
              Showing {filteredBookings.length} of {bookings.length} appointments
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setDateFilter("all");
              }}
              className="text-[#8c6d36] hover:underline font-poppins uppercase tracking-wider font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table / Grid Content */}
      {loading ? (
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-16 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-[#8c6d36] animate-spin mb-3" />
          <p className="font-poppins uppercase tracking-wider text-stone-600 text-sm">
            Loading appointments...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#dfcca5]/30 text-[#8c6d36] flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-poppins text-lg uppercase tracking-wider text-[#1c1917]">
            No Bookings Found
          </h3>
          <p className="font-poppins text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
            {bookings.length === 0
              ? "No client appointment requests recorded yet. When clients book online, they will appear here in real time."
              : "No appointments match your active search or filters."}
          </p>
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] text-[#f7f1eb] text-xs font-poppins uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Appointment</span>
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c2a878]/25 bg-[#f7f1eb]/50 text-[10px] uppercase font-poppins tracking-wider text-[#1c1917]/70">
                  <th className="py-3.5 px-4 font-semibold">Client</th>
                  <th className="py-3.5 px-4 font-semibold">Service</th>
                  <th className="py-3.5 px-4 font-semibold">Preferred Date</th>
                  <th className="py-3.5 px-4 font-semibold">Client Notes</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-poppins text-xs">
                {filteredBookings.map((b) => {
                  const cleanPhone = b.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanPhone}`;

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[#f7f1eb]/30 transition-colors group"
                    >
                      {/* Client Name & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1c1917] font-poppins text-sm tracking-wide">
                          {b.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a
                            href={`tel:${b.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-500 hover:text-stone-900 transition-colors"
                            title="Call client"
                          >
                            <Phone className="w-3 h-3 text-[#8c6d36]" />
                            <span>{b.phone}</span>
                          </a>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Open WhatsApp chat"
                          >
                            <Send className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      {/* Requested Service */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#f7f1eb] border border-[#c2a878]/30 text-[#1c1917] text-[11px] font-medium font-poppins uppercase tracking-wider">
                          <span>{b.service}</span>
                        </span>
                      </td>

                      {/* Preferred Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-stone-700">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{b.date || "Not specified"}</span>
                        </div>
                        {b.createdAt && (
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            Booked:{" "}
                            {new Date(b.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p
                          className="line-clamp-2 text-stone-600 text-[11px] leading-relaxed cursor-pointer hover:text-stone-900"
                          onClick={() => setSelectedBooking(b)}
                          title="Click to view full notes"
                        >
                          {b.message ? `"${b.message}"` : (
                            <span className="text-stone-400 italic">No notes</span>
                          )}
                        </p>
                      </td>

                      {/* Interactive Status Selector */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleUpdateStatus(b.id, e.target.value as BookingStatus)
                          }
                          className={`px-2.5 py-1 rounded-full text-[10px] font-poppins uppercase tracking-wider font-semibold border cursor-pointer focus:outline-none transition-colors ${
                            b.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : b.status === "completed"
                              ? "bg-sky-50 text-sky-800 border-sky-300"
                              : b.status === "cancelled"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingBooking(b)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl bg-white border border-[#c2a878]/30 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                {/* Card Top: Client & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-poppins text-base text-[#1c1917] font-semibold tracking-wide">
                      {b.name}
                    </h3>
                    <a
                      href={`tel:${b.phone}`}
                      className="inline-flex items-center gap-1 text-xs font-mono text-stone-500 hover:text-stone-900 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-[#8c6d36]" />
                      <span>{b.phone}</span>
                    </a>
                  </div>

                  <select
                    value={b.status}
                    onChange={(e) =>
                      handleUpdateStatus(b.id, e.target.value as BookingStatus)
                    }
                    className={`px-2.5 py-1 rounded-full text-[10px] font-poppins uppercase tracking-wider font-semibold border cursor-pointer focus:outline-none ${
                      b.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : b.status === "completed"
                        ? "bg-sky-50 text-sky-800 border-sky-300"
                        : b.status === "cancelled"
                        ? "bg-red-50 text-red-800 border-red-300"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Treatment & Date info */}
                <div className="p-3 rounded-xl bg-[#f7f1eb]/40 border border-[#c2a878]/25 space-y-2 mb-3">
                  <div className="text-xs text-[#1c1917] font-poppins uppercase tracking-wider font-semibold">
                    <span>{b.service}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Preferred Date: {b.date || "Not specified"}</span>
                  </div>
                </div>

                {/* Client Notes */}
                {b.message && (
                  <p className="text-[11px] text-stone-600 italic line-clamp-2 mb-4 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    &ldquo;{b.message}&rdquo;
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedBooking(b)}
                  className="inline-flex items-center gap-1 text-xs font-poppins uppercase tracking-wider text-[#8c6d36] hover:underline font-semibold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => setDeletingBooking(b)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete booking"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        onStatusChange={handleUpdateStatus}
        onDeleteRequest={(b) => setDeletingBooking(b)}
      />

      {/* Manual / Walk-in Booking Form Modal */}
      <BookingFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSaved={handleBookingCreated}
        serviceNames={services}
      />

      {/* Delete Confirmation Modal */}
      <BookingDeleteModal
        booking={deletingBooking}
        isOpen={Boolean(deletingBooking)}
        onClose={() => setDeletingBooking(null)}
        onConfirm={handleDeleteBooking}
        loading={deleteLoading}
      />
    </div>
  );
}
