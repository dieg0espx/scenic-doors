"use client";

import { useState, useRef, useCallback } from "react";
import {
  ClipboardCheck,
  Camera,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Send,
  Loader2,
  Calendar,
  Upload,
  Download,
  X,
} from "lucide-react";
import {
  createApprovalDrawing,
  sendApprovalDrawing,
} from "@/lib/actions/approval-drawings";
import { generateApprovalDrawingPdf } from "@/lib/generateApprovalDrawingPdf";
import ApprovalDrawingEditor from "@/components/admin/ApprovalDrawingEditor";
import { addQuotePhoto, deleteQuotePhoto } from "@/lib/actions/quote-photos";
import { scheduleFollowUps } from "@/lib/actions/follow-ups";
import type { ApprovalDrawing, QuotePhoto, FollowUpEntry } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuoteItem = Record<string, any>;

const FOLLOW_UP_MESSAGES: Record<number, { subject: string; body: string }> = {
  1: {
    subject: "Had a chance to review your quote?",
    body: "We wanted to check in and see if you've had a chance to review your door quote. We're here to answer any questions you might have about the project.",
  },
  2: {
    subject: "Just checking in on your door project",
    body: "We noticed you haven't had a chance to respond to your quote yet. We understand these decisions take time — just wanted to make sure you have everything you need.",
  },
  3: {
    subject: "Final follow-up on your Scenic Doors quote",
    body: "This is our final follow-up regarding your door quote. If your plans have changed, no worries at all. If you'd still like to move forward, we're ready when you are.",
  },
};

interface AdminPortalManagerProps {
  quoteId: string;
  quoteName: string;
  quoteColor?: string;
  quoteItems?: QuoteItem[];
  drawing: ApprovalDrawing | null;
  photos: QuotePhoto[];
  followUps: FollowUpEntry[];
}

function deriveSlideDirection(item: QuoteItem): string {
  const layout = (item.panelLayout || "").toLowerCase();
  if (layout.includes("+") || layout.includes("center") || layout.includes("split")) return "bi-part";
  if (layout.includes("right") || layout.endsWith("r")) return "right";
  return "left";
}

