"use client";

import Image from "next/image";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CloudUpload,
} from "lucide-react";
import { UploadingFile, GALLERY_CATEGORIES } from "./types";

interface UploadQueueCardProps {
  item: UploadingFile;
  onUpdate: (id: string, patch: Partial<UploadingFile>) => void;
  onRemove: (id: string) => void;
  onUpload: (item: UploadingFile) => void;
}

export default function UploadQueueCard({
  item,
  onUpdate,
  onRemove,
  onUpload,
}: UploadQueueCardProps) {
  const isEditable = item.status === "pending" || item.status === "error";

  return (
    <div className="rounded-2xl border border-[#c2a878]/30 bg-white shadow-xs overflow-hidden">
      {/* ── Card Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#f7f1eb]/70 border-b border-[#c2a878]/20">
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-[#c2a878]/20 shrink-0">
            <Image
              src={item.preview}
              alt="preview"
              fill
              className="object-cover"
            />
            {(item.status === "uploading" || item.status === "saving") && (
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            )}
            {item.status === "done" && (
              <div className="absolute inset-0 bg-[#c2a878]/50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            )}
            {item.status === "error" && (
              <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* File info */}
          <div className="min-w-0">
            <p className="font-belleza text-xs uppercase tracking-wider text-[#1c1917] font-semibold truncate max-w-[220px]">
              {item.file.name}
            </p>
            <p className="font-poppins text-[10px] text-[#1c1917]/50 mt-0.5">
              {(item.file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
              {item.file.type.split("/")[1]?.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Right side — status badge + dismiss */}
        <div className="flex items-center gap-2">
          {item.status === "done" && (
            <span className="flex items-center gap-1 text-[10px] font-poppins font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Uploaded
            </span>
          )}
          {(item.status === "uploading" || item.status === "saving") && (
            <span className="flex items-center gap-1 text-[10px] font-poppins font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" />
              {item.status === "saving" ? "Saving..." : `${item.progress}%`}
            </span>
          )}
          {item.status === "error" && (
            <span className="flex items-center gap-1 text-[10px] font-poppins font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
              <AlertCircle className="w-3 h-3" /> Failed
            </span>
          )}

          {/* Dismiss / Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            className={`p-1.5 rounded-lg transition-all ${
              item.status === "done"
                ? "text-[#1c1917]/40 hover:text-[#1c1917] hover:bg-[#f7f1eb]"
                : "text-[#1c1917]/40 hover:text-red-600 hover:bg-red-50"
            }`}
            title={item.status === "done" ? "Dismiss" : "Remove"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Form Body (hidden once done) ─────────────────────────────────── */}
      {item.status !== "done" && (
        <div className="px-5 py-5">
          {/* Error alert */}
          {item.status === "error" && item.error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-poppins">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {item.error}
            </div>
          )}

          {/* Progress bar */}
          {(item.status === "uploading" || item.status === "saving") && (
            <div className="mb-4">
              <div className="flex justify-between text-[10px] font-poppins text-[#1c1917]/60 mb-1.5">
                <span>
                  {item.status === "saving"
                    ? "Saving to database..."
                    : "Uploading to Cloudinary..."}
                </span>
                <span className="font-semibold">{item.progress}%</span>
              </div>
              <div className="h-2 w-full bg-[#c2a878]/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c2a878] to-[#8c6d36] rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image Title */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold font-poppins text-[#1c1917] mb-1.5">
                Image Title
                <span className="text-red-500 text-sm leading-none">*</span>
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => onUpdate(item.id, { title: e.target.value })}
                disabled={!isEditable}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c2a878]/30 bg-white text-sm font-poppins text-[#1c1917] placeholder-[#1c1917]/30 focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/10 transition-all disabled:opacity-50 disabled:bg-stone-50"
                placeholder="e.g. Bridal Hair Transformation"
              />
            </div>

            {/* Alt Text */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold font-poppins text-[#1c1917] mb-1.5">
                Alt Text
                <span className="text-red-500 text-sm leading-none">*</span>
                <span className="text-[10px] font-normal text-[#1c1917]/50 font-poppins ml-1">
                  (for accessibility &amp; SEO)
                </span>
              </label>
              <input
                type="text"
                value={item.alt}
                onChange={(e) => onUpdate(item.id, { alt: e.target.value })}
                disabled={!isEditable}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c2a878]/30 bg-white text-sm font-poppins text-[#1c1917] placeholder-[#1c1917]/30 focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/10 transition-all disabled:opacity-50 disabled:bg-stone-50"
                placeholder="e.g. Before and after hair coloring treatment"
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold font-poppins text-[#1c1917] mb-1.5">
                Category
                <span className="text-red-500 text-sm leading-none">*</span>
              </label>
              <select
                value={item.category}
                onChange={(e) => onUpdate(item.id, { category: e.target.value })}
                disabled={!isEditable}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c2a878]/30 bg-white text-sm font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/10 transition-all disabled:opacity-50 disabled:bg-stone-50"
              >
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Order */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold font-poppins text-[#1c1917] mb-1.5">
                Display Order
                <span className="text-[10px] font-normal text-[#1c1917]/50 ml-1">
                  (lower = first)
                </span>
              </label>
              <input
                type="number"
                value={item.order}
                onChange={(e) =>
                  onUpdate(item.id, { order: Number(e.target.value) })
                }
                disabled={!isEditable}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#c2a878]/30 bg-white text-sm font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/10 transition-all disabled:opacity-50 disabled:bg-stone-50"
                min={0}
              />
            </div>
          </div>

          {/* Upload button */}
          {isEditable && (
            <div className="mt-4 pt-4 border-t border-[#c2a878]/15 flex justify-end">
              <button
                onClick={() => onUpload(item)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-belleza uppercase tracking-wider transition-all shadow-md"
              >
                <CloudUpload className="w-4 h-4" />
                Upload to Cloudinary
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
