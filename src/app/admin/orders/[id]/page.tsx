import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Package, User, Mail, DoorOpen, Layers, Palette, GlassWater,
  Ruler, ScrollText, CreditCard, Truck, MapPin, ArrowRightLeft, PanelLeft,
  Wrench, Move, Factory, CheckCircle2, Clock, Download, Paperclip,
} from "lucide-react";
import { getOrderById, syncOrderStatus } from "@/lib/actions/orders";
import { getPaymentsByQuoteId } from "@/lib/actions/payments";
import { getApprovalDrawing } from "@/lib/actions/approval-drawings";
import { getOrderTracking } from "@/lib/actions/order-tracking";
import SendBalanceButton from "@/components/SendBalanceButton";
import SendDepositButton from "@/components/SendDepositButton";
import StartManufacturingButton from "@/components/StartManufacturingButton";
import TrackingCodeInput from "@/components/TrackingCodeInput";
import OrderDownloads from "@/components/OrderDownloads";
import DocumentUploader from "@/components/admin/DocumentUploader";
import { getQuoteDocuments } from "@/lib/actions/quote-documents";

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

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300", label: "Pending" },
  in_progress: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300", label: "In Progress" },
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300", label: "Completed" },
  cancelled: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300", label: "Cancelled" },
  on_hold: { dot: "bg-orange-400", bg: "bg-orange-400/10", text: "text-orange-300", label: "On Hold" },
};

