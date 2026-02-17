"use client";

import { useState } from "react";
import {
  Link2,
  ClipboardCheck,
  Camera,
  Truck,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Loader2,
  Calendar,
  Factory,
  Package,
  MapPin,
} from "lucide-react";
import {
  createApprovalDrawing,
  sendApprovalDrawing,
} from "@/lib/actions/approval-drawings";
import {
  createOrderTracking,
  updateOrderStage,
  markDepositPaid,
  addShippingUpdate,
} from "@/lib/actions/order-tracking";
import { addQuotePhoto, deleteQuotePhoto } from "@/lib/actions/quote-photos";
import { scheduleFollowUps } from "@/lib/actions/follow-ups";
import type { ApprovalDrawing, OrderTracking, QuotePhoto, FollowUpEntry } from "@/lib/types";

interface AdminPortalManagerProps {
  quoteId: string;
  quoteName: string;
  grandTotal: number;
  drawing: ApprovalDrawing | null;
  tracking: OrderTracking | null;
  photos: QuotePhoto[];
  followUps: FollowUpEntry[];
  leadId: string | null;
  portalStage: string;
}

export default function AdminPortalManager({
  quoteId,
  quoteName,
  grandTotal,
  drawing: initialDrawing,
  tracking: initialTracking,
  photos: initialPhotos,
  followUps: initialFollowUps,
  leadId,
  portalStage,
}: AdminPortalManagerProps) {
  const [drawing, setDrawing] = useState(initialDrawing);
  const [tracking, setTracking] = useState(initialTracking);
  const [photos, setPhotos] = useState(initialPhotos);
  const [followUps] = useState(initialFollowUps);
  const [openSection, setOpenSection] = useState<string | null>("portal");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleSection(s: string) {
    setOpenSection(openSection === s ? null : s);
  }

  // ── Approval Drawing ──
  const [adForm, setAdForm] = useState({
    overall_width: drawing?.overall_width || 0,
    overall_height: drawing?.overall_height || 0,
    panel_count: drawing?.panel_count || 0,
    slide_direction: drawing?.slide_direction || "left",
    in_swing: drawing?.in_swing || "interior",
    system_type: drawing?.system_type || "",
    configuration: drawing?.configuration || "",
    additional_notes: drawing?.additional_notes || "",
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

  // ── Photos ──
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoType, setPhotoType] = useState("interior");
  const [photoCaption, setPhotoCaption] = useState("");

  async function handleAddPhoto() {
    if (!photoUrl.trim()) return;
    setLoading("photo");
    try {
      const p = await addQuotePhoto({
        quote_id: quoteId,
        photo_url: photoUrl,
        photo_type: photoType,
        caption: photoCaption || undefined,
      });
      setPhotos([p, ...photos]);
      setPhotoUrl("");
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

  // ── Order Tracking ──
  async function handleCreateTracking() {
    setLoading("tracking");
    setError(null);
    try {
      const t = await createOrderTracking(quoteId, grandTotal);
      setTracking(t);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize tracking");
    } finally {
      setLoading(null);
    }
  }

  async function handleMarkDeposit(num: 1 | 2) {
    if (!tracking) return;
    if (!confirm(`Mark deposit ${num} as paid?`)) return;
    setLoading(`deposit-${num}`);
    try {
      await markDepositPaid(tracking.id, quoteId, num);
      setTracking({
        ...tracking,
        [`deposit_${num}_paid`]: true,
        [`deposit_${num}_paid_at`]: new Date().toISOString(),
        stage: num === 1 ? "manufacturing" : "shipping",
      } as OrderTracking);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleAdvanceStage(stage: string) {
    if (!tracking) return;
    setLoading("stage");
    try {
      await updateOrderStage(tracking.id, quoteId, stage);
      setTracking({ ...tracking, stage });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  // ── Shipping Update ──
  const [shipStatus, setShipStatus] = useState("");
  const [shipLocation, setShipLocation] = useState("");

  async function handleAddShipUpdate() {
    if (!tracking || !shipStatus.trim()) return;
    setLoading("ship-update");
    try {
      const update = { date: new Date().toISOString(), status: shipStatus, location: shipLocation || undefined };
      await addShippingUpdate(tracking.id, quoteId, update);
      setTracking({
        ...tracking,
        shipping_updates: [...(tracking.shipping_updates || []), update],
      });
      setShipStatus("");
      setShipLocation("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  // ── Follow-ups ──
  async function handleScheduleFollowUps() {
    if (!leadId) return;
    setLoading("followups");
    try {
      await scheduleFollowUps(leadId, quoteId);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  const portalUrl = typeof window !== "undefined"
    ? `${window.location.origin}/portal/${quoteId}`
    : `/portal/${quoteId}`;

  return (
    <div className="space-y-3">
      {/* Portal Link */}
      <Section
        title="Client Portal"
        icon={<Link2 className="w-4 h-4 text-violet-400" />}
        isOpen={openSection === "portal"}
        onToggle={() => toggleSection("portal")}
        badge={portalStage}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={portalUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/60 text-xs font-mono"
            />
            <button
              onClick={() => navigator.clipboard.writeText(portalUrl)}
              className="px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors cursor-pointer"
            >
              Copy
            </button>
          </div>
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-violet-400 hover:text-violet-300"
          >
            Open portal in new tab &rarr;
          </a>
        </div>
      </Section>

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
            <div className="grid grid-cols-2 gap-3">
              <Input label="Width (in)" type="number" value={adForm.overall_width} onChange={(v) => setAdForm({ ...adForm, overall_width: Number(v) })} />
              <Input label="Height (in)" type="number" value={adForm.overall_height} onChange={(v) => setAdForm({ ...adForm, overall_height: Number(v) })} />
              <Input label="Panel Count" type="number" value={adForm.panel_count} onChange={(v) => setAdForm({ ...adForm, panel_count: Number(v) })} />
              <Select label="Slide Direction" value={adForm.slide_direction} options={["left", "right", "bi-part"]} onChange={(v) => setAdForm({ ...adForm, slide_direction: v })} />
              <Select label="In-Swing" value={adForm.in_swing} options={["interior", "exterior"]} onChange={(v) => setAdForm({ ...adForm, in_swing: v })} />
              <Input label="System Type" value={adForm.system_type} onChange={(v) => setAdForm({ ...adForm, system_type: v })} />
            </div>
            <Input label="Configuration" value={adForm.configuration} onChange={(v) => setAdForm({ ...adForm, configuration: v })} />
            <Input label="Additional Notes" value={adForm.additional_notes} onChange={(v) => setAdForm({ ...adForm, additional_notes: v })} />
            <Btn onClick={handleCreateDrawing} loading={loading === "drawing"} icon={<Plus className="w-3.5 h-3.5" />}>
              Create Approval Drawing
            </Btn>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <Stat label="Width" value={`${drawing.overall_width}"`} />
              <Stat label="Height" value={`${drawing.overall_height}"`} />
              <Stat label="Panels" value={String(drawing.panel_count)} />
              <Stat label="Direction" value={drawing.slide_direction} />
              <Stat label="Status" value={drawing.status} />
              {drawing.signed_at && <Stat label="Signed" value={new Date(drawing.signed_at).toLocaleDateString()} />}
            </div>
            {drawing.status === "draft" && (
              <Btn onClick={handleSendDrawing} loading={loading === "send-drawing"} icon={<Send className="w-3.5 h-3.5" />}>
                Send to Client
              </Btn>
            )}
            {drawing.status === "signed" && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Signed by {drawing.customer_name}
              </div>
            )}
          </div>
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
            <Input label="Photo URL" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." />
            <div className="grid grid-cols-2 gap-2">
              <Select label="Type" value={photoType} options={["interior", "exterior", "other"]} onChange={setPhotoType} />
              <Input label="Caption" value={photoCaption} onChange={setPhotoCaption} placeholder="Optional" />
            </div>
            <Btn onClick={handleAddPhoto} loading={loading === "photo"} icon={<Plus className="w-3.5 h-3.5" />}>
              Add Photo
            </Btn>
          </div>
        </div>
      </Section>

      {/* Order Tracking */}
      <Section
        title="Order Tracking"
        icon={<Truck className="w-4 h-4 text-emerald-400" />}
        isOpen={openSection === "tracking"}
        onToggle={() => toggleSection("tracking")}
        badge={tracking?.stage || "none"}
      >
        {!tracking ? (
          <div className="space-y-2">
            {error && (
              <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <Btn onClick={handleCreateTracking} loading={loading === "tracking"} icon={<Plus className="w-3.5 h-3.5" />}>
              Initialize Order Tracking
            </Btn>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Stat label="Stage" value={tracking.stage.replace(/_/g, " ")} />
              <Stat label="Deposit 1" value={tracking.deposit_1_paid ? "Paid" : "Pending"} />
              <Stat label="Deposit 2" value={tracking.deposit_2_paid ? "Paid" : "Pending"} />
              {tracking.tracking_number && <Stat label="Tracking" value={tracking.tracking_number} />}
            </div>

            <div className="flex flex-wrap gap-2">
              {!tracking.deposit_1_paid && (
                <Btn onClick={() => handleMarkDeposit(1)} loading={loading === "deposit-1"} icon={<CheckCircle2 className="w-3.5 h-3.5" />} variant="green">
                  Mark Deposit 1 Paid
                </Btn>
              )}
              {tracking.deposit_1_paid && tracking.stage === "manufacturing" && (
                <Btn onClick={() => handleAdvanceStage("deposit_2_pending")} loading={loading === "stage"} icon={<Factory className="w-3.5 h-3.5" />}>
                  Manufacturing Complete
                </Btn>
              )}
              {!tracking.deposit_2_paid && tracking.deposit_1_paid && tracking.stage === "deposit_2_pending" && (
                <Btn onClick={() => handleMarkDeposit(2)} loading={loading === "deposit-2"} icon={<CheckCircle2 className="w-3.5 h-3.5" />} variant="green">
                  Mark Deposit 2 Paid
                </Btn>
              )}
              {tracking.stage === "shipping" && (
                <Btn onClick={() => handleAdvanceStage("delivered")} loading={loading === "stage"} icon={<Package className="w-3.5 h-3.5" />}>
                  Mark Delivered
                </Btn>
              )}
            </div>

            {/* Shipping Updates */}
            {(tracking.stage === "shipping" || tracking.shipping_updates?.length > 0) && (
              <div className="border-t border-white/[0.06] pt-3 space-y-2">
                <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Shipping Updates</p>
                {tracking.shipping_updates?.map((u, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <MapPin className="w-3 h-3 text-white/20 mt-0.5 shrink-0" />
                    <span className="text-white/50">{u.status} {u.location && `— ${u.location}`}</span>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Status" value={shipStatus} onChange={setShipStatus} placeholder="On vessel..." />
                  <Input label="Location" value={shipLocation} onChange={setShipLocation} placeholder="Long Beach, CA" />
                </div>
                <Btn onClick={handleAddShipUpdate} loading={loading === "ship-update"} icon={<Plus className="w-3.5 h-3.5" />}>
                  Add Update
                </Btn>
              </div>
            )}
          </div>
        )}
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
          {followUps.map((f) => (
            <div key={f.id} className="flex items-center justify-between text-xs bg-white/[0.03] rounded-lg px-3 py-2">
              <div>
                <span className="text-white/50">#{f.sequence_number} — </span>
                <span className="text-white/70">
                  {new Date(f.scheduled_for).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                f.status === "sent" ? "bg-green-400/10 text-green-300" :
                f.status === "cancelled" ? "bg-red-400/10 text-red-300" :
                "bg-amber-400/10 text-amber-300"
              }`}>
                {f.status}
              </span>
            </div>
          ))}
          {followUps.length === 0 && leadId && (
            <Btn onClick={handleScheduleFollowUps} loading={loading === "followups"} icon={<Plus className="w-3.5 h-3.5" />}>
              Schedule Follow-ups (every 4 days)
            </Btn>
          )}
          {!leadId && (
            <p className="text-xs text-white/25">No lead linked — follow-ups require a lead ID</p>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.03] rounded-lg px-2.5 py-2">
      <p className="text-[9px] text-white/25 uppercase tracking-wider">{label}</p>
      <p className="text-white/60 font-medium capitalize">{value}</p>
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
