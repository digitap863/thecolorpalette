"use client";

import { useState, useEffect, useCallback } from "react";
import { CloudUpload, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

import { GalleryItem, UploadingFile } from "@/components/admin/gallery/types";
import { uploadToCloudinary } from "@/components/admin/gallery/uploadHelpers";
import GalleryStatsBar from "@/components/admin/gallery/GalleryStatsBar";
import GalleryUploadZone from "@/components/admin/gallery/GalleryUploadZone";
import GalleryLibrary from "@/components/admin/gallery/GalleryLibrary";
import EditImageModal from "@/components/admin/gallery/EditImageModal";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminGalleryPage() {
  // ── State ────────────────────────────────────────────────────────────────
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadQueue, setUploadQueue] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch all gallery images (admin endpoint includes hidden ones) ────────
  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data: GalleryItem[] = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to load gallery images.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // ── Drag & Drop handlers (passed down to GalleryUploadZone) ─────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    addFilesToQueue(files);
  };

  // ── Queue management ─────────────────────────────────────────────────────
  const addFilesToQueue = (files: File[]) => {
    const newItems: UploadingFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
      title: "",     // intentionally blank — admin must fill in
      alt: "",       // intentionally blank — admin must fill in
      category: "Hair",
      order: 0,
    }));
    setUploadQueue((q) => [...q, ...newItems]);
  };

  const removeFromQueue = (id: string) => {
    setUploadQueue((q) => {
      const item = q.find((i) => i.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return q.filter((i) => i.id !== id);
    });
  };

  const updateQueueItem = (id: string, patch: Partial<UploadingFile>) => {
    setUploadQueue((q) =>
      q.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const clearQueue = () => {
    uploadQueue.forEach((i) => {
      if (i.preview) URL.revokeObjectURL(i.preview);
    });
    setUploadQueue([]);
  };

  // ── Upload single file ───────────────────────────────────────────────────
  const uploadFile = async (item: UploadingFile) => {
    if (!item.title.trim() || !item.alt.trim() || !item.category) {
      updateQueueItem(item.id, {
        status: "error",
        error: "Please fill in title, alt text, and category.",
      });
      return;
    }

    updateQueueItem(item.id, { status: "uploading", progress: 0 });

    try {
      const cloudinaryUrl = await uploadToCloudinary(item.file, (p) => {
        updateQueueItem(item.id, { progress: p });
      });

      updateQueueItem(item.id, { status: "saving", progress: 95 });

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: cloudinaryUrl,
          alt: item.alt,
          category: item.category,
          title: item.title,
          order: item.order,
          isActive: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save to database");

      updateQueueItem(item.id, { status: "done", progress: 100 });
      showToast("success", `"${item.title}" uploaded successfully!`);
      setTimeout(fetchGallery, 500);
    } catch (err: any) {
      updateQueueItem(item.id, {
        status: "error",
        error: err?.message || "Upload failed",
      });
    }
  };

  const uploadAllPending = () => {
    uploadQueue
      .filter((i) => i.status === "pending" || i.status === "error")
      .forEach(uploadFile);
  };

  // ── Gallery CRUD actions ─────────────────────────────────────────────────
  const deleteItem = async (id: string) => {
    if (!confirm("Delete this image? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast("success", "Image deleted successfully.");
    } catch {
      showToast("error", "Failed to delete image.");
    }
  };

  const toggleVisibility = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isActive: !i.isActive } : i
        )
      );
      showToast(
        "success",
        `Image ${!item.isActive ? "published" : "hidden"} successfully.`
      );
    } catch {
      showToast("error", "Failed to update visibility.");
    }
  };

  const saveEdit = async (updated: Partial<GalleryItem>) => {
    if (!editingItem) return;
    const res = await fetch(`/api/gallery/${editingItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error("Save failed");
    setItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? { ...i, ...updated } : i))
    );
    showToast("success", "Image updated successfully.");
  };

  // ── Derived counts ────────────────────────────────────────────────────────
  const pendingCount = uploadQueue.filter(
    (i) => i.status === "pending" || i.status === "error"
  ).length;

  const uploadingCount = uploadQueue.filter(
    (i) => i.status === "uploading" || i.status === "saving"
  ).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Toast notification ─────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-sm font-poppins font-medium animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === "success"
              ? "bg-white border-[#c2a878]/40 text-[#1c1917]"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#8c6d36] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Edit modal ─────────────────────────────────────────────────── */}
      {editingItem && (
        <EditImageModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={saveEdit}
        />
      )}

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
         
          <h1 className="font-belleza text-3xl sm:text-4xl uppercase tracking-[0.08em] text-[#1c1917]">
            Gallery Management
          </h1>
          <p className="mt-1 font-poppins text-xs text-[#1c1917]/60 font-light">
            Upload, organize, and manage your portfolio showcase images
          </p>
        </div>
        <button
          onClick={fetchGallery}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#c2a878]/40 text-[#1c1917] text-xs font-belleza uppercase tracking-[0.12em] hover:bg-[#f7f1eb] transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────────────── */}
      <GalleryStatsBar
        totalImages={items.length}
        publishedCount={items.filter((i) => i.isActive).length}
        hiddenCount={items.filter((i) => !i.isActive).length}
        uploadingCount={uploadingCount}
      />

      {/* ── Upload zone + queue ────────────────────────────────────────── */}
      <GalleryUploadZone
        uploadQueue={uploadQueue}
        isDragging={isDragging}
        pendingCount={pendingCount}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFilesSelected={addFilesToQueue}
        onUpdateQueueItem={updateQueueItem}
        onRemoveFromQueue={removeFromQueue}
        onUploadFile={uploadFile}
        onUploadAll={uploadAllPending}
        onClearQueue={clearQueue}
      />

      {/* ── Gallery library ────────────────────────────────────────────── */}
      <GalleryLibrary
        items={items}
        loading={loading}
        viewMode={viewMode}
        filterCategory={filterCategory}
        onViewModeChange={setViewMode}
        onFilterChange={setFilterCategory}
        onEdit={setEditingItem}
        onToggleVisibility={toggleVisibility}
        onDelete={deleteItem}
      />
    </div>
  );
}
