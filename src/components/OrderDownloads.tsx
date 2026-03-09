"use client";

import { useState } from "react";
import { Download, Loader2, FileText, ScrollText, Receipt, ClipboardCheck } from "lucide-react";
import { generateOrderPdf } from "@/lib/generateOrderPdf";
import { generateContractPdf } from "@/lib/generateContractPdf";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";
import { generateApprovalDrawingPdf, generateMultiApprovalDrawingPdf } from "@/lib/generateApprovalDrawingPdf";
import { savePdf, openPdfWindow } from "@/lib/savePdf";

interface QuoteData {
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

interface ContractData {
  client_name: string;
  signature_url: string;
  signed_at: string;
}

interface PaymentData {
  id: string;
  client_name: string;
  amount: number;
  payment_type: string;
  status: string;
  created_at: string;
}

interface DrawingData {
  overall_width: number;
  overall_height: number;
  panel_count: number;
  slide_direction: string;
  in_swing: string;
  frame_color?: string;
  hardware_color?: string;
  customer_name?: string | null;
  signature_data?: string | null;
  signed_at?: string | null;
  system_type?: string;
}

interface Props {
  order: {
    order_number: string;
    client_name: string;
    client_email: string;
    status: string;
    created_at: string;
  };
  quote: QuoteData;
  contract: ContractData | null;
  payments: PaymentData[];
  drawing?: DrawingData | null;
  drawings?: DrawingData[];
  quoteId?: string;
}

type DownloadingKey = "order" | "contract" | string;

const paymentTypeLabels: Record<string, string> = {
  advance_50: "50% Advance Invoice",
  balance_50: "50% Balance Invoice",
};

function getInvoiceNumber(quoteNumber: string, paymentType: string) {
  const isAdvance = paymentType === "advance_50";
  return `INV-${quoteNumber.replace("QT-", "")}${isAdvance ? "-A" : "-B"}`;
}

export default function OrderDownloads({ order, quote, contract, payments, drawing, drawings = [], quoteId }: Props) {
  const [downloading, setDownloading] = useState<DownloadingKey | null>(null);

  // Build full drawings list — prefer array, fall back to single
  const allDrawings = drawings.length > 0 ? drawings : (drawing ? [drawing] : []);

  async function handleDownloadOrder() {
    setDownloading("order");
    const w = openPdfWindow();
    try {
      const doc = await generateOrderPdf({
        ...order,
        quote,
        payments,
      });
      savePdf(doc, `${order.order_number}.pdf`, w);
    } catch (err) {
      if (w) w.close();
      console.error("Failed to generate order PDF:", err);
    } finally {
      setDownloading(null);
    }
  }

  async function handleDownloadDrawings() {
    if (allDrawings.length === 0) return;
    setDownloading("drawing");
    const w = openPdfWindow();
    try {
      const inputs = allDrawings.map((d) => ({
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
      }));
      const doc = allDrawings.length === 1
        ? await generateApprovalDrawingPdf(inputs[0])
        : await generateMultiApprovalDrawingPdf(inputs);
      savePdf(doc, `Approval-Drawings-${(quoteId || order.order_number).slice(0, 8)}.pdf`, w);
    } catch (err) {
      if (w) w.close();
      console.error("Failed to generate approval drawing PDF:", err);
    } finally {
      setDownloading(null);
    }
  }

  async function handleDownloadContract() {
    if (!contract) return;
    setDownloading("contract");
    const w = openPdfWindow();
    try {
      const doc = await generateContractPdf({
        client_name: contract.client_name,
        signature_url: contract.signature_url,
        signed_at: contract.signed_at,
        quotes: quote,
      });
      savePdf(doc, `Contract-${quote.quote_number}.pdf`, w);
    } catch (err) {
      if (w) w.close();
      console.error("Failed to generate contract PDF:", err);
    } finally {
      setDownloading(null);
    }
  }

  async function handleDownloadInvoice(payment: PaymentData) {
    setDownloading(payment.id);
    const w = openPdfWindow();
    try {
      const doc = await generateInvoicePdf({
        ...payment,
        quotes: quote,
      });
      const invoiceNumber = getInvoiceNumber(quote.quote_number, payment.payment_type);
      savePdf(doc, `${invoiceNumber}.pdf`, w);
    } catch (err) {
      if (w) w.close();
      console.error("Failed to generate invoice PDF:", err);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] rounded-t-2xl">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
          <Download className="w-4 h-4 text-sky-400" />
        </div>
        <h2 className="text-base font-semibold text-white">Documents</h2>
      </div>
      <div className="p-5 sm:p-6 space-y-2.5">
        {/* Order PDF */}
        <button
          onClick={handleDownloadOrder}
          disabled={downloading === "order"}
          className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer disabled:opacity-50 group active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
            {downloading === "order" ? (
              <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-sky-400" />
            )}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-white font-medium text-sm">Order Summary</p>
            <p className="text-white/30 text-xs">{order.order_number}.pdf</p>
          </div>
          <Download className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
        </button>

        {/* Approval Drawing PDF */}
        {allDrawings.length > 0 && (
          <button
            onClick={handleDownloadDrawings}
            disabled={downloading === "drawing"}
            className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer disabled:opacity-50 group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              {downloading === "drawing" ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <ClipboardCheck className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-white font-medium text-sm">
                Approval Drawing{allDrawings.length > 1 ? "s" : ""}
              </p>
              <p className="text-white/30 text-xs">
                {allDrawings.length > 1
                  ? `${allDrawings.length} drawings — ${allDrawings.every((d) => d.signed_at) ? "All signed" : "Pending signatures"}`
                  : `${allDrawings[0].signed_at ? "Signed" : "Unsigned"} — ${allDrawings[0].panel_count} panels, ${allDrawings[0].overall_width}" x ${allDrawings[0].overall_height}"`
                }
              </p>
            </div>
            <Download className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
          </button>
        )}

        {/* Contract PDF */}
        {contract && (
          <button
            onClick={handleDownloadContract}
            disabled={downloading === "contract"}
            className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer disabled:opacity-50 group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              {downloading === "contract" ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <ScrollText className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-white font-medium text-sm">Signed Contract</p>
              <p className="text-white/30 text-xs">Contract-{quote.quote_number}.pdf</p>
            </div>
            <Download className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
          </button>
        )}

        {/* Invoice / Receipt PDFs */}
        {payments.map((p) => {
          const invoiceNumber = getInvoiceNumber(quote.quote_number, p.payment_type);
          const isPaid = p.status === "completed";
          return (
            <button
              key={p.id}
              onClick={() => handleDownloadInvoice(p)}
              disabled={downloading === p.id}
              className="w-full flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer disabled:opacity-50 group active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                {downloading === p.id ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                ) : (
                  <Receipt className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-white font-medium text-sm">
                  {isPaid ? "Receipt" : "Invoice"} — {paymentTypeLabels[p.payment_type] || p.payment_type}
                </p>
                <p className="text-white/30 text-xs">{invoiceNumber}.pdf</p>
              </div>
              {isPaid && (
                <span className="text-emerald-400 text-[10px] font-medium uppercase tracking-wider shrink-0 mr-1">Paid</span>
              )}
              <Download className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
