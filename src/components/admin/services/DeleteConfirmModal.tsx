"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { AdminServiceItem } from "./types";

interface DeleteConfirmModalProps {
  service: AdminServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export default function DeleteConfirmModal({
  service,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-red-200 shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-belleza text-lg uppercase tracking-wider text-[#1c1917]">
              Delete Service
            </h3>
            <p className="font-poppins text-xs text-[#1c1917]/60">
              Permanent removal warning
            </p>
          </div>
        </div>

        <p className="font-poppins text-sm text-[#1c1917]/80 leading-relaxed mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-red-600 font-semibold">{service.name}</strong>?
          This treatment will no longer be visible to clients on the website or
          booking catalogue.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-belleza text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-belleza transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Permanently</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
