"use client";

import Image from "next/image";
import { Eye, EyeOff, Trash2, Pencil, ExternalLink, Film, Play } from "lucide-react";
import { GalleryItem } from "./types";
import { getSocialEmbedInfo } from "@/lib/socialEmbed";
import SocialIcon from "@/components/common/SocialIcon";

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
  const isReel = Boolean(item.socialUrl || item.isSocialPost);
  const embed = isReel ? getSocialEmbedInfo(item.socialUrl) : null;
  const hasValidImage = Boolean(
    item.src &&
      (item.src.includes("res.cloudinary.com") ||
        item.src.match(/\.(jpg|jpeg|png|webp|avif)/i))
  );

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#f7f1eb] border border-[#c2a878]/20 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Image / Thumbnail / Embed Container */}
      <div className={`relative ${isReel ? "aspect-[9/16] bg-black" : "aspect-square"}`}>
        {isReel && embed?.embedUrl && !hasValidImage ? (
          embed.type === "video" ? (
            <video
              src={embed.embedUrl}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={embed.embedUrl}
              title={item.title}
              className="w-full h-full border-0 pointer-events-none"
              tabIndex={-1}
            />
          )
        ) : hasValidImage ? (
          <Image
            src={item.src}
            alt={item.alt || item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-900 text-white">
            <SocialIcon
              platform={item.socialPlatform || "instagram"}
              className="w-8 h-8 text-[#dfcca5] mb-2"
            />
            <span className="text-[11px] font-poppins text-white/80 line-clamp-2">
              {item.title}
            </span>
          </div>
        )}

        {/* Reel Badge Indicator */}
        {isReel && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-poppins font-medium shadow-xs">
            <Film className="w-3 h-3 text-[#dfcca5]" />
            <span className="uppercase tracking-wider font-semibold">Reel</span>
          </div>
        )}

        {/* Center Play Icon for Reels with poster */}
        {isReel && hasValidImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300">
            <div className="w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md">
              <Play className="w-3.5 h-3.5 text-white fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Hidden dim overlay */}
        {!item.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <EyeOff className="w-6 h-6 text-white/80" />
          </div>
        )}

        {/* Hover action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 z-20">
          {item.socialUrl && (
            <a
              href={item.socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-[#1c1917] flex items-center justify-center transition-all shadow"
              title="Open Social Post"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
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
        <p className="font-poppins text-[11px] uppercase tracking-[0.08em] text-[#1c1917] truncate">
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
