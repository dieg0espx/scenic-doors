"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getPaymentById, submitPaymentConfirmation } from "@/lib/actions/payments";
import { getInstallationQuoteByQuoteId } from "@/lib/actions/installation-quotes";
import type { InstallationQuoteItem } from "@/lib/actions/installation-quotes";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";
import { savePdf } from "@/lib/savePdf";
import {
  Receipt, Download, CheckCircle2, XCircle,
  CreditCard, Loader2, DoorOpen, Layers,
  Palette, GlassWater, Ruler, Truck, MapPin, Shield,
} from "lucide-react";

interface Payment {
  id: string;
  quote_id: string;
  client_name: string;
  amount: number;
  payment_type: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  quotes: {
    quote_number: string;
    door_type: string;
    cost: number;
    material: string;
    color: string;
    glass_type: string;
    size: string;
    client_name: string;
    client_email: string;
    delivery_type?: string;
    delivery_address?: string;
    subtotal?: number;
    installation_cost?: number;
    delivery_cost?: number;
    tax?: number;
    grand_total?: number;
  };
}

const typeLabels: Record<string, string> = {
  advance_50: "50% Advance Payment",
  balance_50: "50% Balance Payment",
  installation: "Installation Payment",
};

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}

interface SquarePayments {
  card: () => Promise<SquareCard>;
}

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
  destroy: () => void;
}

function getSquareSdkUrl(environment: string) {
  return environment === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";
}

function getInvoiceNumber(payment: Payment) {
  const suffix = payment.payment_type === "advance_50" ? "-A" : payment.payment_type === "installation" ? "-I" : "-B";
  return `INV-${payment.quotes.quote_number.replace("QT-", "")}${suffix}`;
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-50 px-4">
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl border border-ocean-200 bg-white shadow-sm p-8 sm:p-10 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}

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

