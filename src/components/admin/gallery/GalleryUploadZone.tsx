"use client";

import { useRef } from "react";
import { Upload, CloudUpload, ImagePlus, Film } from "lucide-react";
import { UploadingFile } from "./types";
import UploadQueueCard from "./UploadQueueCard";

interface GalleryUploadZoneProps {
  uploadQueue: UploadingFile[];
  isDragging: boolean;
  pendingCount: number;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFilesSelected: (files: File[]) => void;
  onUpdateQueueItem: (id: string, patch: Partial<UploadingFile>) => void;
  onRemoveFromQueue: (id: string) => void;
  onUploadFile: (item: UploadingFile) => void;
  onUploadAll: () => void;
  onClearQueue: () => void;
  onOpenSocialModal?: () => void;
}

export default function GalleryUploadZone({
  uploadQueue,
  isDragging,
  pendingCount,
  onDragOver,
  onDragLeave,
  onDrop,
  onFilesSelected,
  onUpdateQueueItem,
  onRemoveFromQueue,
  onUploadFile,
  onUploadAll,
  onClearQueue,
  onOpenSocialModal,
}: GalleryUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-2xl bg-white border border-[#c2a878]/30 shadow-xs overflow-hidden">
      {/* ── Panel Header ─────────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-[#c2a878]/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
            <Upload className="w-4 h-4 text-sky-700" />
          </div>
          <div>
            <h2 className="font-poppins text-base uppercase tracking-[0.1em] text-[#1c1917]">
              Upload Images &amp; Reels
            </h2>
            <p className="font-poppins text-[10px] text-[#1c1917]/50">
              Drag &amp; drop photos or add an Instagram, TikTok, or YouTube reel link
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSocialModal && (
            <button
              type="button"
              onClick={onOpenSocialModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c2a878]/40 bg-[#f7f1eb] hover:bg-[#efe4d5] text-[#7a5f2a] text-xs font-poppins font-medium uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            >
              <Film className="w-3.5 h-3.5" />
              <span>+ Add Reel</span>
            </button>
          )}

          {pendingCount > 0 && (
            <button
              onClick={onUploadAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-poppins uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              Upload All ({pendingCount})
            </button>
          )}
        </div>
      </div>

      {/* ── Drop Zone ────────────────────────────────────────────────────── */}
      <div
        ref={dropZoneRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`m-6 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-12 px-6 transition-all duration-200 ${
          isDragging
            ? "border-[#c2a878] bg-[#f7f1eb]/80 scale-[1.01]"
            : "border-[#c2a878]/40 bg-[#f7f1eb]/30 hover:border-[#c2a878] hover:bg-[#f7f1eb]/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) onFilesSelected(files);
            e.target.value = "";
          }}
        />
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
            isDragging
              ? "bg-[#c2a878]/25 border border-[#c2a878]/60"
              : "bg-white border border-[#c2a878]/30 shadow-xs"
          }`}
        >
          <ImagePlus
            className={`w-7 h-7 transition-colors ${
              isDragging ? "text-[#8c6d36]" : "text-[#c2a878]"
            }`}
          />
        </div>
        <p className="font-poppins text-base uppercase tracking-[0.1em] text-[#1c1917] mb-1">
          {isDragging ? "Release to add images" : "Drop images here"}
        </p>
        <p className="font-poppins text-xs text-[#1c1917]/50">
          or{" "}
          <span className="text-[#8c6d36] underline underline-offset-2">
            click to browse
          </span>{" "}
          — JPG, PNG, WebP, AVIF
        </p>
      </div>

      {/* ── Upload Queue ─────────────────────────────────────────────────── */}
      {uploadQueue.length > 0 && (
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-poppins text-xs uppercase tracking-[0.12em] text-[#1c1917]/70">
              Upload Queue ({uploadQueue.length})
            </h3>
            <button
              onClick={onClearQueue}
              className="text-[10px] font-poppins text-[#1c1917]/50 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>

          {uploadQueue.map((item) => (
            <UploadQueueCard
              key={item.id}
              item={item}
              onUpdate={onUpdateQueueItem}
              onRemove={onRemoveFromQueue}
              onUpload={onUploadFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
