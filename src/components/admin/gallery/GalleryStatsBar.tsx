"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

interface GalleryStatsBarProps {
  totalImages: number;
  publishedCount: number;
  hiddenCount: number;
  uploadingCount: number;
}

export default function GalleryStatsBar({
  totalImages,
  publishedCount,
  hiddenCount,
  uploadingCount,
}: GalleryStatsBarProps) {
  const stats = [
    { label: "Total Images", value: totalImages, color: "text-[#1c1917]" },
    { label: "Published", value: publishedCount, color: "text-[#8c6d36]" },
    { label: "Hidden", value: hiddenCount, color: "text-stone-500" },
    { label: "Uploading", value: uploadingCount, color: "text-sky-700" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white border border-[#c2a878]/30 p-4 shadow-xs"
        >
          <p className="font-poppins text-[10px] uppercase tracking-wider text-[#1c1917]/60 mb-1">
            {stat.label}
          </p>
          <p className={`font-belleza text-2xl ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
