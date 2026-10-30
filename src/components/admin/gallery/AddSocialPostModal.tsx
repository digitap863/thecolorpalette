"use client";

import { useState } from "react";
import {
  Film,
  X,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import { GalleryItem } from "./types";
import SocialIcon, { detectSocialPlatform } from "@/components/common/SocialIcon";
import { getSocialEmbedInfo } from "@/lib/socialEmbed";

interface AddSocialPostModalProps {
  onClose: () => void;
  onSuccess: (newItem: GalleryItem) => void;
}

export default function AddSocialPostModal({
  onClose,
  onSuccess,
}: AddSocialPostModalProps) {
  const [socialUrl, setSocialUrl] = useState("");
  const [platform, setPlatform] = useState<string>("instagram");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (value: string) => {
    setSocialUrl(value);
    const trimmed = value.trim();
    if (trimmed) {
      const detected = detectSocialPlatform(trimmed);
      setPlatform(detected);
    }
  };

  const embedInfo = socialUrl.trim()
    ? getSocialEmbedInfo(socialUrl.trim())
    : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!socialUrl.trim()) {
      setError("Please provide a Reel link.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a caption for this reel.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socialUrl: socialUrl.trim(),
          title: title.trim(),
          order: Number(order) || 0,
          isActive: true,
          isSocialPost: true,
          socialPlatform: platform,
          category: "Reel",
          src: socialUrl.trim(),
          alt: title.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to add reel");
      }

      const createdItem: GalleryItem = await res.json();
      onSuccess(createdItem);
      onClose();
    } catch (err: unknown) {
      console.error("Save reel failed:", err);
      setError(err instanceof Error ? err.message : "Failed to add reel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#c2a878]/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c2a878]/20 bg-[#f7f1eb]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8c6d36] to-[#c2a878] flex items-center justify-center text-white shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-poppins text-base uppercase tracking-[0.1em] text-[#1c1917]">
                Add Reel
              </h3>
              <p className="font-poppins text-[10px] text-[#1c1917]/60">
                Instagram Reel, TikTok, or YouTube Shorts link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-poppins">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Reel URL */}
          <div>
            <label className="block text-xs font-poppins uppercase tracking-wider text-[#1c1917] font-medium mb-1.5">
              Reel URL *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <SocialIcon platform={platform} className="w-4 h-4 text-[#8c6d36]" />
              </div>
              <input
                type="url"
                required
                value={socialUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.instagram.com/reel/... or YouTube Shorts / TikTok"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#c2a878]/35 text-xs font-poppins text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
              />
            </div>
            <p className="mt-1 text-[10px] text-[#1c1917]/50 font-poppins">
              The video will play directly in the web gallery.
            </p>
          </div>

          {/* 2. Caption */}
          <div>
            <label className="block text-xs font-poppins uppercase tracking-wider text-[#1c1917] font-medium mb-1.5">
              Caption *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Russian Lips Transformation"
              className="w-full px-3 py-2.5 rounded-xl border border-[#c2a878]/35 text-xs font-poppins text-[#1c1917] placeholder:text-stone-400 focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
            />
          </div>

          {/* 3. Display Order */}
          <div>
            <label className="block text-xs font-poppins uppercase tracking-wider text-[#1c1917] font-medium mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-[#c2a878]/35 text-xs font-poppins text-[#1c1917] focus:outline-none focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20 transition-all"
              placeholder="0"
            />
            <p className="mt-1 text-[10px] text-[#1c1917]/50 font-poppins">
              Lower numbers appear first. Default is 0.
            </p>
          </div>

          {/* Live Preview if embed is ready */}
          {embedInfo?.embedUrl && (
            <div className="pt-2">
              <span className="block text-[10px] font-poppins uppercase tracking-wider text-[#1c1917]/60 font-medium mb-1.5">
                Direct Web Playback Preview
              </span>
              <div className="relative w-full aspect-[9/16] max-h-56 bg-black rounded-xl overflow-hidden border border-[#c2a878]/30 shadow-inner flex items-center justify-center">
                {embedInfo.type === "video" ? (
                  <video
                    src={embedInfo.embedUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={embedInfo.embedUrl}
                    title="Reel preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#c2a878]/20">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-poppins font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8c6d36] hover:bg-[#735728] text-white text-xs font-poppins font-semibold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding Reel...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Add Reel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
