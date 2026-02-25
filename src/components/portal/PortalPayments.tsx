"use client";

import { useState } from "react";
import { CheckCircle2, Clock, DollarSign, Download, Loader2 } from "lucide-react";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";
import type { OrderTracking } from "@/lib/types";

interface PaymentRecord {
  id: string;
  client_name: string;
  payment_type: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

interface QuoteInfo {
  quote_number: string;
  door_type: string;
  cost: number;
  material: string;
  color: string;
  glass_type: string;
  size: string;
  client_email: string;
  delivery_type?: string;
  delivery_address?: string;
}

interface PortalPaymentsProps {
  tracking: OrderTracking | null;
  grandTotal: number;
  payments?: PaymentRecord[];
  quoteInfo?: QuoteInfo;
}

const typeLabels: Record<string, { title: string; description: string }> = {
  advance_50: {
    title: "50% Deposit — Manufacturing",
    description: "Required to begin manufacturing your order",
  },
  balance_50: {
    title: "50% Balance — Shipping",
    description: "Required to begin shipping your order",
  },
};

export default function PortalPayments({ tracking, grandTotal, payments = [], quoteInfo }: PortalPaymentsProps) {
  // Show "not yet active" only if there's no tracking AND no payments
  if (!tracking && payments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-ocean-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-ocean-100 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-ocean-400" />
        </div>
        <h3 className="text-lg font-semibold text-ocean-900 mb-2">Payments Not Yet Active</h3>
        <p className="text-ocean-500 text-sm max-w-md mx-auto">
          Payment tracking will become available once your approval drawing is signed and your order is confirmed.
        </p>
      </div>
    );
  }

  const total = Number(grandTotal || 0);
  const halfAmount = Math.round(total * 50) / 100;

  // Find actual payment records
  const advancePayment = payments.find((p) => p.payment_type === "advance_50");
  const balancePayment = payments.find((p) => p.payment_type === "balance_50");

  const advancePaid = advancePayment?.status === "completed";
  const balancePaid = balancePayment?.status === "completed";
  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Total Overview */}
      <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Payment Overview
        </h3>
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-ocean-100">
          <span className="text-ocean-600">Total Project Cost</span>
          <span className="text-xl font-bold text-ocean-900">
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        {totalPaid > 0 && (
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-green-600">Paid</span>
            <span className="text-green-600 font-semibold">
              ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
        {total - totalPaid > 0 && (
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-ocean-500">Remaining</span>
            <span className="text-ocean-700 font-semibold">
              ${(total - totalPaid).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <PaymentCard
            title={typeLabels.advance_50.title}
            amount={advancePayment ? Number(advancePayment.amount) : halfAmount}
            paid={advancePaid}
            paidAt={advancePayment?.paid_at ?? null}
            invoiceSent={!!advancePayment}
            description={typeLabels.advance_50.description}
            payment={advancePayment}
            quoteInfo={quoteInfo}
          />
          <PaymentCard
            title={typeLabels.balance_50.title}
            amount={balancePayment ? Number(balancePayment.amount) : halfAmount}
            paid={balancePaid}
            paidAt={balancePayment?.paid_at ?? null}
            invoiceSent={!!balancePayment}
            description={typeLabels.balance_50.description}
            payment={balancePayment}
            quoteInfo={quoteInfo}
          />
        </div>
      </div>

      {/* Payment Instructions */}
      {(!advancePaid || !balancePaid) && (
        <div className="bg-primary-50 rounded-xl border border-primary-200 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-primary-900 mb-2">Payment Instructions</h3>
          <p className="text-sm text-primary-700 mb-3">
            You will receive an invoice via email with payment details when each deposit is due.
            We accept payments through Square.
          </p>
          <p className="text-sm text-primary-600">
            Questions? Call us at{" "}
            <a href="tel:818-427-6690" className="font-semibold underline">818-427-6690</a>
          </p>
        </div>
      )}
    </div>
  );
}

function PaymentCard({
  title,
  amount,
  paid,
  paidAt,
  invoiceSent,
  description,
  payment,
  quoteInfo,
}: {
  title: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
  invoiceSent: boolean;
  description: string;
  payment?: PaymentRecord;
  quoteInfo?: QuoteInfo;
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!payment || !quoteInfo) return;
    setDownloading(true);
    try {
      const doc = await generateInvoicePdf({
        id: payment.id,
        client_name: payment.client_name,
        amount: Number(payment.amount),
        payment_type: payment.payment_type,
        status: payment.status,
        created_at: payment.created_at,
        quotes: quoteInfo,
      });
      const isAdvance = payment.payment_type === "advance_50";
      const invoiceNumber = `INV-${quoteInfo.quote_number.replace("QT-", "")}${isAdvance ? "-A" : "-B"}`;
      doc.save(`${paid ? "Receipt" : "Invoice"}-${invoiceNumber}.pdf`);
    } catch {
      // silent
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className={`rounded-xl border-2 p-4 ${
        paid
          ? "border-green-200 bg-green-50"
          : invoiceSent
            ? "border-amber-200 bg-amber-50"
            : "border-ocean-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {paid ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Clock className="w-5 h-5 text-ocean-400" />
        )}
        <span className={`text-xs font-semibold uppercase tracking-wider ${
          paid ? "text-green-600" : invoiceSent ? "text-amber-600" : "text-ocean-400"
        }`}>
          {paid ? "Paid" : invoiceSent ? "Invoice Sent" : "Pending"}
        </span>
      </div>
      <h4 className="font-semibold text-ocean-900 text-sm mb-1">{title}</h4>
      <p className="text-xl font-bold text-ocean-900 mb-1">
        ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
      <p className="text-xs text-ocean-500">{description}</p>
      {paid && paidAt && (
        <p className="text-xs text-green-600 mt-2">
          Paid on{" "}
          {new Date(paidAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}
      {payment && quoteInfo && (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
            paid
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-ocean-100 text-ocean-600 hover:bg-ocean-200"
          }`}
        >
          {downloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {paid ? "Download Receipt" : "Download Invoice"}
        </button>
      )}
    </div>
  );
}
