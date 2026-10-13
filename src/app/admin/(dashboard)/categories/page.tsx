"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  FolderTree,
  Sparkles,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  CheckCircle2,
  EyeOff,
  LayoutGrid,
  List,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { CategoryItem } from "@/components/admin/categories/types";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal";
import CategoryDeleteModal from "@/components/admin/categories/CategoryDeleteModal";
import CategoriesStatsBar from "@/components/admin/categories/CategoriesStatsBar";

const FALLBACK_IMAGE = "/gallery/gallery_medifacial_1_1791351357677.png";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"order" | "name" | "services">("order");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service-categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to load service categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filter & Sort
  const filteredCategories = useMemo(() => {
    const list = categories.filter((cat) => {
      if (statusFilter === "active" && !cat.isActive) return false;
      if (statusFilter === "inactive" && cat.isActive) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          cat.name.toLowerCase().includes(q) ||
          cat.slug.toLowerCase().includes(q) ||
          cat.shortDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "services") return (b.serviceCount || 0) - (a.serviceCount || 0);
      return (a.order ?? 0) - (b.order ?? 0);
    });

    return list;
  }, [categories, statusFilter, searchQuery, sortBy]);

  // Quick Toggle Active
  const handleToggleActive = async (category: CategoryItem) => {
    const newStatus = !category.isActive;
    try {
      const res = await fetch(`/api/admin/service-categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, isActive: newStatus } : c))
      );
      showToast(
        "success",
        `Category "${category.name}" is now ${newStatus ? "Live" : "Draft"}`
      );
    } catch {
      showToast("error", "Failed to update category status");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (force: boolean) => {
    if (!deletingCategory) return;
    setDeleteLoading(true);

    try {
      const url = `/api/admin/service-categories/${deletingCategory.id}${
        force ? "?force=true" : ""
      }`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      showToast("success", `Category "${deletingCategory.name}" deleted successfully`);
      setDeletingCategory(null);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Save Callback (Create or Edit)
  const handleCategorySaved = (saved: CategoryItem) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      if (exists) {
        return prev.map((c) => (c.id === saved.id ? saved : c));
      }
      return [...prev, saved].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });
    showToast(
      "success",
      editingCategory
        ? `Updated "${saved.name}" successfully`
        : `Category "${saved.name}" published!`
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-poppins transition-all border ${
            toast.type === "success"
              ? "bg-[#1c1917] text-[#f7f1eb] border-[#c2a878]/40"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#c2a878]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#c2a878]/35 p-6 sm:p-8 shadow-xs">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#dfcca5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c2a878]/20 border border-[#c2a878]/40 text-[#7a5f2a] text-xs font-poppins font-semibold mb-3">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Taxonomy &amp; Clinical Tracks</span>
            </div>
            <h1 className="font-belleza text-2xl sm:text-4xl text-[#1c1917] tracking-[0.08em] uppercase">
              Service Categories
            </h1>
            <p className="mt-1 font-poppins text-xs sm:text-sm text-[#1c1917]/70 font-light max-w-xl">
              Organize your clinical offerings into intuitive treatment tracks, configure catalogue tabs order, and manage track artwork.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f7f1eb] hover:bg-[#ecd7b6]/30 border border-[#c2a878]/40 text-[#1c1917] text-xs font-belleza uppercase tracking-[0.15em] font-medium transition-all shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Catalogue</span>
            </Link>

            <button
              onClick={() => {
                setEditingCategory(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-belleza uppercase tracking-[0.15em] font-medium transition-all shadow-md shadow-stone-900/15 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <CategoriesStatsBar categories={categories} />

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#c2a878]/30 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search categories by name, slug or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-poppins focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-belleza uppercase tracking-wider focus:outline-none focus:border-[#7a5f2a]"
            >
              <option value="order">Sort: Priority Order</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="services">Sort: Treatments Count</option>
            </select>

            {/* Status Filter */}
            <div className="flex items-center rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 p-1">
              {(["all", "active", "inactive"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-[11px] uppercase tracking-wider font-belleza font-semibold transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-[#1c1917] text-[#f7f1eb] shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {st === "all" ? "All" : st}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="p-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="Refresh categories"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Clear Filters Banner */}
        {(searchQuery || statusFilter !== "all") && (
          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-[#c2a878]/20 font-poppins">
            <span>
              Showing {filteredCategories.length} of {categories.length} categories
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-[#8c6d36] hover:underline font-belleza uppercase tracking-wider font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main List Area */}
      {loading ? (
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-16 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-[#8c6d36] animate-spin mb-3" />
          <p className="font-belleza uppercase tracking-wider text-stone-600 text-sm">
            Loading categories...
          </p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#dfcca5]/30 text-[#8c6d36] flex items-center justify-center mx-auto mb-3">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="font-belleza text-lg uppercase tracking-wider text-[#1c1917]">
            No Categories Found
          </h3>
          <p className="font-poppins text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
            {categories.length === 0
              ? "No clinical service categories found in database. Create your first category track now."
              : "No categories match your active filters."}
          </p>
          {categories.length === 0 ? (
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] text-[#f7f1eb] text-xs font-belleza uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-belleza uppercase tracking-wider cursor-pointer hover:bg-stone-50"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl bg-white border border-[#c2a878]/30 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                {/* Cover Image Container */}
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  <Image
                    src={cat.image || FALLBACK_IMAGE}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Priority Order Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/90 text-stone-800 shadow-xs">
                      #{cat.order}
                    </span>
                  </div>

                  {/* Treatments Count Chip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <Link
                      href={`/admin/services?category=${cat.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-belleza uppercase tracking-wider bg-black/60 backdrop-blur-xs hover:bg-[#1c1917] transition-colors"
                      title="View treatments in this category"
                    >
                      <Layers className="w-3 h-3 text-[#c2a878]" />
                      <span>{cat.serviceCount} Treatments</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold cursor-pointer ${
                        cat.isActive
                          ? "bg-emerald-500/90 text-white"
                          : "bg-stone-700/90 text-stone-300"
                      }`}
                    >
                      {cat.isActive ? "Live" : "Draft"}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-belleza text-base text-[#1c1917] font-semibold tracking-wide uppercase mb-1">
                    {cat.name}
                  </h3>
                  <p className="font-mono text-[10px] text-stone-400 mb-3">
                    /{cat.slug}
                  </p>
                  <p className="font-poppins text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {cat.shortDescription}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3.5 border-t border-stone-100 bg-[#f7f1eb]/25 flex items-center justify-between">
                <Link
                  href={`/services?category=${cat.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-belleza uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview Tab</span>
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsFormModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-[#7a5f2a] hover:bg-[#dfcca5]/20 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingCategory(cat)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c2a878]/25 bg-[#f7f1eb]/50 text-[10px] uppercase font-belleza tracking-wider text-[#1c1917]/70">
                  <th className="py-3.5 px-4 font-semibold">Track &amp; Artwork</th>
                  <th className="py-3.5 px-4 font-semibold">Summary</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Order</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Treatments</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-poppins text-xs">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#f7f1eb]/30 transition-colors group"
                  >
                    {/* Artwork & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden relative shrink-0">
                          <Image
                            src={cat.image || FALLBACK_IMAGE}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-belleza text-sm text-[#1c1917] font-semibold tracking-wide uppercase truncate max-w-[220px]">
                            {cat.name}
                          </p>
                          <p className="font-mono text-[10px] text-stone-400 truncate max-w-[200px]">
                            /{cat.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Summary */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="line-clamp-2 text-stone-600 text-[11px] leading-relaxed">
                        {cat.shortDescription}
                      </p>
                    </td>

                    {/* Order */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-stone-500">
                      #{cat.order}
                    </td>

                    {/* Treatments count */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Link
                        href={`/admin/services?category=${cat.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold bg-[#c2a878]/20 text-[#7a5f2a] hover:bg-[#c2a878]/30 transition-colors"
                        title="View treatments in this category"
                      >
                        <Layers className="w-3 h-3" />
                        <span>{cat.serviceCount} services</span>
                      </Link>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold cursor-pointer transition-colors ${
                          cat.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200"
                        }`}
                      >
                        {cat.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-stone-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/services?category=${cat.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                          title="Preview category in catalogue"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-[#7a5f2a] hover:bg-[#dfcca5]/20 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSaved={handleCategorySaved}
        initialCategory={editingCategory}
      />

      {/* Delete Modal */}
      <CategoryDeleteModal
        category={deletingCategory}
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        loading={deleteLoading}
      />
    </div>
  );
}
