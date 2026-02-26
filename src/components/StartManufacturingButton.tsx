"use client";

import { useState, useEffect, useCallback } from "react";
import { Factory, Loader2, CheckCircle2, X, Mail } from "lucide-react";
import { startManufacturing } from "@/lib/actions/orders";

interface Props {
  orderId: string;
  clientName?: string;
  clientEmail?: string;
}

export default function StartManufacturingButton({ orderId, clientName, clientEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setShowConfirm(false);
  }, []);

  useEffect(() => {
    if (showConfirm) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showConfirm, handleKeyDown]);

  async function handleConfirm() {
    setLoading(true);
    try {
      await startManufacturing(orderId);
      setDone(true);
      setShowConfirm(false);
    } catch (err) {
      setShowConfirm(false);
      alert(err instanceof Error ? err.message : "Failed to start manufacturing");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4" />
        Manufacturing started — client notified
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium hover:bg-sky-500/15 transition-colors cursor-pointer disabled:opacity-50"
      >
        <Factory className="w-4 h-4" />
        Start Manufacturing
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !loading && setShowConfirm(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#161b22] shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="absolute top-4 right-4 p-1 text-white/20 hover:text-white/50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon header */}
            <div className="pt-8 pb-4 flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Factory className="w-7 h-7 text-sky-400" />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-2 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Start Manufacturing</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                This will mark the order as in manufacturing and notify the client via email.
              </p>
            </div>

            {/* Email preview */}
            {(clientName || clientEmail) && (
              <div className="mx-6 mt-4 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/60 text-xs font-medium truncate">
                      Email will be sent to
                    </p>
                    <p className="text-white text-sm font-medium truncate">
                      {clientName}{clientEmail && <span className="text-white/30 font-normal"> ({clientEmail})</span>}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.08] hover:text-white/70 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-400 transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Factory className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
