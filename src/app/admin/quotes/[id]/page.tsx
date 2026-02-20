import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Send,
  Download,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  DoorOpen,
  Layers,
  Palette,
  GlassWater,
  Ruler,
  Truck,
  Hash,
  PanelLeft,
  ArrowRightLeft,
  Move,
  Wrench,
  Paperclip,
} from "lucide-react";
import { getQuoteDetail } from "@/lib/actions/quotes";
import { getEmailHistory } from "@/lib/actions/email-history";
import { getApprovalDrawing } from "@/lib/actions/approval-drawings";
import { getQuotePhotos } from "@/lib/actions/quote-photos";
import { getQuoteDocuments } from "@/lib/actions/quote-documents";
import DocumentUploader from "@/components/admin/DocumentUploader";
import { getFollowUps } from "@/lib/actions/follow-ups";
import QuoteDetailClient from "./QuoteDetailClient";
import AdminPortalManager from "@/components/admin/AdminPortalManager";
import PortalLinkBar from "@/components/admin/PortalLinkBar";

export const dynamic = "force-dynamic";

function formatDeliveryAddress(raw: string): string {
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === "object" && p.street) {
      const parts = [p.street, p.unit, p.city, p.state, p.zip].filter(Boolean);
      return parts.join(", ");
    }
  } catch { /* plain text */ }
  return raw;
}

const leadStatusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  new: { dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-300", label: "New" },
  hot: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300", label: "Hot" },
  warm: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300", label: "Warm" },
  cold: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300", label: "Cold" },
  hold: { dot: "bg-gray-400", bg: "bg-gray-400/10", text: "text-gray-300", label: "Hold" },
  archived: { dot: "bg-zinc-500", bg: "bg-zinc-500/10", text: "text-zinc-400", label: "Archived" },
};

