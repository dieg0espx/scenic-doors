import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
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
  MessageSquare,
  Clock,
} from "lucide-react";
import { getQuoteDetail } from "@/lib/actions/quotes";
import { getQuoteNotes } from "@/lib/actions/quote-notes";
import { getQuoteTasks } from "@/lib/actions/quote-tasks";
import { getEmailHistory } from "@/lib/actions/email-history";
import { getApprovalDrawing } from "@/lib/actions/approval-drawings";
import { getOrderTracking } from "@/lib/actions/order-tracking";
import { getQuotePhotos } from "@/lib/actions/quote-photos";
import { getFollowUps } from "@/lib/actions/follow-ups";
import QuoteDetailClient from "./QuoteDetailClient";
import AdminPortalManager from "@/components/admin/AdminPortalManager";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [quote, notes, tasks, emails, drawing, tracking, photos, followUps] = await Promise.all([
    getQuoteDetail(id),
    getQuoteNotes(id),
    getQuoteTasks(id),
    getEmailHistory(id),
    getApprovalDrawing(id).catch(() => null),
    getOrderTracking(id).catch(() => null),
    getQuotePhotos(id).catch(() => []),
    getFollowUps(id).catch(() => []),
  ]);

  if (!quote) redirect("/admin/quotes");

  const total = Number(quote.grand_total || quote.cost || 0);

  const leadStatusConfig: Record<string, { bg: string; text: string }> = {
    new: { bg: "bg-blue-400/10", text: "text-blue-300" },
    hot: { bg: "bg-red-400/10", text: "text-red-300" },
    warm: { bg: "bg-amber-400/10", text: "text-amber-300" },
    cold: { bg: "bg-sky-400/10", text: "text-sky-300" },
    hold: { bg: "bg-gray-400/10", text: "text-gray-300" },
    archived: { bg: "bg-zinc-500/10", text: "text-zinc-400" },
  };

  const sc = leadStatusConfig[quote.lead_status] || leadStatusConfig.new;

  return (
    <div className="max-w-5xl">
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
            href={`/admin/quotes/${id}/print`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium hover:bg-white/[0.06] hover:text-white/80 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Preview
          </Link>
          <Link
            href={`/admin/quotes/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>
          <QuoteDetailClient quoteId={id} quoteEmail={quote.client_email} />
        </div>
      </div>

      {/* Quote header */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-6">
        <div className="px-5 sm:px-6 py-5 border-b border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {quote.quote_number}
            </h1>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${sc.bg} ${sc.text}`}>
              {quote.lead_status?.charAt(0).toUpperCase() + quote.lead_status?.slice(1)}
            </span>
            <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/50">
              {quote.status}
            </span>
          </div>
          <p className="text-white/35 text-sm">
            Created{" "}
            {new Date(quote.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {quote.created_by && ` by ${quote.created_by}`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5 sm:p-6">
          {/* Customer info */}
          <div className="space-y-3">
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium flex items-center gap-1.5">
              <User className="w-3 h-3" /> Customer
            </p>
            <div className="space-y-1.5 text-sm">
              <p className="text-white font-medium">{quote.client_name}</p>
              <div className="flex items-center gap-1.5 text-white/40">
                <Mail className="w-3.5 h-3.5" />
                <span>{quote.client_email}</span>
              </div>
              {quote.customer_phone && (
                <div className="flex items-center gap-1.5 text-white/40">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{quote.customer_phone}</span>
                </div>
              )}
              {quote.customer_zip && (
                <div className="flex items-center gap-1.5 text-white/40">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{quote.customer_zip}</span>
                </div>
              )}
              {quote.customer_type && (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-400/10 text-indigo-300">
                  {quote.customer_type}
                </span>
              )}
            </div>
          </div>

          {/* Door details */}
          <div className="space-y-3">
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Door Details
            </p>
            <div className="space-y-1.5 text-sm text-white/50">
              <p><span className="text-white/25">Type:</span> {quote.door_type}</p>
              <p><span className="text-white/25">Material:</span> {quote.material}</p>
              <p><span className="text-white/25">Color:</span> {quote.color}</p>
              <p><span className="text-white/25">Glass:</span> {quote.glass_type}</p>
              <p><span className="text-white/25">Size:</span> {quote.size}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium flex items-center gap-1.5">
              <DollarSign className="w-3 h-3" /> Pricing
            </p>
            <div className="space-y-1.5 text-sm">
              {Number(quote.subtotal) > 0 && (
                <div className="flex justify-between text-white/40">
                  <span>Subtotal</span>
                  <span>${Number(quote.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {Number(quote.installation_cost) > 0 && (
                <div className="flex justify-between text-white/40">
                  <span>Installation</span>
                  <span>${Number(quote.installation_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {Number(quote.delivery_cost) > 0 && (
                <div className="flex justify-between text-white/40">
                  <span>Delivery</span>
                  <span>${Number(quote.delivery_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {Number(quote.tax) > 0 && (
                <div className="flex justify-between text-white/40">
                  <span>Tax</span>
                  <span>${Number(quote.tax).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold text-lg">
                  ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        {Array.isArray(quote.items) && quote.items.length > 0 && (
          <div className="px-5 sm:px-6 pb-5">
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-3">
              Line Items
            </p>
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Item</th>
                    <th className="text-right px-4 py-2.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Qty</th>
                    <th className="text-right px-4 py-2.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Price</th>
                    <th className="text-right px-4 py-2.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {quote.items.map((item: { id?: string; name: string; quantity: number; unit_price: number; total: number; description?: string }, idx: number) => (
                    <tr key={item.id || idx}>
                      <td className="px-4 py-2.5 text-white/70">
                        {item.name}
                        {item.description && (
                          <p className="text-white/25 text-xs mt-0.5">{item.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-white/50">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-right text-white/50">
                        ${Number(item.unit_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-right text-white font-medium">
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
          <div className="px-5 sm:px-6 pb-5">
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2">Notes</p>
            <p className="text-sm text-white/50 bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
              {quote.notes}
            </p>
          </div>
        )}
      </div>

      {/* Email History */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <Send className="w-4 h-4 text-sky-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Email History</h3>
          <span className="text-white/25 text-xs">{emails.length}</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {emails.length === 0 ? (
            <div className="px-5 py-6 text-center">
              <p className="text-white/25 text-sm">No emails sent yet</p>
            </div>
          ) : (
            emails.map((e) => (
              <div key={e.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-sky-500/[0.06] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-sky-400/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-sm truncate">{e.subject}</p>
                  <p className="text-white/25 text-xs">to {e.recipient_email}</p>
                </div>
                <span className="text-white/20 text-xs shrink-0">
                  {new Date(e.sent_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notes & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Notes */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Notes</h3>
            <span className="text-white/25 text-xs">{notes.length}</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {notes.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-white/25 text-sm">No notes yet</p>
              </div>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="px-5 py-3">
                  <p className="text-white/60 text-sm">{n.content}</p>
                  <p className="text-white/20 text-xs mt-1">
                    {n.created_by && `${n.created_by} · `}
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Tasks</h3>
            <span className="text-white/25 text-xs">{tasks.length}</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {tasks.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-white/25 text-sm">No tasks yet</p>
              </div>
            ) : (
              tasks.map((t) => (
                <div key={t.id} className="px-5 py-3 flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border shrink-0 ${
                      t.completed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-white/[0.15] bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.completed ? "text-white/30 line-through" : "text-white/60"}`}>
                      {t.title}
                    </p>
                    {t.due_date && (
                      <p className="text-white/20 text-xs mt-0.5">
                        Due: {new Date(t.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delivery info */}
      {quote.delivery_type && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6 mb-6">
          <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2">Delivery</p>
          <p className="text-sm text-white/50">
            <span className="text-white/70 font-medium capitalize">{quote.delivery_type}</span>
            {quote.delivery_address && ` · ${quote.delivery_address}`}
          </p>
        </div>
      )}

      {/* Portal Management */}
      <AdminPortalManager
        quoteId={id}
        quoteName={quote.client_name}
        grandTotal={Number(quote.grand_total || quote.cost || 0)}
        drawing={drawing}
        tracking={tracking}
        photos={photos}
        followUps={followUps}
        leadId={quote.lead_id}
        portalStage={quote.portal_stage || "quote_sent"}
      />
    </div>
  );
}
