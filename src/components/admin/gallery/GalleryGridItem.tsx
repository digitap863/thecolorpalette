"use client";

import Image from "next/image";
import { Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { GalleryItem } from "./types";

interface GalleryGridItemProps {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onToggleVisibility: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

export default function GalleryGridItem({
  item,
  onEdit,
  onToggleVisibility,
  onDelete,
}: GalleryGridItemProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#f7f1eb] border border-[#c2a878]/20 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative aspect-square">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* Hidden dim overlay */}
        {!item.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <EyeOff className="w-6 h-6 text-white/80" />
          </div>
        )}

        {/* Hover action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-[#1c1917] flex items-center justify-center transition-all shadow"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleVisibility(item)}
            className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-[#1c1917] flex items-center justify-center transition-all shadow"
            title={item.isActive ? "Hide" : "Show"}
          >
            {item.isActive ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 rounded-lg bg-red-50/90 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all shadow"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="p-2.5">
        <p className="font-belleza text-[11px] uppercase tracking-[0.08em] text-[#1c1917] truncate">
          {item.title}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] font-poppins text-[#8c6d36] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded-md bg-[#c2a878]/15">
            {item.category}
          </span>
          <span
            className={`text-[9px] font-poppins uppercase tracking-wider font-medium px-1.5 py-0.5 rounded-md ${
              item.isActive
                ? "text-emerald-700 bg-emerald-50"
                : "text-stone-500 bg-stone-100"
            }`}
          >
            {item.isActive ? "Live" : "Hidden"}
          </span>
        </div>
      </div>
    </div>
  );
}