const quoteStatusLabels: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-white/[0.06]", text: "text-white/50", label: "Draft" },
  sent: { bg: "bg-sky-400/10", text: "text-sky-300", label: "Sent" },
  viewed: { bg: "bg-violet-400/10", text: "text-violet-300", label: "Viewed" },
  accepted: { bg: "bg-emerald-400/10", text: "text-emerald-300", label: "Accepted" },
  pending_approval: { bg: "bg-amber-400/10", text: "text-amber-300", label: "Pending Approval" },
  approved: { bg: "bg-emerald-400/10", text: "text-emerald-300", label: "Approved" },
  declined: { bg: "bg-red-400/10", text: "text-red-300", label: "Declined" },
  order: { bg: "bg-sky-400/10", text: "text-sky-300", label: "Order" },
};

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [quote, emails, drawing, photos, followUps, documents] = await Promise.all([
    getQuoteDetail(id),
    getEmailHistory(id),
    getApprovalDrawing(id).catch(() => null),
    getQuotePhotos(id).catch(() => []),
    getFollowUps(id).catch(() => []),
    getQuoteDocuments(id).catch(() => []),
  ]);

  if (!quote) redirect("/admin/quotes");

  const total = Number(quote.grand_total || quote.cost || 0);
  const leadStatus = quote.lead_status || "new";
  const lsc = leadStatusConfig[leadStatus] || leadStatusConfig.new;
  const qsc = quoteStatusLabels[quote.status] || quoteStatusLabels.draft;
  const itemsCount = Array.isArray(quote.items) ? quote.items.length : 0;

  const directionLabels: Record<string, string> = {
    left: "Slides Left",
    right: "Slides Right",
    "bi-part": "Bi-Part",
  };
  const swingLabels: Record<string, string> = {
    interior: "In-Swing",
    exterior: "Out-Swing",
    "in-swing": "In-Swing",
    "out-swing": "Out-Swing",
  };

  // Extract detailed specs from the first quote item (what the client configured)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstItem: Record<string, any> | null =
    Array.isArray(quote.items) && quote.items.length > 0 ? quote.items[0] : null;

  const specs = [
    { label: "Door Type", value: quote.door_type, icon: DoorOpen },
    { label: "Material", value: quote.material, icon: Layers },
    {
      label: "Overall Size",
      value: drawing
        ? `${drawing.overall_width}" x ${drawing.overall_height}"`
        : firstItem?.width && firstItem?.height
          ? `${firstItem.width}" x ${firstItem.height}"`
          : quote.size,
      icon: Ruler,
    },
    {
      label: "Panels",
      value: drawing
        ? String(drawing.panel_count)
        : firstItem?.panelCount
          ? String(firstItem.panelCount)
          : null,
      icon: PanelLeft,
    },
    {
      label: "Panel Layout",
      value: drawing?.configuration || firstItem?.panelLayout || null,
      icon: PanelLeft,
    },
    {
      label: "Opening Direction",
      value: drawing
        ? directionLabels[drawing.slide_direction] || drawing.slide_direction
        : null,
      icon: ArrowRightLeft,
    },
    {
      label: "Swing",
      value: drawing
        ? swingLabels[drawing.in_swing] || drawing.in_swing
        : null,
      icon: Move,
    },
    {
      label: "Frame Color",
      value: drawing?.frame_color || firstItem?.exteriorFinish || quote.color,
      icon: Palette,
    },
    ...(firstItem?.interiorFinish && firstItem.interiorFinish !== firstItem.exteriorFinish
      ? [{ label: "Interior Color", value: firstItem.interiorFinish as string, icon: Palette }]
      : []),
    {
      label: "Glass Type",
      value: firstItem?.glassType || quote.glass_type,
      icon: GlassWater,
    },
    {
      label: "Hardware",
      value: drawing?.hardware_color || firstItem?.hardwareFinish || null,
      icon: Wrench,
    },
    ...(drawing?.system_type || firstItem?.systemType
      ? [{ label: "System Type", value: (drawing?.system_type || firstItem?.systemType) as string, icon: Layers }]
      : []),
  ].filter((s) => s.value);

  return (
    <div>
      {/* Back + Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          href="/admin/quotes"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quotes
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/quotes/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>
          <QuoteDetailClient quoteId={id} quoteEmail={quote.client_email} quoteStatus={quote.status} />
        </div>
      </div>

      {/* ── Header Card ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-6 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{quote.quote_number}</h1>
                <p className="text-white/35 text-sm mt-0.5">
                  Created{" "}
                  {new Date(quote.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {quote.created_by && ` by ${quote.created_by}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${lsc.bg} ${lsc.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${lsc.dot}`} />
                {lsc.label}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${qsc.bg} ${qsc.text}`}>
                {qsc.label}
              </span>
            </div>
          </div>

          {/* Pending Approval Banner */}
          {quote.status === "pending_approval" && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-300">Pending Approval</p>
                <p className="text-xs text-amber-300/60">
                  The client has accepted this quote. Review and approve or decline.
                </p>
              </div>
            </div>
          )}

          {/* Portal Link */}
          <PortalLinkBar quoteId={id} />
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Customer Info */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Customer</h2>
              {quote.customer_type && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-400/10 text-indigo-300 ml-auto">
                  {quote.customer_type}
                </span>
              )}
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 flex items-center justify-center text-white font-bold text-sm">
                  {quote.client_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{quote.client_name}</p>
                  <p className="text-white/40 text-xs truncate">{quote.client_email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quote.customer_phone && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <Phone className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-white/50 text-xs">{quote.customer_phone}</span>
                  </div>
                )}
                {quote.customer_zip && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <MapPin className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-white/50 text-xs">{quote.customer_zip}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Door Specifications */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <DoorOpen className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Door Specifications</h2>
            </div>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">{label}</p>
                    </div>
                    <p className="text-white font-medium text-sm">{value || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line Items */}
          {Array.isArray(quote.items) && quote.items.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-sky-400" />
                  </div>
                  <h2 className="text-base font-semibold text-white">Line Items</h2>
                </div>
                <span className="text-white/25 text-xs">{itemsCount} item{itemsCount !== 1 ? "s" : ""}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Item</th>
                      <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Qty</th>
                      <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Price</th>
                      <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {quote.items.map((item: { id?: string; name: string; quantity: number; unit_price: number; total: number; description?: string }, idx: number) => (
                      <tr key={item.id || idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-5 py-3 text-white/70">
                          {item.name}
                          {item.description && (
                            <p className="text-white/25 text-xs mt-0.5">{item.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-white/50">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-white/50">
                          ${Number(item.unit_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3 text-right text-white font-medium">
                          ${Number(item.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {quote.notes && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6">
              <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-2">Notes</p>
              <p className="text-sm text-white/50 leading-relaxed">{quote.notes}</p>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN (sidebar) ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Pricing Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Pricing</h2>
            </div>
            <div className="p-5 sm:p-6">
              {/* Grand Total - prominent */}
              <div className="text-center mb-5 pb-5 border-b border-white/[0.06]">
                <p className="text-white/30 text-[11px] uppercase tracking-wider font-medium mb-1">Grand Total</p>
                <p className="text-3xl font-bold text-white">
                  ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5">
                {Number(quote.subtotal) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white/60">${Number(quote.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {Number(quote.installation_cost) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Installation</span>
                    <span className="text-white/60">${Number(quote.installation_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {Number(quote.delivery_cost) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Delivery</span>
                    <span className="text-white/60">${Number(quote.delivery_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {Number(quote.tax) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Tax</span>
                    <span className="text-white/60">${Number(quote.tax).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          {quote.delivery_type && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Delivery</h2>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  {quote.delivery_type === "delivery" ? (
                    <Truck className="w-4 h-4 text-sky-400" />
                  ) : (
                    <MapPin className="w-4 h-4 text-amber-400" />
                  )}
                  <p className="text-white font-medium text-sm capitalize">{quote.delivery_type}</p>
                </div>
                {quote.delivery_type === "delivery" && quote.delivery_address && (
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5 mt-2">
                    <p className="text-white/50 text-xs leading-relaxed flex items-start gap-2">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-white/20" />
                      {formatDeliveryAddress(quote.delivery_address)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email History */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Send className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Emails</h2>
              </div>
              <span className="text-white/20 text-xs font-medium">{emails.length}</span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {emails.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-white/25 text-sm">No emails sent yet</p>
                </div>
              ) : (
                emails.slice(0, 5).map((e) => (
                  <div key={e.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/[0.06] flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-sky-400/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/60 text-xs truncate">{e.subject}</p>
                      <p className="text-white/20 text-[10px]">
                        {new Date(e.sent_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {emails.length > 5 && (
                <div className="px-5 py-2.5 text-center">
                  <span className="text-white/20 text-[11px]">+{emails.length - 5} more</span>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Paperclip className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Attachments</h2>
              {documents.length > 0 && (
                <span className="text-white/20 text-xs font-medium ml-auto">{documents.length}</span>
              )}
            </div>
            <div className="p-5 sm:p-6">
              <DocumentUploader quoteId={id} initialDocuments={documents} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Portal Management (full-width) ── */}
      <AdminPortalManager
        quoteId={id}
        quoteName={quote.client_name}
        quoteColor={quote.color}
        quoteItems={Array.isArray(quote.items) ? quote.items : []}
        drawing={drawing}
        photos={photos}
        followUps={followUps}
      />
    </div>
  );
}
