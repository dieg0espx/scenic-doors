"use client";

import { useState } from "react";
import { Save, Download, Send, Loader2, CheckCircle2, Eye, X } from "lucide-react";
import { updateApprovalDrawingAndSyncQuote } from "@/lib/actions/approval-drawings";
import { generateApprovalDrawingPdf } from "@/lib/generateApprovalDrawingPdf";
import { savePdf } from "@/lib/savePdf";
import type { ApprovalDrawing } from "@/lib/types";

interface ApprovalDrawingEditorProps {
  drawing: ApprovalDrawing;
  quoteId: string;
  quoteName: string;
  onDrawingUpdate: (updated: ApprovalDrawing) => void;
  onSend: () => void;
  sendLoading: boolean;
}

/* Normalize stored colors like "Bronze (paint)" → "Bronze" */
function normalizeColor(c: string): string {
  return c
    .split(",")
    .map((v) => {
      const t = v.trim().toLowerCase();
      if (t.includes("bronze")) return "Bronze";
      if (t.includes("black")) return "Black";
      if (t.includes("white")) return "White";
      if (t.includes("silver")) return "Silver";
      return v.trim();
    })
    .filter(Boolean)
    .join(",");
}

function toggleCsv(current: string, value: string): string {
  const values = current.split(",").map((v) => v.trim()).filter(Boolean);
  const idx = values.indexOf(value);
  if (idx >= 0) values.splice(idx, 1); else values.push(value);
  return values.join(",");
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
    slide_direction: drawing.slide_direction || "",
    in_swing: drawing.in_swing || "",
    frame_color: normalizeColor(drawing.frame_color || ""),
    hardware_color: normalizeColor(drawing.hardware_color || ""),
  });

  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges =
    form.overall_width !== drawing.overall_width ||
    form.overall_height !== drawing.overall_height ||
    form.panel_count !== drawing.panel_count ||
    form.slide_direction !== (drawing.slide_direction || "") ||
    form.in_swing !== (drawing.in_swing || "") ||
    form.frame_color !== normalizeColor(drawing.frame_color || "") ||
    form.hardware_color !== normalizeColor(drawing.hardware_color || "");

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
      savePdf(doc, `Approval-Drawing-${quoteId.slice(0, 8)}.pdf`);
    } catch {
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  }

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
          {/* Door Diagram — compact preview */}
          <DiagramPreview panelCount={form.panel_count} slideDirection={form.slide_direction} />

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
            <FieldRow label="Opening Direction">
              <CheckBtn
                label="Slides Left"
                checked={form.slide_direction.includes("left")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, slide_direction: toggleCsv(form.slide_direction, "left") })}
              />
              <CheckBtn
                label="Slides Right"
                checked={form.slide_direction.includes("right")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, slide_direction: toggleCsv(form.slide_direction, "right") })}
              />
            </FieldRow>

            {/* Swing Direction */}
            <FieldRow label="Swing Direction">
              <CheckBtn
                label="In-Swing"
                checked={form.in_swing.includes("interior")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, in_swing: toggleCsv(form.in_swing, "interior") })}
              />
              <CheckBtn
                label="Out-Swing"
                checked={form.in_swing.includes("exterior")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, in_swing: toggleCsv(form.in_swing, "exterior") })}
              />
            </FieldRow>

            {/* Lead Panel Location */}
            <FieldRow label="Lead Panel Location">
              <CheckBtn
                label="Left"
                checked={form.slide_direction.includes("left")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, slide_direction: toggleCsv(form.slide_direction, "left") })}
              />
              <CheckBtn
                label="Right"
                checked={form.slide_direction.includes("right")}
                disabled={isSigned}
                onChange={() => setForm({ ...form, slide_direction: toggleCsv(form.slide_direction, "right") })}
              />
            </FieldRow>

            {/* Frame Color */}
            <FieldRow label="Frame Color">
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
            </FieldRow>

            {/* Hardware Color */}
            <FieldRow label="Hardware Color">
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
            </FieldRow>
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
                <SignaturePreview src={drawing.signature_data} />
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

function DiagramPreview({ panelCount, slideDirection }: { panelCount: number; slideDirection: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* Small preview */}
      <div className="flex items-center gap-2">
        <div className="w-28 shrink-0">
          <DoorDiagram panelCount={panelCount} slideDirection={slideDirection} mini />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Outside View</p>
          <p className="text-xs text-gray-600 font-medium">{panelCount} panel{panelCount !== 1 ? "s" : ""}</p>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer mt-0.5"
          >
            <Eye className="w-3 h-3" />
            View full
          </button>
        </div>
      </div>

      {/* Expanded overlay */}
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setExpanded(false)}>
          <div className="relative bg-white rounded-xl p-5 shadow-2xl max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-semibold text-gray-700">Outside View</span>
                <span className="text-xs text-gray-400 ml-2">{panelCount} panel{panelCount !== 1 ? "s" : ""}</span>
              </div>
              <button onClick={() => setExpanded(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <DoorDiagram panelCount={panelCount} slideDirection={slideDirection} />
          </div>
        </div>
      )}
    </div>
  );
}

function DoorDiagram({
  panelCount,
  slideDirection,
  mini,
}: {
  panelCount: number;
  slideDirection: string;
  mini?: boolean;
}) {
  const panels = Math.max(1, panelCount);
  const onlyRight = slideDirection.includes("right") && !slideDirection.includes("left");

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
                minHeight: mini ? 40 : 120,
              }}
            >
              <div
                className="absolute inset-x-0 top-0"
                style={{ height: "8%", backgroundColor: "#bcd0e4" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: onlyRight
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

function FieldRow({
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
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
        disabled
          ? checked
            ? "bg-blue-50 border-blue-200 text-blue-600 cursor-not-allowed"
            : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
          : checked
            ? "bg-blue-100 border-blue-300 text-blue-800 cursor-pointer"
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

function SignaturePreview({ src }: { src: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <span className="text-gray-400 text-xs">Signature</span>
      <div className="mt-1 flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Customer signature"
          className="h-8 w-auto border border-gray-200 rounded bg-white object-contain"
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
        >
          <Eye className="w-3 h-3" />
          View full
        </button>
      </div>

      {/* Expanded overlay */}
      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setExpanded(false)}>
          <div className="relative bg-white rounded-xl p-4 shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Customer Signature</span>
              <button
                onClick={() => setExpanded(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Customer signature"
              className="w-full border border-gray-200 rounded bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
