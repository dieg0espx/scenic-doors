"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { updateLead, updateLeadWorkflow } from "@/lib/actions/leads";

// Temperature display (auto-managed by cron)
const TEMP_DISPLAY: Record<string, { label: string; bg: string; border: string; text: string }> = {
  hot: { label: "Hot", bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-300" },
  warm: { label: "Warm", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300" },
  cold: { label: "Cold", bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-300" },
};

// Workflow buttons (set by admins)
const WORKFLOW_OPTIONS = [
  { value: "contacted", label: "Contacted", bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-300", ring: "ring-violet-500/20" },
  { value: "qualified", label: "Qualified", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", ring: "ring-emerald-500/20" },
  { value: "lost", label: "Lost", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-300", ring: "ring-red-500/20" },
];

interface Props {
  leadId: string;
  initialStatus: string;
  initialWorkflow: string | null;
  initialNotes: string;
}

export default function LeadDetailClient({ leadId, initialStatus, initialWorkflow, initialNotes }: Props) {
  const [temperature, setTemperature] = useState(initialStatus);
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [notes, setNotes] = useState(initialNotes);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveNotes = useCallback(async (value: string) => {
    setSaveState("saving");
    try {
      await updateLead(leadId, { notes: value });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
    }
  }, [leadId]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleNotesChange(value: string) {
    setNotes(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNotes(value), 800);
  }

  async function handleWorkflowChange(newWorkflow: string) {
    const prevWorkflow = workflow;
    const prevTemp = temperature;
    setWorkflow(newWorkflow);
    setTemperature("hot"); // workflow action resets temperature
    try {
      await updateLeadWorkflow(leadId, newWorkflow);
    } catch {
      setWorkflow(prevWorkflow);
      setTemperature(prevTemp);
    }
  }

  const temp = TEMP_DISPLAY[temperature] || TEMP_DISPLAY.hot;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Temperature */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <h3 className="text-sm font-semibold text-white">Temperature</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${temp.bg} ${temp.border}`}>
            <span className={`text-sm font-semibold ${temp.text}`}>{temp.label}</span>
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-wider ml-auto">Auto</span>
          </div>
        </div>
      </div>

      {/* Workflow Status */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <h3 className="text-sm font-semibold text-white">Workflow</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-3 gap-2">
            {WORKFLOW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleWorkflowChange(opt.value)}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                  workflow === opt.value
                    ? `${opt.bg} ${opt.border} ${opt.text} ring-2 ${opt.ring}`
                    : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:bg-white/[0.05]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
          <h3 className="text-sm font-semibold text-white">Notes</h3>
          {saveState === "saving" && (
            <span className="text-xs text-amber-300/70">Saving...</span>
          )}
          {saveState === "saved" && (
            <span className="text-xs text-emerald-300/70">Saved</span>
          )}
        </div>
        <div className="p-4 sm:p-6">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all resize-none"
            placeholder="Add notes about this lead..."
          />
        </div>
      </div>
    </div>
  );
}
