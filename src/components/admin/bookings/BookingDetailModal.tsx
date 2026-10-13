"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  Phone,
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Trash2,
  Loader2,
  Send,
} from "lucide-react";
import { BookingItem, BookingStatus } from "./types";

interface BookingDetailModalProps {
  booking: BookingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: BookingStatus) => Promise<void>;
  onDeleteRequest: (booking: BookingItem) => void;
}

export default function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onStatusChange,
  onDeleteRequest,
}: BookingDetailModalProps) {
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !booking) return null;

  const handleStatusClick = async (status: BookingStatus) => {
    if (status === booking.status) return;
    setUpdating(true);
    try {
      await onStatusChange(booking.id, status);
    } finally {
      setUpdating(false);
    }
  };

  // Clean phone for WhatsApp (digits only)
  const cleanPhone = booking.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${booking.name}, thank you for contacting The Color Palette Aesthetic Studio regarding your appointment request for ${booking.service}.`
  )}`;

  const formattedCreated = booking.createdAt
    ? new Date(booking.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-[#c2a878]/35 shadow-2xl overflow-hidden my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#c2a878]/25 flex items-center justify-between bg-[#f7f1eb]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#c2a878]/35 text-[#8c6d36] flex items-center justify-center shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-belleza text-lg uppercase tracking-wider text-[#1c1917]">
                Appointment Details
              </h2>
              <p className="font-poppins text-xs text-[#1c1917]/60">
                Submitted on {formattedCreated}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-white/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 font-poppins">
          {/* Client Header Card */}
          <div className="p-4 rounded-2xl bg-[#f7f1eb]/40 border border-[#c2a878]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-belleza tracking-wider text-[#1c1917]/50 font-semibold block">
                Client Name
              </span>
              <h3 className="font-belleza text-xl text-[#1c1917] font-semibold tracking-wide">
                {booking.name}
              </h3>
            </div>

            {/* Quick Status Tag */}
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase font-belleza font-semibold tracking-wider ${
                  booking.status === "confirmed"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : booking.status === "completed"
                    ? "bg-sky-100 text-sky-800 border border-sky-300"
                    : booking.status === "cancelled"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                }`}
              >
                {booking.status === "confirmed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                {booking.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                {booking.status === "cancelled" && <XCircle className="w-3.5 h-3.5" />}
                <span>{booking.status}</span>
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone & Direct Contact */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <span className="text-[10px] uppercase font-belleza tracking-wider text-stone-500 font-semibold">
                Contact Phone
              </span>
              <p className="font-mono text-sm font-semibold text-stone-900">
                {booking.phone}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${booking.phone}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-belleza uppercase tracking-wider hover:bg-black transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-belleza uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Requested Service */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
              <span className="text-[10px] uppercase font-belleza tracking-wider text-stone-500 font-semibold">
                Treatment Requested
              </span>
              <p className="font-belleza text-sm font-semibold text-[#1c1917] flex items-center gap-1.5 pt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8c6d36]" />
                <span>{booking.service}</span>
              </p>
              <p className="text-[11px] text-stone-500 pt-1">
                Preferred Date: <strong className="text-stone-800">{booking.date}</strong>
              </p>
            </div>
          </div>

          {/* Client Message */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-500 text-[10px] uppercase font-belleza tracking-wider font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Client Notes / Special Inquiries</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed italic bg-white p-3 rounded-lg border border-stone-200/80">
              {booking.message ? `"${booking.message}"` : "No special notes provided."}
            </p>
          </div>

          {/* Status Changer Actions */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <span className="text-[10px] uppercase font-belleza tracking-wider text-stone-500 font-semibold block">
              Update Appointment Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                disabled={updating || booking.status === "pending"}
                onClick={() => handleStatusClick("pending")}
                className={`py-2 px-3 rounded-xl text-xs font-belleza uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  booking.status === "pending"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "border border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                disabled={updating || booking.status === "confirmed"}
                onClick={() => handleStatusClick("confirmed")}
                className={`py-2 px-3 rounded-xl text-xs font-belleza uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  booking.status === "confirmed"
                    ? "bg-emerald-600 text-white"
                    : "border border-stone-200 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                Confirm
              </button>
              <button
                type="button"
                disabled={updating || booking.status === "completed"}
                onClick={() => handleStatusClick("completed")}
                className={`py-2 px-3 rounded-xl text-xs font-belleza uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  booking.status === "completed"
                    ? "bg-sky-600 text-white"
                    : "border border-stone-200 text-stone-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                Complete
              </button>
              <button
                type="button"
                disabled={updating || booking.status === "cancelled"}
                onClick={() => handleStatusClick("cancelled")}
                className={`py-2 px-3 rounded-xl text-xs font-belleza uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  booking.status === "cancelled"
                    ? "bg-red-600 text-white"
                    : "border border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-700"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDeleteRequest(booking);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-belleza uppercase tracking-wider font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-belleza uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
