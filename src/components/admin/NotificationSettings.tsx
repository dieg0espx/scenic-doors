"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, X, Save } from "lucide-react";
import { updateNotificationEmails } from "@/lib/actions/notification-settings";
import type { NotificationSettings as NS, AdminUser } from "@/lib/types";

interface Props {
  settings: NS[];
  users: AdminUser[];
}

const typeLabels: Record<string, { label: string; description: string; color: string }> = {
  lead: {
    label: "Lead Notifications",
    description: "Receive email notifications when new leads come in",
    color: "teal",
  },
  new_quote: {
    label: "Quote Notifications",
    description: "Receive email notifications when new quotes are submitted",
    color: "violet",
  },
  quote_pending_approval: {
    label: "Quote Pending Approval",
    description: "Receive email notifications when a client accepts a quote and it needs your approval",
    color: "amber",
  },
  quote_accepted: {
    label: "Quote Accepted",
    description: "Receive email notifications when a quote is approved and the contract is sent",
    color: "emerald",
  },
  quote_declined: {
    label: "Quote Declined",
    description: "Receive email notifications when a client declines a quote",
    color: "red",
  },
  payment_received: {
    label: "Payment Received",
    description: "Receive email notifications when a payment is confirmed",
    color: "emerald",
  },
  approval_signed: {
    label: "Approval Drawing Signed",
    description: "Receive email notifications when a client signs an approval drawing",
    color: "blue",
  },
  order_stage_change: {
    label: "Order Stage Change",
    description: "Receive email notifications when an order moves to a new stage",
    color: "amber",
  },
  contract_signed: {
    label: "Contract Signed",
    description: "Receive email notifications when a client signs a contract",
    color: "blue",
  },
};

const knownTypes = new Set(Object.keys(typeLabels));

function UserSelect({
  users,
  excludeEmails,
  onSelect,
  color,
}: {
  users: AdminUser[];
  excludeEmails: string[];
  onSelect: (email: string) => void;
  color: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const available = users.filter((u) => u.email && !excludeEmails.includes(u.email));

  const ringColor = color === "teal"
    ? "ring-teal-500/20 border-teal-500/40"
    : "ring-violet-500/20 border-violet-500/40";

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={available.length === 0}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
          ${open
            ? `bg-white/[0.06] ${ringColor} ring-2`
            : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05]"
          }
          text-white/25
        `}
      >
        <span>{available.length === 0 ? "All users added" : "Select a user..."}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 ml-2 text-white/25 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && available.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/[0.08] bg-[#161b22] shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            {available.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  onSelect(u.email!);
                  close();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer"
              >
                <span className="truncate font-medium">{u.name}</span>
                <span className="text-white/25 text-xs truncate">{u.email}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NotificationSettingsComponent({ settings, users }: Props) {
  const [data, setData] = useState<Record<string, string[]>>(
    Object.fromEntries(settings.map((s) => [s.type, [...s.emails]]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Build email→name lookup
  const emailToName: Record<string, string> = {};
  for (const u of users) {
    if (u.email) emailToName[u.email] = u.name;
  }

  function addUser(type: string, email: string) {
    if (data[type]?.includes(email)) return;
    setData({ ...data, [type]: [...(data[type] || []), email] });
    setSaved(false);
  }

  function removeEmail(type: string, email: string) {
    setData({ ...data, [type]: (data[type] || []).filter((e) => e !== email) });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(data).map(([type, emails]) =>
          updateNotificationEmails(type, emails)
        )
      );
      setSaved(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const colorMap: Record<string, { border: string; bg: string; tagBg: string; tagText: string }> = {
    teal: { border: "border-teal-500/15", bg: "bg-teal-500/[0.04]", tagBg: "bg-teal-500/15", tagText: "text-teal-300" },
    violet: { border: "border-violet-500/15", bg: "bg-violet-500/[0.04]", tagBg: "bg-violet-500/15", tagText: "text-violet-300" },
    emerald: { border: "border-emerald-500/15", bg: "bg-emerald-500/[0.04]", tagBg: "bg-emerald-500/15", tagText: "text-emerald-300" },
    red: { border: "border-red-500/15", bg: "bg-red-500/[0.04]", tagBg: "bg-red-500/15", tagText: "text-red-300" },
    blue: { border: "border-blue-500/15", bg: "bg-blue-500/[0.04]", tagBg: "bg-blue-500/15", tagText: "text-blue-300" },
    amber: { border: "border-amber-500/15", bg: "bg-amber-500/[0.04]", tagBg: "bg-amber-500/15", tagText: "text-amber-300" },
  };

  return (
    <div className="space-y-6">
      {settings.filter((s) => knownTypes.has(s.type)).map((s) => {
        const config = typeLabels[s.type]!;
        const c = colorMap[config.color];
        const emails = data[s.type] || [];

        return (
          <div key={s.type} className={`rounded-2xl border ${c.border} ${c.bg}`}>
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">{config.label}</h3>
              <p className="text-white/35 text-xs mt-0.5">{config.description}</p>
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              {/* User tags */}
              <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                  <span
                    key={email}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${c.tagBg} ${c.tagText} text-xs font-medium`}
                  >
                    {emailToName[email] || email}
                    <button
                      type="button"
                      onClick={() => removeEmail(s.type, email)}
                      className="hover:bg-white/10 rounded p-0.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {emails.length === 0 && (
                  <p className="text-white/20 text-xs">No users configured</p>
                )}
              </div>

              {/* User selector */}
              <UserSelect
                users={users}
                excludeEmails={emails}
                onSelect={(email) => addUser(s.type, email)}
                color={config.color}
              />
            </div>
          </div>
        );
      })}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 cursor-pointer disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
