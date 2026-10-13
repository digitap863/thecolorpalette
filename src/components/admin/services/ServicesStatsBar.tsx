"use client";

import { Layers, CheckCircle2, Sparkles, FolderTree } from "lucide-react";
import { AdminServiceItem, AdminCategoryItem } from "./types";

interface ServicesStatsBarProps {
  services: AdminServiceItem[];
  categories: AdminCategoryItem[];
}

export default function ServicesStatsBar({
  services,
  categories,
}: ServicesStatsBarProps) {
  const total = services.length;
  const active = services.filter((s) => s.isActive).length;
  const featured = services.filter((s) => s.featured).length;
  const totalCats = categories.length;

  const stats = [
    {
      label: "Total Services",
      value: total,
      sub: "Across all categories",
      icon: Layers,
      color: "from-stone-50/90 to-stone-100/60",
      accent: "text-stone-800 bg-stone-200/80",
    },
    {
      label: "Live / Published",
      value: active,
      sub: "Active in client catalogue",
      icon: CheckCircle2,
      color: "from-emerald-50/90 to-emerald-100/40",
      accent: "text-emerald-700 bg-emerald-100/90",
    },
    {
      label: "Signature Treatments",
      value: featured,
      sub: "Highlighted with star badge",
      icon: Sparkles,
      color: "from-amber-50/90 to-amber-100/40",
      accent: "text-amber-700 bg-amber-100/90",
    },
    {
      label: "Clinical Categories",
      value: totalCats,
      sub: "Active category tracks",
      icon: FolderTree,
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
              <span className="font-belleza text-xs uppercase tracking-wider text-[#1c1917]/75 font-semibold">
                {st.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${st.accent}`}
              >
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
