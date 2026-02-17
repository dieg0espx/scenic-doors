"use client";

import { useState } from "react";
import { Plus, X, Save } from "lucide-react";
import { updateNotificationEmails } from "@/lib/actions/notification-settings";
import type { NotificationSettings as NS } from "@/lib/types";

interface Props {
  settings: NS[];
}

const typeLabels: Record<string, { label: string; description: string; color: string }> = {
  lead: {
    label: "Lead Notifications",
    description: "Receive email notifications when new leads come in",
    color: "teal",
  },
  quote: {
    label: "Quote Notifications",
    description: "Receive email notifications for quote activity",
    color: "violet",
  },
};

export default function NotificationSettingsComponent({ settings }: Props) {
  const [data, setData] = useState<Record<string, string[]>>(
    Object.fromEntries(settings.map((s) => [s.type, [...s.emails]]))
  );
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.type, ""]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addEmail(type: string) {
    const email = inputs[type]?.trim();
    if (!email || !email.includes("@")) return;
    if (data[type]?.includes(email)) return;
    setData({ ...data, [type]: [...(data[type] || []), email] });
    setInputs({ ...inputs, [type]: "" });
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
  };

  return (
    <div className="space-y-6">
      {settings.map((s) => {
        const config = typeLabels[s.type] || { label: s.type, description: "", color: "violet" };
        const c = colorMap[config.color];
        const emails = data[s.type] || [];

        return (
          <div key={s.type} className={`rounded-2xl border ${c.border} ${c.bg}`}>
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">{config.label}</h3>
              <p className="text-white/35 text-xs mt-0.5">{config.description}</p>
            </div>
            <div className="p-5 space-y-3">
              {/* Email tags */}
              <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                  <span
                    key={email}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${c.tagBg} ${c.tagText} text-xs font-medium`}
                  >
                    {email}
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
                  <p className="text-white/20 text-xs">No email addresses configured</p>
                )}
              </div>

              {/* Add email input */}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inputs[s.type] || ""}
                  onChange={(e) => setInputs({ ...inputs, [s.type]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail(s.type))}
                  placeholder="Enter email address..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => addEmail(s.type)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 cursor-pointer disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
