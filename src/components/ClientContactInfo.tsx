"use client";

import { useState } from "react";
import { updateClient } from "@/lib/actions/clients";
import { User, Mail, Phone, Building2, StickyNote, Pencil, Check, X, Loader2 } from "lucide-react";

interface ClientInfo {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
}

export default function ClientContactInfo({ client: initialClient }: { client: ClientInfo }) {
  const [client, setClient] = useState(initialClient);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formName, setFormName] = useState(client.name);
  const [formEmail, setFormEmail] = useState(client.email);
  const [formPhone, setFormPhone] = useState(client.phone || "");
  const [formCompany, setFormCompany] = useState(client.company || "");
  const [formNotes, setFormNotes] = useState(client.notes || "");

  function startEdit() {
    setFormName(client.name);
    setFormEmail(client.email);
    setFormPhone(client.phone || "");
    setFormCompany(client.company || "");
    setFormNotes(client.notes || "");
    setError("");
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
    setError("");
  }

  async function handleSave() {
    if (!formName || !formEmail) return;
    setLoading(true);
    setError("");
    try {
      await updateClient(client.id, {
        name: formName,
        email: formEmail,
        phone: formPhone || undefined,
        company: formCompany || undefined,
        notes: formNotes || undefined,
      });
      setClient({
        ...client,
        name: formName,
        email: formEmail,
        phone: formPhone || null,
        company: formCompany || null,
        notes: formNotes || null,
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 transition-all";

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1.5">
              <User className="w-3 h-3" /> Name
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className={inputClass}
              placeholder="Full name"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1.5">
              <Mail className="w-3 h-3" /> Email
            </label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className={inputClass}
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1.5">
              <Phone className="w-3 h-3" /> Phone
            </label>
            <input
              type="tel"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className={inputClass}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1.5">
              <Building2 className="w-3 h-3" /> Company
            </label>
            <input
              type="text"
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
              className={inputClass}
              placeholder="Company name"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1.5">
              <StickyNote className="w-3 h-3" /> Notes
            </label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className={inputClass + " resize-none"}
              rows={3}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-red-400 text-xs bg-red-500/[0.08] border border-red-500/20 rounded-lg px-3 py-2">
            <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={cancel}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !formName || !formEmail}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin" /> : <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />} Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1">
            <User className="w-3 h-3" /> Name
          </div>
          <p className="text-white text-sm">{client.name}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1">
            <Mail className="w-3 h-3" /> Email
          </div>
          <p className="text-white text-sm">{client.email}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1">
            <Phone className="w-3 h-3" /> Phone
          </div>
          <p className="text-white/60 text-sm">{client.phone || "—"}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1">
            <Building2 className="w-3 h-3" /> Company
          </div>
          <p className="text-white/60 text-sm">{client.company || "—"}</p>
        </div>
        {client.notes && (
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-wider font-medium mb-1">
              <StickyNote className="w-3 h-3" /> Notes
            </div>
            <p className="text-white/60 text-sm whitespace-pre-line">{client.notes}</p>
          </div>
        )}
      </div>
      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <button
          type="button"
          onClick={startEdit}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium text-white/30 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95"
        >
          <Pencil className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Edit Contact Info
        </button>
      </div>
    </div>
  );
}
