"use client";

import { Calendar, Clock, CheckCircle2, UserCheck, XCircle } from "lucide-react";
import { BookingItem } from "./types";

interface BookingsStatsBarProps {
  bookings: BookingItem[];
}

export default function BookingsStatsBar({ bookings }: BookingsStatsBarProps) {
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  const stats = [
    {
      label: "Total Requests",
      value: total,
      sub: "All recorded bookings",
      icon: Calendar,
      color: "from-stone-50/90 to-stone-100/60",
      accent: "text-stone-800 bg-stone-200/80",
    },
    {
      label: "Awaiting Action",
      value: pending,
      sub: "Needs clinic confirmation",
      icon: Clock,
      color: "from-amber-50/90 to-amber-100/40",
      accent: "text-amber-800 bg-amber-100/90",
      pulse: pending > 0,
    },
    {
      label: "Confirmed",
      value: confirmed,
      sub: "Scheduled appointments",
      icon: CheckCircle2,
      color: "from-emerald-50/90 to-emerald-100/40",
      accent: "text-emerald-700 bg-emerald-100/90",
    },
    {
      label: "Completed",
      value: completed,
      sub: "Treatments fulfilled",
      icon: UserCheck,
      color: "from-sky-50/90 to-sky-100/40",
      accent: "text-sky-700 bg-sky-100/90",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((st) => {
        const Icon = st.icon;
        return (
          <div
            key={st.label}
            className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${st.color} bg-white border border-[#c2a878]/30 shadow-2xs`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-belleza text-xs uppercase tracking-wider text-[#1c1917]/75 font-semibold">
                {st.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${st.accent} relative`}
              >
                {st.pulse && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                )}
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="font-belleza text-2xl sm:text-3xl font-light text-[#1c1917]">
              {st.value}
            </div>
            <p className="font-poppins text-[10px] text-[#1c1917]/60 mt-0.5">
              {st.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
