"use client";

import { useState } from "react";
import { Plus, Trash2, Link2, Check, Loader2, X, Copy } from "lucide-react";
import type { TrackingLink } from "@/lib/actions/tracking-links";
import { createTrackingLink, deleteTrackingLink } from "@/lib/actions/tracking-links";

interface Props {
  initialLinks: TrackingLink[];
}

export default function TrackingLinksManager({ initialLinks }: Props) {
  const [links, setLinks] = useState<TrackingLink[]>(initialLinks);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://scenicdoors.com";

  // Auto-generate slug from name
  function handleNameChange(value: string) {
    setName(value);
    if (!slug || slug === autoSlug(name)) {
      setSlug(autoSlug(value));
    }
  }

  function autoSlug(n: string): string {
    return n.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "");
  }

  async function handleCreate() {
    if (!name.trim() || !slug.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const link = await createTrackingLink(name, slug);
      setLinks((prev) => [link, ...prev]);
      setName("");
      setSlug("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tracking link?")) return;
    setDeletingId(id);
    try {
      await deleteTrackingLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  }

  function handleCopy(id: string, link: string) {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-teal-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Tracking Links</h2>
          <p className="text-[11px] text-white/30">Create custom links to track where leads come from</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Create new */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-white/40 block mb-1 uppercase tracking-wider font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Facebook Spring Campaign"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20"
            />
          </div>
          <div className="sm:w-48">
            <label className="text-[10px] text-white/40 block mb-1 uppercase tracking-wider font-medium">Identifier</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, ""))}
              placeholder="e.g. fb-spring"
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/80 text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-white/20"
            />
          </div>
          <div className="sm:self-end">
            <button
              onClick={handleCreate}
              disabled={!name.trim() || !slug.trim() || creating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500/15 border border-teal-500/20 text-teal-400 text-sm font-medium hover:bg-teal-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-[0.98]"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/15 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Preview */}
        {slug && (
          <div className="text-[11px] text-white/25 font-mono bg-white/[0.02] rounded-lg px-3 py-2 truncate">
            {origin}/quote?src={slug}
          </div>
        )}

        {/* Links list */}
        {links.length === 0 ? (
          <div className="text-center py-6">
            <Link2 className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/25">No tracking links yet</p>
            <p className="text-xs text-white/15 mt-1">Create one above to start tracking lead sources</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => {
              const fullUrl = `${origin}/quote?src=${link.slug}`;
              const isCopied = copiedId === link.id;
              const isDeleting = deletingId === link.id;

              return (
                <div
                  key={link.id}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 sm:px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/70 truncate">{link.name}</p>
                    <p className="text-[11px] text-white/30 font-mono truncate">{fullUrl}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(link.id, fullUrl)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all cursor-pointer active:scale-[0.97] ${
                        isCopied
                          ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
                          : "border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                      }`}
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 cursor-pointer transition-colors"
                    >
                      {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
