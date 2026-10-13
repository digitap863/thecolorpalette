"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import { AdminServiceItem, AdminCategoryItem } from "@/components/admin/services/types";
import ServiceFormModal from "@/components/admin/services/ServiceFormModal";
import DeleteConfirmModal from "@/components/admin/services/DeleteConfirmModal";
import ServicesStatsBar from "@/components/admin/services/ServicesStatsBar";

const FALLBACK_IMAGE = "/gallery/gallery_medifacial_1_1791351357677.png";

function AdminServicesContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam || "all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Sync category if URL parameter changes
  useEffect(() => {
    if (initialCategoryParam) {
      setSelectedCategory(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<AdminServiceItem | null>(null);
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

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/service-categories"),
      ]);

      if (servicesRes.ok) {
        const sData = await servicesRes.json();
        setServices(Array.isArray(sData) ? sData : []);
      }

      if (categoriesRes.ok) {
        const cData = await categoriesRes.json();
        setCategories(Array.isArray(cData) ? cData : []);
      }
    } catch {
      showToast("error", "Failed to load clinical services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Category map for fast lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => {
      map.set(c.slug, c.name);
      if (c.id) map.set(c.id, c.name);
    });
    return map;
  }, [categories]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (srv.categoryId !== selectedCategory) return false;
      }

      // Status filter
      if (statusFilter === "active" && !srv.isActive) return false;
      if (statusFilter === "inactive" && srv.isActive) return false;
      if (statusFilter === "featured" && !srv.featured) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const catName = (categoryMap.get(srv.categoryId) || "").toLowerCase();
        return (
          srv.name.toLowerCase().includes(q) ||
          srv.shortDescription.toLowerCase().includes(q) ||
          srv.slug.toLowerCase().includes(q) ||
          catName.includes(q)
        );
      }

      return true;
    });
  }, [services, selectedCategory, statusFilter, searchQuery, categoryMap]);

  // Quick Toggle Active Status
  const handleToggleActive = async (service: AdminServiceItem) => {
    const newStatus = !service.isActive;
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: newStatus } : s))
      );
      showToast(
        "success",
        `Service "${service.name}" is now ${newStatus ? "Live" : "Draft"}`
      );
    } catch {
      showToast("error", "Failed to update service status");
    }
  };

  // Quick Toggle Featured Status
  const handleToggleFeatured = async (service: AdminServiceItem) => {
    const newFeatured = !service.featured;
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });

      if (!res.ok) throw new Error("Update failed");

      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, featured: newFeatured } : s))
      );
      showToast(
        "success",
        `Service "${service.name}" ${
          newFeatured ? "marked as Signature" : "removed from Signature"
        }`
      );
    } catch {
      showToast("error", "Failed to update signature status");
    }
  };

  // Delete Service
  const handleDeleteService = async () => {
    if (!deletingService) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${deletingService.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete service");

      setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
      showToast("success", `Deleted "${deletingService.name}"`);
      setDeletingService(null);
    } catch {
      showToast("error", "Failed to delete service");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Save Service Callback (Add or Edit)
  const handleServiceSaved = (saved: AdminServiceItem) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      if (exists) {
        return prev.map((s) => (s.id === saved.id ? saved : s));
      }
      return [saved, ...prev];
    });
    showToast(
      "success",
      editingService
        ? `Updated "${saved.name}" successfully`
        : `Service "${saved.name}" created and published!`
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

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-[#c2a878]/35 p-6 sm:p-8 shadow-xs">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#dfcca5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c2a878]/20 border border-[#c2a878]/40 text-[#7a5f2a] text-xs font-poppins font-semibold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Clinical Catalogue Management</span>
            </div>
            <h1 className="font-belleza text-2xl sm:text-4xl text-[#1c1917] tracking-[0.08em] uppercase">
              Clinical Services
            </h1>
            <p className="mt-1 font-poppins text-xs sm:text-sm text-[#1c1917]/70 font-light max-w-xl">
              Add new aesthetic treatments, configure clinical descriptions, upload treatment media, and curate your live service catalogue.
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
              <span>Preview Live Catalogue</span>
            </Link>

            <button
              onClick={() => {
                setEditingService(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-[#f7f1eb] text-xs font-belleza uppercase tracking-[0.15em] font-medium transition-all shadow-md shadow-stone-900/15 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Stats Bar */}
      <ServicesStatsBar services={services} categories={categories} />

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-[#c2a878]/30 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search services by title, keywords or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-poppins focus:outline-none focus:border-[#7a5f2a] focus:ring-1 focus:ring-[#7a5f2a]"
            />
          </div>

          {/* Filters & View Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-900 text-xs font-belleza uppercase tracking-wider focus:outline-none focus:border-[#7a5f2a]"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Pills */}
            <div className="flex items-center rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 p-1">
              {(["all", "active", "inactive", "featured"] as const).map((st) => (
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

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 p-1">
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
            </div>

            {/* Refresh */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-xl border border-[#c2a878]/30 bg-[#f7f1eb]/30 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              title="Refresh services"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Active Filter Chips summary */}
        {(searchQuery || selectedCategory !== "all" || statusFilter !== "all") && (
          <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-[#c2a878]/20">
            <span>
              Showing {filteredServices.length} of {services.length} treatments
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setStatusFilter("all");
              }}
              className="text-[#8c6d36] hover:underline font-belleza uppercase tracking-wider font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Services List / Table */}
      {loading ? (
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-16 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-[#8c6d36] animate-spin mb-3" />
          <p className="font-belleza uppercase tracking-wider text-stone-600 text-sm">
            Loading clinical treatments...
          </p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#dfcca5]/30 text-[#8c6d36] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-belleza text-lg uppercase tracking-wider text-[#1c1917]">
            No Services Found
          </h3>
          <p className="font-poppins text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
            {services.length === 0
              ? "No clinical services have been added yet. Click the button below to add your first service."
              : "No services match your active search or filter criteria."}
          </p>
          {services.length === 0 ? (
            <button
              onClick={() => {
                setEditingService(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1917] text-[#f7f1eb] text-xs font-belleza uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Service</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setStatusFilter("all");
              }}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-belleza uppercase tracking-wider cursor-pointer hover:bg-stone-50"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c2a878]/25 bg-[#f7f1eb]/50 text-[10px] uppercase font-belleza tracking-wider text-[#1c1917]/70">
                  <th className="py-3.5 px-4 font-semibold">Treatment</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Short Summary</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Order</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Signature</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-poppins text-xs">
                {filteredServices.map((srv) => {
                  const catName = categoryMap.get(srv.categoryId) || srv.categoryId;
                  return (
                    <tr
                      key={srv.id}
                      className="hover:bg-[#f7f1eb]/30 transition-colors group"
                    >
                      {/* Name & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden relative shrink-0">
                            <Image
                              src={srv.image || FALLBACK_IMAGE}
                              alt={srv.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-belleza text-sm text-[#1c1917] font-semibold tracking-wide truncate max-w-[200px] sm:max-w-[260px]">
                              {srv.name}
                            </p>
                            <p className="font-mono text-[10px] text-stone-400 truncate max-w-[200px]">
                              /{srv.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Tag */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold bg-[#c2a878]/15 text-[#7a5f2a] border border-[#c2a878]/30">
                          {catName}
                        </span>
                      </td>

                      {/* Short Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-stone-600 text-[11px] leading-relaxed">
                          {srv.shortDescription}
                        </p>
                      </td>

                      {/* Display Order */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-stone-500">
                        {srv.order}
                      </td>

                      {/* Signature / Featured */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(srv)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            srv.featured
                              ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                              : "text-stone-300 hover:text-amber-500"
                          }`}
                          title={srv.featured ? "Remove signature" : "Make signature"}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              srv.featured ? "fill-amber-500" : ""
                            }`}
                          />
                        </button>
                      </td>

                      {/* Status Active / Draft */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(srv)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold cursor-pointer transition-colors ${
                            srv.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200"
                          }`}
                        >
                          {srv.isActive ? (
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
                            href={`/services?category=${srv.categoryId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            title="Preview on site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => {
                              setEditingService(srv);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-[#7a5f2a] hover:bg-[#dfcca5]/20 transition-colors cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingService(srv)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((srv) => {
            const catName = categoryMap.get(srv.categoryId) || srv.categoryId;
            return (
              <div
                key={srv.id}
                className="rounded-2xl bg-white border border-[#c2a878]/30 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                    <Image
                      src={srv.image || FALLBACK_IMAGE}
                      alt={srv.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold bg-white/90 backdrop-blur-xs text-[#7a5f2a] border border-[#c2a878]/30 shadow-xs">
                        {catName}
                      </span>

                      {srv.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold bg-amber-500 text-stone-950 shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          <span>Signature</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="font-belleza text-base text-[#1c1917] font-semibold tracking-wide mb-1.5">
                      {srv.name}
                    </h3>
                    <p className="font-poppins text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {srv.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="px-5 py-3.5 border-t border-stone-100 bg-[#f7f1eb]/20 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActive(srv)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-belleza uppercase tracking-wider font-semibold cursor-pointer ${
                      srv.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-stone-100 text-stone-500 border border-stone-200"
                    }`}
                  >
                    {srv.isActive ? "Live" : "Draft"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(srv)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 transition-colors"
                      title="Toggle Signature"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          srv.featured ? "fill-amber-500 text-amber-500" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => {
                        setEditingService(srv);
                        setIsFormModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeletingService(srv)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Create / Edit Modal */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSaved={handleServiceSaved}
        categories={categories}
        onCategoryCreated={(newCat) => setCategories((prev) => [...prev, newCat])}
        initialService={editingService}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        service={deletingService}
        isOpen={Boolean(deletingService)}
        onClose={() => setDeletingService(null)}
        onConfirm={handleDeleteService}
        loading={deleteLoading}
      />
    </div>
  );
}

export default function AdminServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl bg-white border border-[#c2a878]/30 p-16 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-[#8c6d36] animate-spin mb-3" />
          <p className="font-belleza uppercase tracking-wider text-stone-600 text-sm">
            Loading clinical treatments...
          </p>
        </div>
      }
    >
      <AdminServicesContent />
    </Suspense>
  );
}
