"use client";

import { useState } from "react";
import { Save, Download, Send, Loader2, CheckCircle2 } from "lucide-react";
import { updateApprovalDrawingAndSyncQuote } from "@/lib/actions/approval-drawings";
import { generateApprovalDrawingPdf } from "@/lib/generateApprovalDrawingPdf";
import type { ApprovalDrawing } from "@/lib/types";

interface ApprovalDrawingEditorProps {
  drawing: ApprovalDrawing;
  quoteId: string;
  quoteName: string;
  onDrawingUpdate: (updated: ApprovalDrawing) => void;
  onSend: () => void;
  sendLoading: boolean;
}

export default function ApprovalDrawingEditor({
  drawing,
  quoteId,
  quoteName,
  onDrawingUpdate,
  onSend,
  sendLoading,
}: ApprovalDrawingEditorProps) {
  const isSigned = drawing.status === "signed";

  const [form, setForm] = useState({
    overall_width: drawing.overall_width,
    overall_height: drawing.overall_height,
    panel_count: drawing.panel_count,
    slide_direction: drawing.slide_direction,
    in_swing: drawing.in_swing,
    frame_color: drawing.frame_color || "Black",
    hardware_color: drawing.hardware_color || "Black",
  });

  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges =
    form.overall_width !== drawing.overall_width ||
    form.overall_height !== drawing.overall_height ||
    form.panel_count !== drawing.panel_count ||
    form.slide_direction !== drawing.slide_direction ||
    form.in_swing !== drawing.in_swing ||
    form.frame_color !== (drawing.frame_color || "Black") ||
    form.hardware_color !== (drawing.hardware_color || "Black");

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateApprovalDrawingAndSyncQuote(
        drawing.id,
        quoteId,
        form
      );
      onDrawingUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      const doc = await generateApprovalDrawingPdf({
        overall_width: form.overall_width,
        overall_height: form.overall_height,
        panel_count: form.panel_count,
        slide_direction: form.slide_direction,
        in_swing: form.in_swing,
        frame_color: form.frame_color,
        hardware_color: form.hardware_color,
        customer_name: drawing.customer_name,
        signature_data: drawing.signature_data,
        signed_at: drawing.signed_at,
        system_type: drawing.system_type,
      });
      doc.save(`Approval-Drawing-${quoteId.slice(0, 8)}.pdf`);
    } catch {
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  }

  // Derived values for the diagram and checkboxes
  const dirParts = form.slide_direction.split(",").map((v) => v.trim());
  const slidesLeft = dirParts.includes("left") || dirParts.includes("bi-part");
  const slidesRight = dirParts.includes("right") || dirParts.includes("bi-part");

  function toggleSlideDirection(side: "left" | "right") {
    const current = new Set(dirParts.filter((v) => v === "left" || v === "right"));
    // Expand "bi-part" to both
    if (dirParts.includes("bi-part")) { current.add("left"); current.add("right"); }
    if (current.has(side)) current.delete(side); else current.add(side);
    if (current.size === 0) current.add(side); // must have at least one
    setForm({ ...form, slide_direction: Array.from(current).join(",") });
  }

  const swingParts = form.in_swing.split(",").map((v) => v.trim());
  const isInSwing = swingParts.includes("interior") || swingParts.includes("in-swing");
  const isOutSwing = swingParts.includes("exterior") || swingParts.includes("out-swing");

  const leadLeft = slidesLeft;
  const leadRight = slidesRight;

  return (
    <div className="space-y-3">
      {/* Document Preview Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Title Bar */}
        <div className="bg-gray-900 text-white px-5 py-3 text-center">
          <h3 className="text-sm font-bold tracking-wider">
            SCENIC DOORS &ndash; {(drawing.system_type || "APPROVAL DRAWING").toUpperCase()} APPROVAL
          </h3>
        </div>

        <div className="p-5 space-y-5">
          {/* Outside View Subtitle */}
          <p className="text-center text-xs font-bold text-gray-600 uppercase tracking-widest">
            Outside View
          </p>

          {/* Door Diagram */}
          <DoorDiagram
            panelCount={form.panel_count}
            slideDirection={form.slide_direction}
          />

          {/* Specs Form */}
          <div className="space-y-4">
            {/* Row: Width / Height */}
            <div className="grid grid-cols-2 gap-4">
              <SpecInput
                label="Overall Width"
                suffix='"'
                type="number"
                value={form.overall_width}
                disabled={isSigned}
                onChange={(v) =>
                  setForm({ ...form, overall_width: Number(v) || 0 })
                }
              />
              <SpecInput
                label="Overall Height"
                suffix='"'
                type="number"
                value={form.overall_height}
                disabled={isSigned}
                onChange={(v) =>
                  setForm({ ...form, overall_height: Number(v) || 0 })
                }
              />
            </div>

            {/* Number of Panels */}
            <SpecInput
              label="Number of Panels"
              type="number"
              value={form.panel_count}
              disabled={isSigned}
              onChange={(v) =>
                setForm({ ...form, panel_count: Number(v) || 0 })
              }
            />

            {/* Opening Direction */}
            <SpecRadioRow label="Opening Direction">
              <CheckBtn
                label="Slides Left"
                checked={slidesLeft}
                disabled={isSigned}
                onChange={() => toggleSlideDirection("left")}
              />
              <CheckBtn
                label="Slides Right"
                checked={slidesRight}
                disabled={isSigned}
                onChange={() => toggleSlideDirection("right")}
              />
            </SpecRadioRow>

            {/* In-Swing / Out-Swing */}
            <div className="flex flex-wrap gap-2 -mt-2">
              <CheckBtn
                label="In-Swing"
                checked={isInSwing}
                disabled={isSigned}
                onChange={() => setForm({ ...form, in_swing: toggleCsv(form.in_swing, "interior") })}
              />
              <CheckBtn
                label="Out-Swing"
                checked={isOutSwing}
                disabled={isSigned}
                onChange={() => setForm({ ...form, in_swing: toggleCsv(form.in_swing, "exterior") })}
              />
            </div>

            {/* Lead Panel Location */}
            <SpecRadioRow label="Lead Panel Location">
              <CheckBtn label="Left" checked={leadLeft} disabled />
              <CheckBtn label="Right" checked={leadRight} disabled />
            </SpecRadioRow>

            {/* Frame Color (multi-select) */}
            <SpecRadioRow label="Frame Color">
              <CheckBtn
                label="Black"
                checked={form.frame_color.includes("Black")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, frame_color: toggleCsv(form.frame_color, "Black") })}
              />
              <CheckBtn
                label="White"
                checked={form.frame_color.includes("White")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, frame_color: toggleCsv(form.frame_color, "White") })}
              />
              <CheckBtn
                label="Bronze"
                checked={form.frame_color.includes("Bronze")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, frame_color: toggleCsv(form.frame_color, "Bronze") })}
              />
            </SpecRadioRow>

            {/* Hardware Color (multi-select) */}
            <SpecRadioRow label="Hardware Color">
              <CheckBtn
                label="Black"
                checked={form.hardware_color.includes("Black")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, hardware_color: toggleCsv(form.hardware_color, "Black") })}
              />
              <CheckBtn
                label="White"
                checked={form.hardware_color.includes("White")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, hardware_color: toggleCsv(form.hardware_color, "White") })}
              />
              <CheckBtn
                label="Silver"
                checked={form.hardware_color.includes("Silver")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, hardware_color: toggleCsv(form.hardware_color, "Silver") })}
              />
            </SpecRadioRow>
          </div>

          {/* Signature Area */}
          {isSigned && drawing.customer_name && (
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 text-xs">Customer Name</span>
                  <p className="text-gray-800 font-medium">
                    {drawing.customer_name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Date</span>
                  <p className="text-gray-800 font-medium">
                    {drawing.signature_date ||
                      (drawing.signed_at &&
                        new Date(drawing.signed_at).toLocaleDateString())}
                  </p>
                </div>
              </div>
              {drawing.signature_data && (
                <div>
                  <span className="text-gray-400 text-xs">Signature</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={drawing.signature_data}
                    alt="Customer signature"
                    className="h-16 mt-1 border border-gray-200 rounded bg-white"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {!isSigned && (
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/15"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saved ? "Saved" : "Save Changes"}
          </button>
        )}
        {drawing.status === "draft" && (
          <button
            onClick={onSend}
            disabled={sendLoading || hasChanges}
            title={hasChanges ? "Save changes before sending" : undefined}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/15"
          >
            {sendLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Send to Client
          </button>
        )}
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/15"
        >
          {downloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          Download PDF
        </button>
      </div>

      {/* Signed status message */}
      {isSigned && (
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> Signed by{" "}
          {drawing.customer_name} &mdash; fields are read-only
        </div>
      )}
    </div>
  );
}

/* ── Door Diagram (HTML/CSS) ── */

function DoorDiagram({
  panelCount,
  slideDirection,
}: {
  panelCount: number;
  slideDirection: string;
}) {
  const panels = Math.max(1, panelCount);
  const slidesRight = slideDirection.includes("right") && !slideDirection.includes("left");

  return (
    <div className="bg-[#3a3a40] rounded-lg p-[6px] shadow-inner">
      <div className="bg-[#44444a] rounded p-[4px]">
        <div className="flex gap-[3px]">
          {Array.from({ length: panels }).map((_, i) => (
            <div
              key={i}
              className="flex-1 relative overflow-hidden rounded-sm"
              style={{
                backgroundColor: "#c6daea",
                aspectRatio: "1 / 2.2",
                minHeight: 120,
              }}
            >
              {/* Top header rail tint */}
              <div
                className="absolute inset-x-0 top-0"
                style={{
                  height: "8%",
                  backgroundColor: "#bcd0e4",
                }}
              />
              {/* Diagonal line */}
              <div
                className="absolute inset-0"
                style={{
                  background: slidesRight
                    ? "linear-gradient(to bottom left, transparent calc(50% - 0.5px), #94a5b6 calc(50% - 0.5px), #94a5b6 calc(50% + 0.5px), transparent calc(50% + 0.5px))"
                    : "linear-gradient(to bottom right, transparent calc(50% - 0.5px), #94a5b6 calc(50% - 0.5px), #94a5b6 calc(50% + 0.5px), transparent calc(50% + 0.5px))",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Small UI components ── */

function SpecInput({
  label,
  value,
  onChange,
  type = "text",
  suffix,
  disabled,
}: {
  label: string;
  value: string | number;
  onChange?: (v: string) => void;
  type?: string;
  suffix?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          readOnly={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${
            disabled
              ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
              : "bg-blue-50 text-gray-800 border-blue-200 focus:outline-none focus:border-blue-400"
          }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SpecRadioRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1.5">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function RadioBtn({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onChange}
      disabled={disabled && !checked}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
        checked
          ? "bg-blue-100 border-blue-300 text-blue-800"
          : disabled
            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 cursor-pointer"
      }`}
    >
      <span
        className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
          checked ? "border-blue-500" : "border-gray-300"
        }`}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      </span>
      {label}
    </button>
  );
}

function CheckBtn({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onChange}
      disabled={disabled && !checked}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
        checked
          ? "bg-blue-100 border-blue-300 text-blue-800"
          : disabled
            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 cursor-pointer"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${
          checked ? "border-blue-500 bg-blue-500" : "border-gray-300"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

function toggleCsv(current: string, value: string): string {
  const values = current.split(",").map((v) => v.trim()).filter(Boolean);
  const idx = values.indexOf(value);
  if (idx >= 0) {
    values.splice(idx, 1);
  } else {
    values.push(value);
  }
  return values.join(",") || value;
}