export default function PublicInvoicePage() {
  const params = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [cardReady, setCardReady] = useState(false);
  const [installationItems, setInstallationItems] = useState<InstallationQuoteItem[]>([]);
  const cardRef = useRef<SquareCard | null>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    async function load() {
      const data = await getPaymentById(params.id as string);
      if (data) {
        setPayment(data as Payment);
        // Fetch installation line items if this is an installation payment
        if (data.payment_type === "installation" && data.quote_id) {
          const iq = await getInstallationQuoteByQuoteId(data.quote_id).catch(() => null);
          if (iq?.items) setInstallationItems(iq.items);
        }
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  // Load Square SDK and attach card form
  const initSquareCard = useCallback(async () => {
    if (cardRef.current || initializingRef.current) return;
    initializingRef.current = true;

    const configRes = await fetch("/api/square/config");
    const configData = await configRes.json();
    if (!configRes.ok) {
      console.error("Square config error:", configData);
      setError(configData.error || "Failed to load payment form");
      return;
    }
    const { appId, locationId, environment } = configData;
    const sdkUrl = getSquareSdkUrl(environment);

    if (!window.Square) {
      await new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${sdkUrl}"]`)) {
          const check = setInterval(() => {
            if (window.Square) { clearInterval(check); resolve(); }
          }, 100);
          return;
        }
        const script = document.createElement("script");
        script.src = sdkUrl;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Square SDK"));
        document.head.appendChild(script);
      });
    }

    const payments = await window.Square!.payments(appId, locationId);
    const card = await payments.card();
    await card.attach("#square-card-container");
    cardRef.current = card;
    setCardReady(true);
  }, []);

  useEffect(() => {
    if (payment && payment.status !== "completed") {
      initSquareCard().catch(() => setError("Failed to load payment form"));
    }
    return () => {
      initializingRef.current = false;
      if (cardRef.current) {
        cardRef.current.destroy();
        cardRef.current = null;
      }
    };
  }, [payment, initSquareCard]);

  async function handleDownloadPdf() {
    if (!payment) return;
    setDownloadingPdf(true);
    try {
      const doc = await generateInvoicePdf(payment);
      await savePdf(doc, `${getInvoiceNumber(payment)}.pdf`);
    } catch {
      // silent
    } finally {
      setDownloadingPdf(false);
    }
  }

  async function handleSubmitPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!payment || !cardRef.current) return;
    setSubmitting(true);
    setError("");
    try {
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== "OK" || !tokenResult.token) {
        const msg = tokenResult.errors?.map(e => e.message).join(", ") || "Card tokenization failed";
        setError(msg);
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/square/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          amount: payment.amount,
          paymentId: payment.id,
          clientName: payment.client_name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment failed");
        setSubmitting(false);
        return;
      }

      await submitPaymentConfirmation(payment.id, "square", data.squarePaymentId);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-50">
        <div className="flex items-center gap-3 text-ocean-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading invoice...
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-ocean-900 mb-2">Invoice Not Found</h1>
        <p className="text-ocean-400 text-sm">This invoice does not exist or has been removed.</p>
      </CenteredCard>
    );
  }

  if (submitted) {
    return (
      <CenteredCard>
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold text-ocean-900 mb-2">Payment Confirmed</h1>
        <p className="text-ocean-400 text-sm">
          Thank you! Your payment for invoice{" "}
          <span className="text-ocean-700 font-mono">{getInvoiceNumber(payment)}</span>{" "}
          has been confirmed successfully.
        </p>
      </CenteredCard>
    );
  }

  const isPaid = payment.status === "completed";
  const isInstallation = payment.payment_type === "installation";
  const invoiceNumber = getInvoiceNumber(payment);
  const amount = Number(payment.amount);

  const specs = [
    { label: "Door Type", value: payment.quotes.door_type, icon: DoorOpen },
    { label: "Material", value: payment.quotes.material, icon: Layers },
    { label: "Color", value: payment.quotes.color, icon: Palette },
    { label: "Glass", value: payment.quotes.glass_type, icon: GlassWater },
    { label: "Size", value: payment.quotes.size, icon: Ruler },
  ];

  return (
    <div className="min-h-screen bg-ocean-50">
      {/* Header */}
      <header className="bg-white border-b border-ocean-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
              alt="Scenic Doors"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
            <div className="hidden sm:block h-6 w-px bg-ocean-200" />
            <span className="hidden sm:block text-sm text-ocean-400">Invoice</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-ocean-900">{payment.client_name}</p>
            <p className="text-xs text-ocean-400">{payment.quotes.quote_number}</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-5">
        {/* Invoice Card */}
        <div className="rounded-2xl border border-ocean-200 bg-white shadow-sm p-5 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Receipt className="w-4 h-4 text-primary-500" />
                <span className="text-ocean-400 text-xs font-medium uppercase tracking-wider">Invoice</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-ocean-900">{invoiceNumber}</h2>
              <p className="text-ocean-400 text-sm mt-0.5">
                {typeLabels[payment.payment_type] || payment.payment_type}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {isPaid ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Unpaid
                </span>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <div className="rounded-xl bg-ocean-50 border border-ocean-100 p-2.5 sm:p-3.5">
              <p className="text-ocean-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium mb-1">Date</p>
              <p className="text-ocean-800 text-xs sm:text-sm font-medium">
                {new Date(payment.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="rounded-xl bg-ocean-50 border border-ocean-100 p-2.5 sm:p-3.5">
              <p className="text-ocean-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium mb-1">Quote Ref</p>
              <p className="text-ocean-800 text-xs sm:text-sm font-mono font-medium">{payment.quotes.quote_number}</p>
            </div>
            <div className="rounded-xl bg-ocean-50 border border-ocean-100 p-2.5 sm:p-3.5">
              <p className="text-ocean-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium mb-1">Client</p>
              <p className="text-ocean-800 text-xs sm:text-sm font-medium truncate">{payment.client_name}</p>
            </div>
          </div>

          {/* Specs Grid — hide for installation invoices */}
          {!isInstallation && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
              {specs.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl bg-ocean-50 border border-ocean-100 p-2.5 sm:p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3 h-3 text-ocean-300" />
                    <p className="text-ocean-400 text-[10px] sm:text-[11px] uppercase tracking-wider font-medium">{label}</p>
                  </div>
                  <p className="text-ocean-900 font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Delivery — hide for installation invoices */}
          {!isInstallation && payment.quotes.delivery_type && (
            <div className="rounded-xl bg-ocean-50 border border-ocean-100 p-3.5 mb-6">
              <div className="flex items-center gap-2 mb-1">
                {payment.quotes.delivery_type === "delivery" ? (
                  <Truck className="w-3.5 h-3.5 text-primary-500" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                )}
                <p className="text-ocean-400 text-[11px] uppercase tracking-wider font-medium">
                  {payment.quotes.delivery_type === "delivery" ? "Delivery" : "Pickup"}
                </p>
              </div>
              <p className="text-ocean-900 font-medium text-sm">
                {payment.quotes.delivery_type === "delivery" && payment.quotes.delivery_address
                  ? formatDeliveryAddress(payment.quotes.delivery_address)
                  : payment.quotes.delivery_type === "pickup"
                    ? "Client will pick up"
                    : "Address not specified"}
              </p>
            </div>
          )}

          {/* Price Breakdown & Amount Due */}
          <div className="rounded-xl bg-primary-50 border border-primary-100 p-4 sm:p-5 mb-6">
            {/* Full quote breakdown — only for advance/balance payments */}
            {!isInstallation && Number(payment.quotes.subtotal || 0) > 0 ? (
              <div className="space-y-1.5 mb-3 pb-3 border-b border-primary-100">
                <div className="flex items-center justify-between">
                  <p className="text-ocean-500 text-xs">Subtotal</p>
                  <p className="text-ocean-600 text-sm">
                    ${Number(payment.quotes.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                {Number(payment.quotes.installation_cost || 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-ocean-500 text-xs">Installation</p>
                    <p className="text-ocean-600 text-sm">
                      ${Number(payment.quotes.installation_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                {Number(payment.quotes.delivery_cost || 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-ocean-500 text-xs">
                      Delivery{payment.quotes.delivery_type === "white_glove" ? " (White Glove)" : ""}
                    </p>
                    <p className="text-ocean-600 text-sm">
                      ${Number(payment.quotes.delivery_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                {Number(payment.quotes.tax || 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-ocean-500 text-xs">Tax</p>
                    <p className="text-ocean-600 text-sm">
                      ${Number(payment.quotes.tax).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1.5">
                  <p className="text-ocean-700 text-xs font-medium">Grand Total</p>
                  <p className="text-ocean-800 text-sm font-semibold">
                    ${Number(payment.quotes.grand_total || payment.quotes.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ) : isInstallation && installationItems.length > 0 ? (
              <div className="space-y-1.5 mb-3 pb-3 border-b border-primary-100">
                {installationItems.map((item, i) => (
                  <div key={item.id || i} className="flex items-center justify-between">
                    <p className="text-ocean-600 text-xs">{item.description}</p>
                    <p className="text-ocean-700 text-sm font-medium">
                      ${Number(item.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            ) : !isInstallation ? (
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-primary-100">
                <p className="text-ocean-500 text-xs">Project Total</p>
                <p className="text-ocean-600 text-sm">
                  ${Number(payment.quotes.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <p className="text-ocean-500 text-xs uppercase tracking-wider font-medium">Amount Due</p>
              <p className="text-3xl font-bold text-ocean-900">
                ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-ocean-50 border border-ocean-200 hover:bg-ocean-100 text-ocean-600 hover:text-ocean-800 text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            {downloadingPdf ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
            ) : (
              <><Download className="w-4 h-4" /> Download Invoice PDF</>
            )}
          </button>
        </div>

        {/* Payment Confirmation or Payment Form */}
        {isPaid ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-ocean-900 mb-2">Payment Confirmed</h3>
            <p className="text-ocean-500 text-sm mb-5">
              This invoice has been paid
              {payment.paid_at && (
                <> on {new Date(payment.paid_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
              )}
              . Thank you!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`/quote/${payment.quote_id}/pay`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-ocean-200 hover:bg-ocean-50 text-ocean-600 hover:text-ocean-800 text-sm font-medium transition-all"
              >
                View Payment Summary
              </a>
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-ocean-200 hover:bg-ocean-50 text-ocean-600 hover:text-ocean-800 text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
              >
                {downloadingPdf ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Download className="w-4 h-4" /> Download PDF</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="rounded-2xl border border-ocean-200 bg-white shadow-sm p-5 sm:p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                <CreditCard className="w-4.5 h-4.5 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ocean-900">Pay with Card</h3>
                <p className="text-ocean-400 text-xs">Enter your card details below</p>
              </div>
            </div>

            {/* Square Card Form */}
            <div className="mb-5">
              <label className="text-ocean-500 text-[11px] uppercase tracking-wider font-medium mb-3 block">
                Card Details
              </label>
              <div
                id="square-card-container"
                className="rounded-xl bg-ocean-50 border border-ocean-200 p-1 min-h-[50px]"
              />
              {!cardReady && (
                <div className="flex items-center gap-2 text-ocean-300 text-xs mt-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Loading card form...
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <div className="flex items-start gap-2 mb-5 text-ocean-400 text-xs leading-relaxed">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Your card will be charged{" "}
                <span className="text-ocean-700 font-semibold">${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>.
                Payments are securely processed by Square.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !cardReady}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-base sm:text-sm transition-all shadow-lg shadow-primary-500/20 cursor-pointer active:scale-[0.98]"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...</>
              ) : (
                <>Pay ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</>
              )}
            </button>
          </form>
        )}

        <p className="text-center text-ocean-300 text-xs pb-6">
          &copy; {new Date().getFullYear()} Scenic Doors. All rights reserved.
        </p>
      </div>
    </div>
  );
}
