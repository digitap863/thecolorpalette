"use client";

import { FolderTree, CheckCircle2, Layers, Award } from "lucide-react";
import { CategoryItem } from "./types";

interface CategoriesStatsBarProps {
  categories: CategoryItem[];
}

export default function CategoriesStatsBar({
  categories,
}: CategoriesStatsBarProps) {
  const total = categories.length;
  const active = categories.filter((c) => c.isActive).length;
  const totalServices = categories.reduce((sum, c) => sum + (c.serviceCount || 0), 0);

  // Find largest category track
  const sortedByServices = [...categories].sort(
    (a, b) => (b.serviceCount || 0) - (a.serviceCount || 0)
  );
  const largest = sortedByServices[0];

  const stats = [
    {
      label: "Total Categories",
      value: total,
      sub: "Organized treatment tracks",
      icon: FolderTree,
      color: "from-stone-50/90 to-stone-100/60",
      accent: "text-stone-800 bg-stone-200/80",
    },
    {
      label: "Live / Published",
      value: active,
      sub: "Visible in catalogue tabs",
      icon: CheckCircle2,
      color: "from-emerald-50/90 to-emerald-100/40",
      accent: "text-emerald-700 bg-emerald-100/90",
    },
    {
      label: "Assigned Treatments",
      value: totalServices,
      sub: "Services across all tracks",
      icon: Layers,
      color: "from-amber-50/90 to-amber-100/40",
      accent: "text-amber-700 bg-amber-100/90",
    },
    {
      label: "Top Track",
      value: largest ? `${largest.serviceCount} services` : "N/A",
      sub: largest ? largest.name : "No tracks populated",
      icon: Award,
      color: "from-[#f7f1eb] to-[#dfcca5]/30",
      accent: "text-[#7a5f2a] bg-[#dfcca5]/50",
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
              <span className="font-poppins text-xs uppercase tracking-wider text-[#1c1917]/75 font-semibold">
                {st.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${st.accent}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="font-poppins text-2xl sm:text-3xl font-light text-[#1c1917] truncate">
              {st.value}
            </div>
            <p className="font-poppins text-[10px] text-[#1c1917]/60 mt-0.5 truncate">
              {st.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
