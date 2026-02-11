import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, User, Mail, DoorOpen, Layers, Palette, GlassWater, Ruler, ScrollText, CreditCard, Truck, MapPin } from "lucide-react";
import { getOrderById, syncOrderStatus } from "@/lib/actions/orders";
import { getPaymentsByQuoteId } from "@/lib/actions/payments";
import SendBalanceButton from "@/components/SendBalanceButton";
import OrderDownloads from "@/components/OrderDownloads";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { dot: string; bg: string; text: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-300" },
  in_progress: { dot: "bg-sky-400", bg: "bg-sky-400/10", text: "text-sky-300" },
  completed: { dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-300" },
  cancelled: { dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-300" },
  on_hold: { dot: "bg-orange-400", bg: "bg-orange-400/10", text: "text-orange-300" },
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
      {status.replace("_", " ")}
    </span>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const payments = await getPaymentsByQuoteId(order.quote_id);

  // Sync order status based on actual payment states
  const correctedStatus = await syncOrderStatus(order.id, order.quote_id, order.status);
  if (correctedStatus) order.status = correctedStatus;

  const quote = order.quotes as Record<string, unknown> | null;
  const contract = order.contracts as Record<string, unknown> | null;

  const cost = Number(quote?.cost ?? 0);
  const totalPaid = payments
    .filter((p: { status: string }) => p.status === "completed")
    .reduce((sum: number, p: { amount: number }) => sum + Number(p.amount), 0);
  const remaining = cost - totalPaid;
  const hasBalancePayment = payments.some((p: { payment_type: string }) => p.payment_type === "balance_50");
  const advancePaid = payments.some((p: { payment_type: string; status: string }) => p.payment_type === "advance_50" && p.status === "completed");
  const canSendBalance = advancePaid && !hasBalancePayment && remaining > 0;

  const specs = [
    { label: "Door Type", value: quote?.door_type as string, icon: DoorOpen },
    { label: "Material", value: quote?.material as string, icon: Layers },
    { label: "Color", value: quote?.color as string, icon: Palette },
    { label: "Glass Type", value: quote?.glass_type as string, icon: GlassWater },
    { label: "Size", value: quote?.size as string, icon: Ruler },
  ];

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Package className="w-5 h-5 text-sky-400" />
            <p className="text-sky-400/80 text-sm font-medium">Order Details</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{order.order_number}</h1>
          <p className="text-white/35 text-sm mt-1">
            Created {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-6">
        {/* Client Info */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Client Information</h2>
          </div>
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-1">Name</p>
              <p className="text-white font-medium text-sm flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-white/20" /> {order.client_name}
              </p>
            </div>
            <div>
              <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-1">Email</p>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white/20" /> {order.client_email}
              </p>
            </div>
            <div>
              <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-1">Quote Reference</p>
              <p className="text-white/50 font-mono text-xs">{(quote?.quote_number as string) || "-"}</p>
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
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

        {/* Delivery Info */}
        {deliveryType && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-sky-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Delivery Information</h2>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                {deliveryType === "delivery" ? (
                  <Truck className="w-4 h-4 text-sky-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-amber-400" />
                )}
                <p className="text-white font-medium text-sm capitalize">{deliveryType}</p>
              </div>
              {deliveryType === "delivery" && deliveryAddress && (
                <p className="text-white/50 text-sm ml-6">{deliveryAddress}</p>
              )}
            </div>
          </div>
        )}

        {/* Contract */}
        {contract && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ScrollText className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Contract</h2>
            </div>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-1">Signed Date</p>
                  <p className="text-white/60 text-sm">
                    {contract.signed_at
                      ? new Date(contract.signed_at as string).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-1">IP Address</p>
                  <p className="text-white/40 font-mono text-xs">{(contract.ip_address as string) || "-"}</p>
                </div>
                {typeof contract.signature_url === "string" && contract.signature_url && (
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium mb-2">Signature</p>
                    <div className="w-32 h-20 bg-white rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src={contract.signature_url}
                        alt="Client signature"
                        width={128}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payments */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-base font-semibold text-white">Payments</h2>
          </div>
          <div className="p-5 sm:p-6">
            {payments.length === 0 ? (
              <p className="text-white/30 text-sm">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p: { id: string; payment_type: string; amount: number; status: string; created_at: string }) => (
                  <div key={p.id} className={`rounded-xl bg-white/[0.03] border border-white/[0.04] p-4 sm:p-3.5 border-l-4 ${p.status === "completed" ? "border-l-emerald-500" : "border-l-amber-500"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium text-sm">{paymentTypeLabels[p.payment_type] || p.payment_type}</p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <p className="text-white font-semibold text-sm">
                          ${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cost Summary */}
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-white/40 text-sm">Total</p>
                  <p className="text-white font-bold text-sm">${cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 text-sm">Paid</p>
                  <p className="text-emerald-400 font-bold text-sm">${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 text-sm">Remaining</p>
                  <p className={`font-bold text-sm ${remaining > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Send Balance Invoice Button */}
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
        />
      </div>
    </div>
  );
}