export default function AdminPortalManager({
  quoteId,
  quoteName,
  quoteColor,
  quoteItems = [],
  drawing: initialDrawing,
  photos: initialPhotos,
  followUps: initialFollowUps,
}: AdminPortalManagerProps) {
  const [drawing, setDrawing] = useState(initialDrawing);
  const [photos, setPhotos] = useState(initialPhotos);
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [openSection, setOpenSection] = useState<string | null>("portal");
  const [loading, setLoading] = useState<string | null>(null);

  function toggleSection(s: string) {
    setOpenSection(openSection === s ? null : s);
  }

  // ── Approval Drawing ──
  // Pre-populate from first quote item when no drawing exists
  const firstItem = quoteItems[0];

  const [adForm, setAdForm] = useState({
    overall_width: drawing?.overall_width || firstItem?.width || 0,
    overall_height: drawing?.overall_height || firstItem?.height || 0,
    panel_count: drawing?.panel_count || firstItem?.panelCount || 0,
    slide_direction: drawing?.slide_direction || (firstItem ? deriveSlideDirection(firstItem) : "left"),
    in_swing: drawing?.in_swing || "interior",
    system_type: drawing?.system_type || firstItem?.doorType || "",
    configuration: drawing?.configuration || firstItem?.panelLayout || "",
    additional_notes: drawing?.additional_notes || "",
    frame_color: drawing?.frame_color || firstItem?.exteriorFinish || quoteColor || "Black",
    hardware_color: drawing?.hardware_color || firstItem?.hardwareFinish || "Black",
  });

  async function handleCreateDrawing() {
    setLoading("drawing");
    try {
      const d = await createApprovalDrawing({ quote_id: quoteId, ...adForm });
      setDrawing(d);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleSendDrawing() {
    if (!drawing) return;
    setLoading("send-drawing");
    try {
      await sendApprovalDrawing(drawing.id, quoteId);
      setDrawing({ ...drawing, status: "sent", sent_at: new Date().toISOString() });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleDownloadDrawingPdf() {
    if (!drawing) return;
    setLoading("download-drawing");
    try {
      const doc = await generateApprovalDrawingPdf({
        overall_width: drawing.overall_width,
        overall_height: drawing.overall_height,
        panel_count: drawing.panel_count,
        slide_direction: drawing.slide_direction,
        in_swing: drawing.in_swing,
        frame_color: quoteColor,
        customer_name: drawing.customer_name,
        signature_data: drawing.signature_data,
        signed_at: drawing.signed_at,
      });
      doc.save(`Approval-Drawing-${quoteId.slice(0, 8)}.pdf`);
    } catch {
      alert("Failed to generate PDF");
    } finally {
      setLoading(null);
    }
  }

  // ── Photos ──
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState("interior");
  const [photoCaption, setPhotoCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Maximum size is 10MB");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function clearPhotoSelection() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAddPhoto() {
    if (!photoFile) return;
    setLoading("photo");
    try {
      const formData = new FormData();
      formData.append("file", photoFile);

      const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");

      const p = await addQuotePhoto({
        quote_id: quoteId,
        photo_url: result.url,
        photo_type: photoType,
        caption: photoCaption || undefined,
      });
      setPhotos([p, ...photos]);
      clearPhotoSelection();
      setPhotoCaption("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleDeletePhoto(id: string) {
    if (!confirm("Delete this photo?")) return;
    try {
      await deleteQuotePhoto(id, quoteId);
      setPhotos(photos.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="space-y-3">
      {/* Approval Drawing */}
      <Section
        title="Approval Drawing"
        icon={<ClipboardCheck className="w-4 h-4 text-amber-400" />}
        isOpen={openSection === "drawing"}
        onToggle={() => toggleSection("drawing")}
        badge={drawing?.status || "none"}
      >
        {!drawing ? (
          <div className="space-y-3">
            {/* Document Preview Card — same layout as editor */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-900 text-white px-5 py-3 text-center">
                <h3 className="text-sm font-bold tracking-wider">
                  SCENIC DOORS &ndash; SLIDE &amp; STACK APPROVAL
                </h3>
              </div>
              <div className="p-5 space-y-5">
                {/* Door Diagram — only shown once panels are set */}
                {adForm.panel_count > 0 && (
                  <>
                    <p className="text-center text-xs font-bold text-gray-600 uppercase tracking-widest">
                      Outside View
                    </p>
                    <div className="bg-[#3a3a40] rounded-lg p-[6px] shadow-inner">
                      <div className="bg-[#44444a] rounded p-[4px]">
                        <div className="flex gap-[3px]">
                          {Array.from({ length: adForm.panel_count }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 relative overflow-hidden rounded-sm"
                              style={{ backgroundColor: "#c6daea", aspectRatio: "1 / 2.2", minHeight: 120 }}
                            >
                              <div className="absolute inset-x-0 top-0" style={{ height: "8%", backgroundColor: "#bcd0e4" }} />
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: adForm.slide_direction === "right"
                                    ? "linear-gradient(to bottom left, transparent calc(50% - 0.5px), #94a5b6 calc(50% - 0.5px), #94a5b6 calc(50% + 0.5px), transparent calc(50% + 0.5px))"
                                    : "linear-gradient(to bottom right, transparent calc(50% - 0.5px), #94a5b6 calc(50% - 0.5px), #94a5b6 calc(50% + 0.5px), transparent calc(50% + 0.5px))",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Spec Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <CreateSpecInput label="Overall Width" suffix='"' type="number" value={adForm.overall_width} onChange={(v) => setAdForm({ ...adForm, overall_width: Number(v) || 0 })} />
                    <CreateSpecInput label="Overall Height" suffix='"' type="number" value={adForm.overall_height} onChange={(v) => setAdForm({ ...adForm, overall_height: Number(v) || 0 })} />
                  </div>

                  <CreateSpecInput label="Number of Panels" type="number" value={adForm.panel_count} onChange={(v) => setAdForm({ ...adForm, panel_count: Number(v) || 0 })} />

                  <CreateRadioRow label="Opening Direction">
                    <CreateRadio label="Slides Left" checked={adForm.slide_direction === "left"} onChange={() => setAdForm({ ...adForm, slide_direction: "left" })} />
                    <CreateRadio label="Slides Right" checked={adForm.slide_direction === "right"} onChange={() => setAdForm({ ...adForm, slide_direction: "right" })} />
                    <CreateRadio label="Bi-Part" checked={adForm.slide_direction === "bi-part"} onChange={() => setAdForm({ ...adForm, slide_direction: "bi-part" })} />
                  </CreateRadioRow>

                  <CreateRadioRow label="Swing Direction">
                    <CreateRadio label="In-Swing" checked={adForm.in_swing === "interior"} onChange={() => setAdForm({ ...adForm, in_swing: "interior" })} />
                    <CreateRadio label="Out-Swing" checked={adForm.in_swing === "exterior"} onChange={() => setAdForm({ ...adForm, in_swing: "exterior" })} />
                  </CreateRadioRow>

                  <CreateRadioRow label="Frame Color">
                    <CreateRadio label="Black" checked={adForm.frame_color === "Black"} onChange={() => setAdForm({ ...adForm, frame_color: "Black" })} />
                    <CreateRadio label="White" checked={adForm.frame_color === "White"} onChange={() => setAdForm({ ...adForm, frame_color: "White" })} />
                    <CreateRadio label="Bronze" checked={adForm.frame_color === "Bronze"} onChange={() => setAdForm({ ...adForm, frame_color: "Bronze" })} />
                  </CreateRadioRow>

                  <CreateRadioRow label="Hardware Color">
                    <CreateRadio label="Black" checked={adForm.hardware_color === "Black"} onChange={() => setAdForm({ ...adForm, hardware_color: "Black" })} />
                    <CreateRadio label="White" checked={adForm.hardware_color === "White"} onChange={() => setAdForm({ ...adForm, hardware_color: "White" })} />
                    <CreateRadio label="Silver" checked={adForm.hardware_color === "Silver"} onChange={() => setAdForm({ ...adForm, hardware_color: "Silver" })} />
                  </CreateRadioRow>

                  <CreateSpecInput label="System Type" value={adForm.system_type} onChange={(v) => setAdForm({ ...adForm, system_type: v })} />
                  <CreateSpecInput label="Configuration" value={adForm.configuration} onChange={(v) => setAdForm({ ...adForm, configuration: v })} />
                  <CreateSpecInput label="Additional Notes" value={adForm.additional_notes} onChange={(v) => setAdForm({ ...adForm, additional_notes: v })} />
                </div>
              </div>
            </div>

            <Btn onClick={handleCreateDrawing} loading={loading === "drawing"} icon={<Plus className="w-3.5 h-3.5" />}>
              Create Approval Drawing
            </Btn>
          </div>
        ) : (
          <ApprovalDrawingEditor
            drawing={drawing}
            quoteId={quoteId}
            quoteName={quoteName}
            onDrawingUpdate={(updated) => setDrawing(updated)}
            onSend={handleSendDrawing}
            sendLoading={loading === "send-drawing"}
          />
        )}
      </Section>

      {/* Photos */}
      <Section
        title="Site Photos"
        icon={<Camera className="w-4 h-4 text-sky-400" />}
        isOpen={openSection === "photos"}
        onToggle={() => toggleSection("photos")}
        badge={`${photos.length}`}
      >
        <div className="space-y-3">
          {photos.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-white/[0.03] rounded-lg p-2">
              <div className="w-12 h-12 rounded bg-white/[0.06] overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 truncate">{p.caption || p.photo_type}</p>
                <p className="text-[10px] text-white/30">{p.photo_type}</p>
              </div>
              <button onClick={() => handleDeletePhoto(p.id)} className="p-1 text-red-400/60 hover:text-red-400 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="space-y-2">
            {/* Drag-and-drop zone */}
            {!photoPreview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-violet-400 bg-violet-500/10"
                    : "border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]"
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-white/30" />
                <p className="text-xs text-white/40">
                  Drag & drop an image here, or click to browse
                </p>
                <p className="text-[10px] text-white/20 mt-1">
                  JPEG, PNG, WebP, AVIF — max 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-white/[0.03]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Preview" className="w-full max-h-48 object-contain" />
                <button
                  onClick={clearPhotoSelection}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-white/30 text-center py-1">{photoFile?.name}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Select label="Type" value={photoType} options={["interior", "exterior", "reference", "sketch"]} onChange={setPhotoType} />
              <Input label="Caption" value={photoCaption} onChange={setPhotoCaption} placeholder="Optional" />
            </div>
            <Btn onClick={handleAddPhoto} loading={loading === "photo"} icon={<Plus className="w-3.5 h-3.5" />}>
              Upload Photo
            </Btn>
          </div>
        </div>
      </Section>

      {/* Follow-ups */}
      <Section
        title="Follow-up Schedule"
        icon={<Calendar className="w-4 h-4 text-orange-400" />}
        isOpen={openSection === "followups"}
        onToggle={() => toggleSection("followups")}
        badge={`${followUps.filter((f) => f.status === "pending").length} pending`}
      >
        <div className="space-y-2">
          {followUps.map((f) => {
            const msg = FOLLOW_UP_MESSAGES[f.sequence_number] || FOLLOW_UP_MESSAGES[1];
            return (
              <div key={f.id} className="bg-white/[0.03] rounded-lg px-3 py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/40 font-mono">#{f.sequence_number}</span>
                    <span className="text-white/70 font-medium">
                      {new Date(f.scheduled_for).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {f.status === "sent" && f.sent_at && (
                      <span className="text-white/30">
                        sent {new Date(f.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    f.status === "sent" ? "bg-green-400/10 text-green-300" :
                    f.status === "cancelled" ? "bg-red-400/10 text-red-300" :
                    "bg-amber-400/10 text-amber-300"
                  }`}>
                    {f.status}
                  </span>
                </div>
                <p className="text-[11px] text-white/50 font-medium">{msg.subject}</p>
                <p className="text-[10px] text-white/25 leading-relaxed">{msg.body}</p>
              </div>
            );
          })}
          {followUps.filter((f) => f.status === "pending").length === 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/25">
                {followUps.length === 0
                  ? "Follow-ups are scheduled automatically when the quote is created."
                  : "All follow-ups have been sent or cancelled."}
              </p>
              <Btn
                onClick={async () => {
                  setLoading("reschedule");
                  try {
                    const newFollowUps = await scheduleFollowUps(null, quoteId);
                    setFollowUps(newFollowUps);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Failed to schedule");
                  } finally {
                    setLoading(null);
                  }
                }}
                loading={loading === "reschedule"}
                icon={<Calendar className="w-3.5 h-3.5" />}
              >
                Re-schedule
              </Btn>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

// ── Shared UI Primitives ──

function Section({
  title,
  icon,
  isOpen,
  onToggle,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-sm font-semibold text-white flex-1 text-left">{title}</span>
        {badge && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 capitalize">
            {badge}
          </span>
        )}
        {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </button>
      {isOpen && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs focus:outline-none focus:border-white/[0.2] placeholder-white/20"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs focus:outline-none focus:border-white/[0.2]"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-ocean-900">{o}</option>
        ))}
      </select>
    </div>
  );
}

function Btn({
  onClick,
  loading,
  icon,
  variant = "default",
  children,
}: {
  onClick: () => void;
  loading: boolean;
  icon: React.ReactNode;
  variant?: "default" | "green";
  children: React.ReactNode;
}) {
  const colors = variant === "green"
    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/15"
    : "bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/15";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${colors}`}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ── Create-form helpers (white card context) ──

function CreateSpecInput({
  label,
  value,
  onChange,
  type = "text",
  suffix,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-400"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function CreateRadioRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1.5">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function CreateRadio({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
        checked
          ? "bg-blue-100 border-blue-300 text-blue-800"
          : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
      }`}
    >
      <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${checked ? "border-blue-500" : "border-gray-300"}`}>
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
      </span>
      {label}
    </button>
  );
}
