import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Package, User, Mail, DoorOpen, Layers, Palette, GlassWater,
  Ruler, ScrollText, CreditCard, Truck, MapPin, ArrowRightLeft, PanelLeft,
  Wrench, Move, Factory, CheckCircle2, Clock, Download,
  Phone, Hash, DollarSign, Send, Users, FileText,
} from "lucide-react";
import { getOrderById, syncOrderStatus } from "@/lib/actions/orders";
import { getPaymentsByQuoteId } from "@/lib/actions/payments";
import { getApprovalDrawing, getApprovalDrawings } from "@/lib/actions/approval-drawings";
import { getOrderTracking } from "@/lib/actions/order-tracking";
import { getEmailHistory } from "@/lib/actions/email-history";
import { getQuotePhotos } from "@/lib/actions/quote-photos";
import { getQuoteNotes } from "@/lib/actions/quote-notes";
import { getQuoteTasks } from "@/lib/actions/quote-tasks";
import { getAdminUsers } from "@/lib/actions/admin-users";
import { getCurrentAdminUser } from "@/lib/auth";
import SendBalanceButton from "@/components/SendBalanceButton";
import SendDepositButton from "@/components/SendDepositButton";
import StartManufacturingButton from "@/components/StartManufacturingButton";
import CompleteManufacturingButton from "@/components/CompleteManufacturingButton";
import TrackingCodeInput from "@/components/TrackingCodeInput";
import MarkDeliveredButton from "@/components/MarkDeliveredButton";
import OrderDownloads from "@/components/OrderDownloads";
import { getQuoteDocuments } from "@/lib/actions/quote-documents";
import AdminPortalManager from "@/components/admin/AdminPortalManager";
import QuoteNotesAndTasks from "@/components/admin/QuoteNotesAndTasks";
import PortalLinkBar from "@/components/admin/PortalLinkBar";
import QuoteShareCard from "@/components/admin/QuoteShareCard";
import OrderActionsDropdown from "@/components/admin/OrderActionsDropdown";

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
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="flex items-center w-full min-w-[480px]">
        {PROGRESS_STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                        ? "bg-sky-500 text-white ring-[3px] ring-sky-500/20"
                        : "bg-white/[0.04] text-white/20"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  )}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] mt-1.5 whitespace-nowrap font-medium ${
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
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const [payments, drawing, allDrawings, tracking, documents, emails, photos, notes, tasks, allAdminUsers, currentAdminUser] = await Promise.all([
    getPaymentsByQuoteId(order.quote_id),
    getApprovalDrawing(order.quote_id).catch(() => null),
    getApprovalDrawings(order.quote_id).catch(() => [] as import("@/lib/types").ApprovalDrawing[]),
    getOrderTracking(order.quote_id).catch(() => null),
    getQuoteDocuments(order.quote_id).catch(() => []),
    getEmailHistory(order.quote_id),
    getQuotePhotos(order.quote_id).catch(() => []),
    getQuoteNotes(order.quote_id).catch(() => []),
    getQuoteTasks(order.quote_id).catch(() => []),
    getAdminUsers(),
    getCurrentAdminUser(),
  ]);

  // Sync order status based on actual payment states
  const correctedStatus = await syncOrderStatus(order.id, order.quote_id, order.status);
  if (correctedStatus) order.status = correctedStatus;

  const quote = order.quotes as Record<string, unknown> | null;
  const contract = order.contracts as Record<string, unknown> | null;

  const isAdmin = currentAdminUser?.role === "admin";
  const salesReps = allAdminUsers
    .filter((u) => u.role === "sales" && u.status === "active")
    .map((u) => ({ id: u.id, name: u.name }));

  // Resolve shared_with IDs to names for display
  const sharedWithIds: string[] = (quote?.shared_with as string[]) || [];
  const sharedWithNames = sharedWithIds
    .map((uid: string) => allAdminUsers.find((u) => u.id === uid)?.name)
    .filter(Boolean) as string[];
  const assignedRepName = (quote as Record<string, unknown> & { admin_users?: { name: string } })?.admin_users?.name
    || allAdminUsers.find((u) => u.id === (quote?.assigned_to as string))?.name || null;

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
  const canSendBalance = !hasBalancePayment && remaining > 0;
  const manufacturingStarted = !!tracking?.manufacturing_started_at;
  const manufacturingCompleted = !!tracking?.manufacturing_completed_at;
  const canStartManufacturing = advancePaid && !manufacturingStarted;
  const isDelivered = tracking?.stage === "delivered";
  const canMarkDelivered = tracking?.stage === "shipping" && !isDelivered;

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

  // Extract detailed specs from the first quote item (what the client configured)
  const quoteItems = Array.isArray(quote?.items) ? (quote.items as Record<string, unknown>[]) : [];
  const itemsCount = quoteItems.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstItem: Record<string, any> | null = quoteItems.length > 0 ? quoteItems[0] : null;

  const specs = [
    { label: "Door Type", value: quote?.door_type as string, icon: DoorOpen },
    { label: "Material", value: quote?.material as string, icon: Layers },
    {
      label: "Overall Size",
      value: drawing
        ? `${drawing.overall_width}" x ${drawing.overall_height}"`
        : firstItem?.width && firstItem?.height
          ? `${firstItem.width}" x ${firstItem.height}"`
          : (quote?.size as string),
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
        ? drawing.in_swing.split(",").map((v: string) => swingLabels[v.trim()] || v.trim()).join(", ")
        : null,
      icon: Move,
    },
    {
      label: "Frame Color",
      value: drawing?.frame_color
        ? drawing.frame_color.split(",").map((v: string) => v.trim()).join(", ")
        : firstItem?.exteriorFinish || (quote?.color as string),
      icon: Palette,
    },
    ...(firstItem?.interiorFinish && firstItem.interiorFinish !== firstItem.exteriorFinish
      ? [{ label: "Interior Color", value: firstItem.interiorFinish as string, icon: Palette }]
      : []),
    {
      label: "Glass Type",
      value: firstItem?.glassType || (quote?.glass_type as string),
      icon: GlassWater,
    },
    {
      label: "Hardware",
      value: drawing?.hardware_color
        ? drawing.hardware_color.split(",").map((v: string) => v.trim()).join(", ")
        : firstItem?.hardwareFinish || null,
      icon: Wrench,
    },
    ...(drawing?.system_type || firstItem?.systemType
      ? [{ label: "System Type", value: (drawing?.system_type || firstItem?.systemType) as string, icon: Layers }]
      : []),
  ].filter((s) => s.value);

  const deliveryType = quote?.delivery_type as string | undefined;
  const deliveryAddress = quote?.delivery_address as string | undefined;

  // ── Next Action Banner ──
  const needsTracking = balancePaid && manufacturingCompleted && tracking && !tracking.tracking_number;
  const nextAction = isDelivered ? "complete"
    : canMarkDelivered ? "shipped"
    : needsTracking ? "tracking"
    : balancePaid && manufacturingCompleted && !tracking?.tracking_number ? "tracking"
    : !balancePaid && manufacturingCompleted ? "awaiting_balance"
    : manufacturingStarted && !manufacturingCompleted ? "complete_manufacturing"
    : canStartManufacturing ? "manufacturing"
    : canSendDeposit ? "deposit"
    : "none";

  const bannerStyles = {
    amber: { bg: "bg-amber-500/10 border border-amber-500/20", icon: "bg-amber-500/20", text: "text-amber-300" },
    sky:   { bg: "bg-sky-500/10 border border-sky-500/20",     icon: "bg-sky-500/20",   text: "text-sky-300" },
    emerald: { bg: "bg-emerald-500/10 border border-emerald-500/20", icon: "bg-emerald-500/20", text: "text-emerald-300" },
  };
  const bannerTheme = nextAction === "complete" ? bannerStyles.emerald
    : nextAction === "complete_manufacturing" ? bannerStyles.emerald
    : nextAction === "deposit" || nextAction === "awaiting_balance" ? bannerStyles.amber
    : bannerStyles.sky;

  return (
    <div>
      {/* Back + Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-center gap-2">
          <PortalLinkBar quoteId={order.quote_id} />
          <Link
            href={`/admin/quotes/${order.quote_id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> View Quote
          </Link>
          <OrderActionsDropdown
            quoteId={order.quote_id}
            contractId={order.contract_id}
            clientName={order.client_name}
            depositAmount={Math.round(cost * 50) / 100}
            balanceAmount={remaining}
            canSendDeposit={!hasAdvancePayment && cost > 0}
            canSendBalance={!hasBalancePayment && remaining > 0}
          />
        </div>
      </div>

      {/* ── Header ── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] mb-6 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{order.order_number}</h1>
                <p className="text-white/35 text-xs sm:text-sm mt-0.5 truncate">
                  Created {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Assigned & Shared With preview */}
          {(assignedRepName || sharedWithNames.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {assignedRepName && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-400/10 text-violet-300 text-xs font-medium">
                  <User className="w-3 h-3" />
                  {assignedRepName}
                </span>
              )}
              {sharedWithNames.length > 0 && (
                <>
                  {assignedRepName && <span className="text-white/15 text-xs">shared with</span>}
                  {sharedWithNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-400/10 text-teal-300 text-xs font-medium"
                    >
                      <Users className="w-3 h-3" />
                      {name}
                    </span>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Progress Timeline */}
          <div className="px-2">
            <ProgressTimeline currentIndex={progressIndex} />
          </div>

          {/* Next Action Banner */}
          {nextAction !== "none" && (
            <div className={`mt-4 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${bannerTheme.bg}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bannerTheme.icon}`}>
                  {nextAction === "complete" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {nextAction === "shipped" && <Truck className="w-4 h-4 text-sky-400" />}
                  {nextAction === "tracking" && <Truck className="w-4 h-4 text-sky-400" />}
                  {nextAction === "complete_manufacturing" && <Factory className="w-4 h-4 text-emerald-400" />}
                  {nextAction === "manufacturing" && <Factory className="w-4 h-4 text-sky-400" />}
                  {nextAction === "awaiting_balance" && <CreditCard className="w-4 h-4 text-amber-400" />}
                  {nextAction === "deposit" && <DollarSign className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${bannerTheme.text}`}>
                    {nextAction === "deposit" && "Send deposit invoice to get started"}
                    {nextAction === "manufacturing" && "Deposit received \u2014 start manufacturing"}
                    {nextAction === "complete_manufacturing" && "Manufacturing in progress \u2014 mark as complete"}
                    {nextAction === "awaiting_balance" && "Waiting for balance payment"}
                    {nextAction === "tracking" && "Add tracking number"}
                    {nextAction === "shipped" && "Shipped \u2014 mark as delivered"}
                    {nextAction === "complete" && "Order complete"}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {nextAction === "deposit" && `Send the 50% deposit invoice ($${(Math.round(cost * 50) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}) to the client.`}
                    {nextAction === "manufacturing" && "Begin production now that the deposit has been received."}
                    {nextAction === "complete_manufacturing" && "Complete manufacturing to send the balance invoice and notify the client."}
                    {nextAction === "awaiting_balance" && `Balance invoice ($${remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}) has been sent. Waiting for client payment.`}
                    {nextAction === "tracking" && "Enter the shipping tracking number for client notifications."}
                    {nextAction === "shipped" && "Confirm delivery once the order arrives."}
                    {nextAction === "complete" && "All steps are finished. This order is complete."}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-auto sm:shrink-0">
                {nextAction === "deposit" && (
                  <SendDepositButton quoteId={order.quote_id} clientName={order.client_name} amount={Math.round(cost * 50) / 100} />
                )}
                {nextAction === "manufacturing" && (
                  <StartManufacturingButton orderId={id} clientName={order.client_name} clientEmail={order.client_email} />
                )}
                {nextAction === "complete_manufacturing" && (
                  <CompleteManufacturingButton orderId={id} clientName={order.client_name} clientEmail={order.client_email} />
                )}
                {nextAction === "tracking" && tracking && (
                  <TrackingCodeInput trackingId={tracking.id} quoteId={order.quote_id} initialTrackingNumber={tracking.tracking_number} initialCarrier={tracking.shipping_carrier} initialTrackingLink={tracking.tracking_link} />
                )}
                {nextAction === "shipped" && (
                  <MarkDeliveredButton orderId={id} clientName={order.client_name} clientEmail={order.client_email} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-6">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">

          {/* Customer Info */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Customer</h2>
              {(quote?.customer_type as string) && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-400/10 text-indigo-300 ml-auto">
                  {quote?.customer_type as string}
                </span>
              )}
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 flex items-center justify-center text-white font-bold text-sm">
                  {order.client_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{order.client_name}</p>
                  <p className="text-white/40 text-xs truncate">{order.client_email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(quote?.customer_phone as string) && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <Phone className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-white/50 text-xs">{quote?.customer_phone as string}</span>
                  </div>
                )}
                {(quote?.customer_zip as string) && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <MapPin className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-white/50 text-xs">{quote?.customer_zip as string}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Door Specifications */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <DoorOpen className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Door Specifications</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-2.5 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/20" />
                      <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">{label}</p>
                    </div>
                    <p className="text-white font-medium text-sm">{value || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line Items */}
          {quoteItems.length > 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
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
                      <th className="text-left px-2 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Item</th>
                      <th className="text-right px-2 sm:px-4 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Qty</th>
                      <th className="text-right px-2 sm:px-4 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold hidden sm:table-cell">Price</th>
                      <th className="text-right px-2 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {quoteItems.map((item, idx) => (
                      <tr key={(item.id as string) || idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-2 sm:px-5 py-3 text-white/70">
                          <span className="line-clamp-2 sm:line-clamp-none">{String(item.name)}</span>
                          {item.description ? (
                            <p className="text-white/25 text-xs mt-0.5 hidden sm:block">{String(item.description)}</p>
                          ) : null}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-right text-white/50">{Number(item.quantity)}</td>
                        <td className="px-2 sm:px-4 py-3 text-right text-white/50 hidden sm:table-cell">
                          ${Number(item.unit_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2 sm:px-5 py-3 text-right text-white font-medium">
                          ${Number(item.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Pricing</h2>
              <span className="text-white font-semibold text-sm ml-auto">${cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-2.5">
                {Number(quote?.subtotal) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white/60">${Number(quote?.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {Number(quote?.installation_cost) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Installation</span>
                    <span className="text-white/60">${Number(quote?.installation_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {Number(quote?.delivery_cost) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Delivery</span>
                    <span className="text-white/60">${Number(quote?.delivery_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {Number(quote?.tax) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Tax</span>
                    <span className="text-white/60">${Number(quote?.tax).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Portal Management — Approval Drawing, Photos, Attachments */}
          <AdminPortalManager
            quoteId={order.quote_id}
            quoteName={order.client_name}
            quoteColor={(quote?.color as string) || undefined}
            quoteItems={quoteItems}
            drawing={drawing}
            drawings={allDrawings}
            photos={photos}
            followUps={[]}
            hideFollowUps
            documents={documents}
          />

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

          {/* Notes */}
          {(quote?.notes as string) && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-6">
              <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-2">Notes</p>
              <p className="text-sm text-white/50 leading-relaxed">{quote?.notes as string}</p>
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN (sidebar) ── */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">

          {/* Payments */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Payments</h2>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-semibold">${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                <span className="text-white/15">/</span>
                <span className="text-white/40">${cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="p-5 sm:p-6">
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
                    <div key={p.id} className={`rounded-xl bg-white/[0.03] border p-3.5 flex flex-col sm:flex-row sm:items-center ${p.status === "completed" ? "border-emerald-500/20" : "border-white/[0.04]"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === "completed" ? "bg-emerald-400" : "bg-amber-400"}`} />
                        <div>
                          <p className="text-white font-medium text-sm">{paymentTypeLabels[p.payment_type] || p.payment_type}</p>
                          <p className="text-white/25 text-xs">
                            {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 mt-1.5 sm:mt-0 sm:ml-auto">
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
            </div>
          </div>

          {/* Delivery Info */}
          {deliveryType && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Delivery</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  {deliveryType === "delivery" ? (
                    <Truck className="w-4 h-4 text-sky-400" />
                  ) : (
                    <MapPin className="w-4 h-4 text-amber-400" />
                  )}
                  <p className="text-white font-medium text-sm capitalize">{deliveryType}</p>
                </div>
                {deliveryType === "delivery" && deliveryAddress && (
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5 mt-2">
                    <p className="text-white/50 text-xs leading-relaxed flex items-start gap-2">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-white/20" />
                      {formatDeliveryAddress(deliveryAddress)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipping & Tracking */}
          {tracking && manufacturingCompleted && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-sky-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Shipping & Tracking</h2>
                {tracking.tracking_number && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md text-emerald-400 bg-emerald-500/10">
                    {tracking.stage === "delivered" ? "Delivered" : tracking.stage === "shipping" ? "Shipped" : "Ready"}
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <TrackingCodeInput
                  trackingId={tracking.id}
                  quoteId={order.quote_id}
                  initialTrackingNumber={tracking.tracking_number}
                  initialCarrier={tracking.shipping_carrier}
                  initialTrackingLink={tracking.tracking_link}
                />
              </div>
            </div>
          )}

          {/* Email History */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
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
                <div className="px-4 sm:px-5 py-6 text-center">
                  <p className="text-white/25 text-sm">No emails sent yet</p>
                </div>
              ) : (
                emails.slice(0, 5).map((e) => (
                  <div key={e.id} className="px-4 sm:px-5 py-3 flex items-center gap-3">
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
                <div className="px-4 sm:px-5 py-2.5 text-center">
                  <span className="text-white/20 text-[11px]">+{emails.length - 5} more</span>
                </div>
              )}
            </div>
          </div>

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
            drawings={allDrawings.map((d) => ({
              overall_width: d.overall_width,
              overall_height: d.overall_height,
              panel_count: d.panel_count,
              slide_direction: d.slide_direction,
              in_swing: d.in_swing,
              frame_color: d.frame_color,
              hardware_color: d.hardware_color,
              customer_name: d.customer_name,
              signature_data: d.signature_data,
              signed_at: d.signed_at,
              system_type: d.system_type,
            }))}
            quoteId={order.quote_id}
          />

          {/* Shared With (admin only) */}
          {isAdmin && (
            <QuoteShareCard
              quoteId={order.quote_id}
              salesReps={salesReps}
              initialSharedWith={(quote?.shared_with as string[]) || []}
            />
          )}

          {/* Notes & Tasks */}
          <QuoteNotesAndTasks
            quoteId={order.quote_id}
            initialNotes={notes}
            initialTasks={tasks}
          />

        </div>
      </div>

    </div>
  );
}
