"use client";

import { CheckCircle2, Clock, DollarSign } from "lucide-react";
import type { OrderTracking } from "@/lib/types";

interface PortalPaymentsProps {
  tracking: OrderTracking | null;
  grandTotal: number;
}

export default function PortalPayments({ tracking, grandTotal }: PortalPaymentsProps) {
  if (!tracking) {
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
  const deposit1 = Number(tracking.deposit_1_amount || 0);
  const deposit2 = Number(tracking.deposit_2_amount || 0);

  return (
    <div className="space-y-6">
      {/* Total Overview */}
      <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Payment Overview
        </h3>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-ocean-100">
          <span className="text-ocean-600">Total Project Cost</span>
          <span className="text-xl font-bold text-ocean-900">
            ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <PaymentCard
            title="50% Deposit — Manufacturing"
            amount={deposit1}
            paid={tracking.deposit_1_paid}
            paidAt={tracking.deposit_1_paid_at}
            description="Required to begin manufacturing your order"
          />
          <PaymentCard
            title="50% Balance — Shipping"
            amount={deposit2}
            paid={tracking.deposit_2_paid}
            paidAt={tracking.deposit_2_paid_at}
            description="Required to begin shipping your order"
          />
        </div>
      </div>

      {/* Payment Instructions */}
      {(!tracking.deposit_1_paid || !tracking.deposit_2_paid) && (
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
  description,
}: {
  title: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
  description: string;
}) {
  return (
    <div
      className={`rounded-xl border-2 p-4 ${
        paid ? "border-green-200 bg-green-50" : "border-ocean-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {paid ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Clock className="w-5 h-5 text-ocean-400" />
        )}
        <span className={`text-xs font-semibold uppercase tracking-wider ${paid ? "text-green-600" : "text-ocean-400"}`}>
          {paid ? "Paid" : "Pending"}
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
    </div>
  );
}
