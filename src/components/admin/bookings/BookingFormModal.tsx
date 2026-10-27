"use client";

import { useState, useEffect } from "react";
import { X, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { BookingItem, BookingFormData, BookingStatus } from "./types";

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (booking: BookingItem) => void;
  serviceNames: string[];
}

const DEFAULT_FORM: BookingFormData = {
  name: "",
  phone: "",
  date: new Date().toISOString().split("T")[0],
  service: "",
  message: "",
  status: "confirmed",
};

export default function BookingFormModal({
  isOpen,
  onClose,
  onSaved,
  serviceNames,
}: BookingFormModalProps) {
  const [formData, setFormData] = useState<BookingFormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...DEFAULT_FORM,
        service: serviceNames.length > 0 ? serviceNames[0] : "",
        date: new Date().toISOString().split("T")[0],
      });
      setError(null);
    }
  }, [isOpen, serviceNames]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter client name");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      setError("Please enter client phone number");
      return;
    }

    if (cleanPhone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (!formData.service.trim()) {
      setError("Please select or enter the treatment");
      return;
    }

    if (!formData.date.trim()) {
      setError("Please select the appointment date");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create booking");
      }

      onSaved(data);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save booking");
    } finally {
      setLoading(false);
    }
  };

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
              <h2 className="font-poppins text-lg uppercase tracking-wider text-[#1c1917]">
                Record New Appointment
              </h2>
              <p className="font-poppins text-xs text-[#1c1917]/60">
                Register a walk-in or offline patient booking
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

        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-poppins flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-poppins">
          <div>
            <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1">
              Client Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1">
              Contact Phone (10 digits) *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length === 12 && val.startsWith("91")) val = val.slice(2);
                  if (val.length === 11 && val.startsWith("0")) val = val.slice(1);
                  val = val.slice(0, 10);
                  setFormData((prev) => ({ ...prev, phone: val }));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-sm font-mono focus:outline-none focus:border-[#7a5f2a] pr-14"
              />
              {formData.phone.length > 0 && (
                <span
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono select-none ${
                    formData.phone.length === 10
                      ? "text-emerald-700 font-semibold"
                      : "text-stone-400"
                  }`}
                >
                  {formData.phone.length}/10
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1">
                Requested Service *
              </label>
              {serviceNames.length > 0 ? (
                <select
                  value={formData.service}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, service: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-poppins focus:outline-none focus:border-[#7a5f2a]"
                >
                  {serviceNames.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                  {!serviceNames.includes("Other / Not Sure") && (
                    <option value="Other / Not Sure">Other / Not Sure</option>
                  )}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydra Glow Facial"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, service: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-sm focus:outline-none focus:border-[#7a5f2a]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-poppins focus:outline-none focus:border-[#7a5f2a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as BookingStatus,
                }))
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-poppins uppercase tracking-wider focus:outline-none focus:border-[#7a5f2a]"
            >
              <option value="confirmed">Confirmed (Scheduled)</option>
              <option value="pending">Pending (Awaiting Confirmation)</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-poppins font-semibold text-[#1c1917] mb-1">
              Notes / Inquiries
            </label>
            <textarea
              rows={2}
              placeholder="Any special medical requests, aesthetic notes or instructions..."
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs focus:outline-none focus:border-[#7a5f2a] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#c2a878]/25 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-poppins text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs uppercase tracking-wider font-poppins font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Appointment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
