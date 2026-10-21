"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  ExternalLink,
  Calendar,
  Sliders,
} from "lucide-react";

interface SiteSettingsData {
  freeConsultationActive: boolean;
  freeConsultationBadge: string;
  freeConsultationTitle: string;
  freeConsultationDescription: string;
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  freeConsultationActive: true,
  freeConsultationBadge: "COMPLIMENTARY OFFER",
  freeConsultationTitle: "DOCTOR CONSULTATION IS FREE",
  freeConsultationDescription:
    "Schedule your appointment today & receive a personalized 1-on-1 skin & hair evaluation by certified specialists at zero consultation fee.",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({
            freeConsultationActive: Boolean(data.freeConsultationActive),
            freeConsultationBadge:
              data.freeConsultationBadge || DEFAULT_SETTINGS.freeConsultationBadge,
            freeConsultationTitle:
              data.freeConsultationTitle ||
              data.freeConsultationText ||
              DEFAULT_SETTINGS.freeConsultationTitle,
            freeConsultationDescription:
              data.freeConsultationDescription !== undefined
                ? data.freeConsultationDescription
                : DEFAULT_SETTINGS.freeConsultationDescription,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggleActive = async () => {
    const nextState = !settings.freeConsultationActive;
    setSettings((prev) => ({ ...prev, freeConsultationActive: nextState }));

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          freeConsultationActive: nextState,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          "success",
          nextState
            ? "Doctor Consultation offer is now ACTIVE on website"
            : "Doctor Consultation offer is now HIDDEN from website"
        );
      } else {
        showToast("error", data.error || "Failed to update setting");
      }
    } catch {
      showToast("error", "Error saving setting");
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("success", "Settings updated successfully");
      } else {
        showToast("error", data.error || "Failed to update settings");
      }
    } catch {
      showToast("error", "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-poppins max-w-3xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs transition-all border ${
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c2a878]/30">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8c6d36] mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Clinic Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl uppercase tracking-wider font-poppins text-[#1c1917]">
            Consultation Notice &amp; Offer
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-0.5">
            Configure the dynamic complimentary doctor consultation banner shown on the booking section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/bookings"
            className="px-3.5 py-2 rounded-xl border border-[#c2a878]/30 text-xs font-medium text-stone-700 hover:bg-[#f7f1eb] transition-colors inline-flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings</span>
          </Link>
          <Link
            href="/#contact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#1c1917] text-white text-xs font-medium hover:bg-black transition-colors inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Settings Form Card */}
      <div className="bg-white rounded-2xl border border-[#c2a878]/30 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Active Toggle Switch */}
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#c2a878]/20">
            <div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-[#1c1917]">
                  Offer Notice
                </label>
                {settings.freeConsultationActive ? (
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active on Website
                  </span>
                ) : (
                  <span className="text-[10px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
                    Hidden from Website
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Toggle visibility on the website booking form
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.freeConsultationActive}
              onClick={handleToggleActive}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                settings.freeConsultationActive ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 mt-0.5 ml-0.5 ${
                  settings.freeConsultationActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Tag / Badge Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Tagline / Badge
            </label>
            <input
              type="text"
              value={settings.freeConsultationBadge}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, freeConsultationBadge: e.target.value }))
              }
              placeholder="COMPLIMENTARY OFFER"
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/40 bg-[#f7f1eb]/30 text-stone-900 text-sm font-poppins focus:outline-none focus:border-[#7a5f2a]"
            />
            <p className="text-[11px] text-stone-400">
              Golden label prefix (e.g. COMPLIMENTARY OFFER)
            </p>
          </div>

          {/* Headline / Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Headline Text
            </label>
            <input
              type="text"
              value={settings.freeConsultationTitle}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, freeConsultationTitle: e.target.value }))
              }
              placeholder="DOCTOR CONSULTATION IS FREE"
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/40 bg-[#f7f1eb]/30 text-stone-900 text-sm font-poppins focus:outline-none focus:border-[#7a5f2a]"
            />
            <p className="text-[11px] text-stone-400">
              Main promotion title (e.g. DOCTOR CONSULTATION IS FREE)
            </p>
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Subtitle / Description
              </label>
              {settings.freeConsultationDescription && (
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, freeConsultationDescription: "" }))
                  }
                  className="text-[11px] text-stone-400 hover:text-stone-700 underline"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={3}
              value={settings.freeConsultationDescription}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  freeConsultationDescription: e.target.value,
                }))
              }
              placeholder="Schedule your appointment today & receive a personalized 1-on-1 skin & hair evaluation by certified specialists at zero consultation fee."
              className="w-full px-4 py-2.5 rounded-xl border border-[#c2a878]/40 bg-[#f7f1eb]/30 text-stone-900 text-sm font-poppins focus:outline-none focus:border-[#7a5f2a] resize-none"
            />
            <p className="text-[11px] text-stone-400">
              Subtext providing details about the free evaluation.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-[#c2a878]/20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSettings(DEFAULT_SETTINGS);
                showToast("success", "Reset to default settings");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>

            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4 text-[#c2a878]" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