const paymentTypeLabels: Record<string, string> = {
  advance_50: "50% Advance",
  balance_50: "50% Balance",
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ── Progress Timeline ──
const PROGRESS_STEPS = [
  { key: "order_created", label: "Order", icon: Package },
  { key: "deposit_paid", label: "Deposit", icon: CreditCard },
  { key: "manufacturing", label: "Manufacturing", icon: Factory },
  { key: "balance_paid", label: "Balance", icon: CreditCard },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function getProgressIndex(opts: {
  advancePaid: boolean;
  manufacturingStarted: boolean;
  balancePaid: boolean;
  trackingStage?: string;
  orderStatus?: string;
}) {
  // Order status "completed" means fully done
  if (opts.orderStatus === "completed") return 5;

  // Tracking stage is the most reliable source
  if (opts.trackingStage === "delivered") return 5;
  if (opts.trackingStage === "shipping") return 4;
  if (opts.trackingStage === "deposit_2_pending") return 3;
  if (opts.trackingStage === "manufacturing") return 2;

  // Fall back to payment/manufacturing booleans
  if (opts.balancePaid) return 3;
  if (opts.manufacturingStarted) return 2;
  if (opts.advancePaid) return 1;
  return 0;
}

function ProgressTimeline({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center w-full">
      {PROGRESS_STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                      ? "bg-sky-500 text-white ring-[3px] ring-sky-500/20"
                      : "bg-white/[0.04] text-white/20"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1.5 whitespace-nowrap font-medium ${
                  isCurrent ? "text-sky-400" : isCompleted ? "text-emerald-400/70" : "text-white/20"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-1 mt-[-18px] rounded-full ${
                  i < currentIndex ? "bg-emerald-500/60" : "bg-white/[0.04]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const [payments, drawing, tracking, documents] = await Promise.all([
    getPaymentsByQuoteId(order.quote_id),
    getApprovalDrawing(order.quote_id).catch(() => null),
    getOrderTracking(order.quote_id).catch(() => null),
    getQuoteDocuments(order.quote_id).catch(() => []),
  ]);

  // Sync order status based on actual payment states
  const correctedStatus = await syncOrderStatus(order.id, order.quote_id, order.status);
  if (correctedStatus) order.status = correctedStatus;

  const quote = order.quotes as Record<string, unknown> | null;
  const contract = order.contracts as Record<string, unknown> | null;

  const cost = Number(quote?.grand_total ?? quote?.cost ?? 0);
  const totalPaid = payments
    .filter((p: { status: string }) => p.status === "completed")
    .reduce((sum: number, p: { amount: number }) => sum + Number(p.amount), 0);
  const remaining = cost - totalPaid;
  const hasAdvancePayment = payments.some((p: { payment_type: string }) => p.payment_type === "advance_50");
  const hasBalancePayment = payments.some((p: { payment_type: string }) => p.payment_type === "balance_50");
  const advancePaid = payments.some((p: { payment_type: string; status: string }) => p.payment_type === "advance_50" && p.status === "completed");
  const balancePaid = payments.some((p: { payment_type: string; status: string }) => p.payment_type === "balance_50" && p.status === "completed");
  const canSendDeposit = !hasAdvancePayment && cost > 0;
  const canSendBalance = advancePaid && !hasBalancePayment && remaining > 0;
  const manufacturingStarted = !!tracking?.manufacturing_started_at;
  const canStartManufacturing = advancePaid && !manufacturingStarted;

  const progressIndex = getProgressIndex({
    advancePaid,
    manufacturingStarted,
    balancePaid,
    trackingStage: tracking?.stage,
    orderStatus: order.status,
  });

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

  const specs = [
    { label: "Door Type", value: quote?.door_type as string, icon: DoorOpen },
    { label: "Material", value: quote?.material as string, icon: Layers },
    { label: "Glass Type", value: quote?.glass_type as string, icon: GlassWater },
    { label: "Overall Size", value: drawing ? `${drawing.overall_width}" x ${drawing.overall_height}"` : (quote?.size as string), icon: Ruler },
    { label: "Panels", value: drawing ? String(drawing.panel_count) : null, icon: PanelLeft },
    { label: "Opening Direction", value: drawing ? directionLabels[drawing.slide_direction] || drawing.slide_direction : null, icon: ArrowRightLeft },
    { label: "Swing", value: drawing ? swingLabels[drawing.in_swing] || drawing.in_swing : null, icon: Move },
    { label: "Frame Color", value: drawing?.frame_color || (quote?.color as string), icon: Palette },
    { label: "Hardware Color", value: drawing?.hardware_color || null, icon: Wrench },
    ...(drawing?.system_type ? [{ label: "System Type", value: drawing.system_type, icon: Layers }] : []),
    ...(drawing?.configuration ? [{ label: "Configuration", value: drawing.configuration, icon: PanelLeft }] : []),
  ].filter((s) => s.value);

  const deliveryType = quote?.delivery_type as string | undefined;
  const deliveryAddress = quote?.delivery_address as string | undefined;

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* ── Header ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-6 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{order.order_number}</h1>
                <p className="text-white/35 text-sm mt-0.5">
                  Created {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Progress Timeline */}
          <div className="px-2">
            <ProgressTimeline currentIndex={progressIndex} />
          </div>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT COLUMN (main content) ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Door Specifications */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <DoorOpen className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Door Specifications</h2>
            </div>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-3">
                {specs.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3 sm:p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-3.5 h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">{label}</p>
                    </div>
                    <p className="text-white font-medium text-sm">{value || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contract */}
          {contract && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <ScrollText className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Contract</h2>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-5">
                  {typeof contract.signature_url === "string" && contract.signature_url && (
                    <div className="shrink-0">
                      <div className="w-28 h-16 bg-white rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={contract.signature_url}
                          alt="Client signature"
                          width={112}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1">
                    <div>
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-0.5">Signed</p>
                      <p className="text-white/60 text-sm">
                        {contract.signed_at
                          ? new Date(contract.signed_at as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-0.5">IP Address</p>
                      <p className="text-white/40 font-mono text-xs">{(contract.ip_address as string) || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Payments</h2>
              </div>
              {/* Summary in header */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-semibold">${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                <span className="text-white/15">/</span>
                <span className="text-white/40">${cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              {/* Payment Progress Bar */}
              {cost > 0 && (
                <div className="mb-5">
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.min((totalPaid / cost) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-white/25 text-[11px]">
                      {Math.round((totalPaid / cost) * 100)}% paid
                    </span>
                    {remaining > 0 && (
                      <span className="text-amber-400/60 text-[11px]">
                        ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })} remaining
                      </span>
                    )}
                  </div>
                </div>
              )}

              {payments.length === 0 ? (
                <p className="text-white/30 text-sm">No payments recorded yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {payments.map((p: { id: string; payment_type: string; amount: number; status: string; created_at: string }) => (
                    <div key={p.id} className={`rounded-xl bg-white/[0.03] border p-3.5 flex items-center justify-between ${p.status === "completed" ? "border-emerald-500/20" : "border-white/[0.04]"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === "completed" ? "bg-emerald-400" : "bg-amber-400"}`} />
                        <div>
                          <p className="text-white font-medium text-sm">{paymentTypeLabels[p.payment_type] || p.payment_type}</p>
                          <p className="text-white/25 text-xs">
                            {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-white font-semibold text-sm">
                          ${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${
                          p.status === "completed"
                            ? "text-emerald-400 bg-emerald-500/10"
                            : "text-amber-400 bg-amber-500/10"
                        }`}>
                          {p.status === "completed" ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Send Deposit Invoice */}
              {canSendDeposit && (
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <SendDepositButton
                    quoteId={order.quote_id}
                    clientName={order.client_name}
                    amount={Math.round(cost * 50) / 100}
                  />
                </div>
              )}

              {/* Send Balance Invoice */}
              {canSendBalance && (
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <SendBalanceButton
                    quoteId={order.quote_id}
                    contractId={order.contract_id}
                    clientName={order.client_name}
                    amount={remaining}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (sidebar) ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Client & Delivery */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Client</h2>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 flex items-center justify-center text-white font-bold text-sm">
                  {order.client_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{order.client_name}</p>
                  <p className="text-white/40 text-xs truncate">{order.client_email}</p>
                </div>
              </div>

              <div className="h-px bg-white/[0.04]" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">Quote</span>
                  <span className="text-white/60 font-mono text-xs">{(quote?.quote_number as string) || "-"}</span>
                </div>
                {deliveryType && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs">Delivery</span>
                      <span className="text-white/60 text-xs capitalize flex items-center gap-1.5">
                        {deliveryType === "delivery" ? (
                          <Truck className="w-3 h-3 text-sky-400" />
                        ) : (
                          <MapPin className="w-3 h-3 text-amber-400" />
                        )}
                        {deliveryType}
                      </span>
                    </div>
                    {deliveryType === "delivery" && deliveryAddress && (
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                        <p className="text-white/50 text-xs leading-relaxed flex items-start gap-2">
                          <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-white/20" />
                          {formatDeliveryAddress(deliveryAddress)}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Operations — Manufacturing + Shipping */}
          {(canStartManufacturing || manufacturingStarted) && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Factory className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Operations</h2>
              </div>
              <div className="p-5 sm:p-6 space-y-5">
                {/* Manufacturing Status */}
                <div>
                  <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-3">Manufacturing</p>
                  {manufacturingStarted ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/5 border border-sky-500/10">
                      <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                        <Factory className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">In Progress</p>
                        <p className="text-white/30 text-xs">
                          Started {new Date(tracking!.manufacturing_started_at!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white/35 text-xs mb-3">
                        Deposit received. Start manufacturing and notify the client.
                      </p>
                      <StartManufacturingButton orderId={id} clientName={order.client_name} clientEmail={order.client_email} />
                    </div>
                  )}
                </div>

                {/* Shipping / Tracking */}
                {tracking && manufacturingStarted && (
                  <div>
                    <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-3 flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5" /> Shipping
                    </p>
                    <TrackingCodeInput
                      trackingId={tracking.id}
                      quoteId={order.quote_id}
                      initialTrackingNumber={tracking.tracking_number}
                      initialCarrier={tracking.shipping_carrier}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents / Downloads */}
          <OrderDownloads
            order={{
              order_number: order.order_number,
              client_name: order.client_name,
              client_email: order.client_email,
              status: order.status,
              created_at: order.created_at,
            }}
            quote={{
              quote_number: (quote?.quote_number as string) || "",
              door_type: (quote?.door_type as string) || "",
              cost: cost,
              material: (quote?.material as string) || "",
              color: (quote?.color as string) || "",
              glass_type: (quote?.glass_type as string) || "",
              size: (quote?.size as string) || "",
              client_email: order.client_email,
              delivery_type: deliveryType,
              delivery_address: deliveryAddress,
            }}
            contract={contract ? {
              client_name: (contract.client_name as string) || order.client_name,
              signature_url: (contract.signature_url as string) || "",
              signed_at: (contract.signed_at as string) || "",
            } : null}
            payments={payments.map((p: { id: string; client_name: string; amount: number; payment_type: string; status: string; created_at: string }) => ({
              id: p.id,
              client_name: p.client_name,
              amount: Number(p.amount),
              payment_type: p.payment_type,
              status: p.status,
              created_at: p.created_at,
            }))}
            drawing={drawing ? {
              overall_width: drawing.overall_width,
              overall_height: drawing.overall_height,
              panel_count: drawing.panel_count,
              slide_direction: drawing.slide_direction,
              in_swing: drawing.in_swing,
              frame_color: drawing.frame_color,
              hardware_color: drawing.hardware_color,
              customer_name: drawing.customer_name,
              signature_data: drawing.signature_data,
              signed_at: drawing.signed_at,
            } : null}
            quoteId={order.quote_id}
          />

          {/* Uploaded Documents */}
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
              <DocumentUploader quoteId={order.quote_id} initialDocuments={documents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
