import { Receipt } from "lucide-react";
import { getPaymentsForInvoices } from "@/lib/actions/payments";
import InvoicesList from "@/components/InvoicesList";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const payments = await getPaymentsForInvoices();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Receipt className="w-5 h-5 text-sky-400" />
          <p className="text-sky-400/80 text-sm font-medium">Billing</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Invoices</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Generate and download invoice PDFs. {payments.length > 0 && <span className="text-white/50">{payments.length} total</span>}
        </p>
      </div>

      <InvoicesList payments={payments} />
    </div>
  );
}
