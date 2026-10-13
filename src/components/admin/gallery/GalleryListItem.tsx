"use client";

import Image from "next/image";
import { Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { GalleryItem } from "./types";

interface GalleryListItemProps {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onToggleVisibility: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

export default function GalleryListItem({
  item,
  onEdit,
  onToggleVisibility,
  onDelete,
}: GalleryListItemProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-3 hover:bg-[#f7f1eb]/50 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f7f1eb] border border-[#c2a878]/20 shrink-0">
        <Image src={item.src} alt={item.alt} fill className="object-cover" />
        {!item.isActive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <EyeOff className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-belleza text-sm uppercase tracking-[0.08em] text-[#1c1917] truncate">
          {item.title}
        </p>
        <p className="font-poppins text-[10px] text-[#1c1917]/50 truncate mt-0.5">
          {item.alt}
        </p>
      </div>

      {/* Badges + actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-poppins text-[#8c6d36] uppercase tracking-wider font-medium px-2 py-0.5 rounded-md bg-[#c2a878]/15">
          {item.category}
        </span>
        <span
          className={`text-[10px] font-poppins uppercase tracking-wider font-medium px-2 py-0.5 rounded-md ${
            item.isActive
              ? "text-emerald-700 bg-emerald-50"
              : "text-stone-500 bg-stone-100"
          }`}
        >
          {item.isActive ? "Live" : "Hidden"}
        </span>
        <span className="text-[10px] font-mono text-[#1c1917]/40 hidden sm:block">
          #{item.order}
        </span>

        <button
          onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg hover:bg-[#f7f1eb] text-[#1c1917]/60 hover:text-[#1c1917] transition-colors border border-[#c2a878]/20"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onToggleVisibility(item)}
          className="p-1.5 rounded-lg hover:bg-[#f7f1eb] text-[#1c1917]/60 hover:text-[#1c1917] transition-colors border border-[#c2a878]/20"
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
          className="p-1.5 rounded-lg hover:bg-red-50 text-[#1c1917]/60 hover:text-red-600 transition-colors border border-[#c2a878]/20"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
