import { CreditCard } from "lucide-react";
import { getPayments } from "@/lib/actions/payments";
import PaymentsList from "@/components/PaymentsList";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <p className="text-emerald-400/80 text-sm font-medium">Finance</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Payments</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Track and manage payment records. {payments.length > 0 && <span className="text-white/50">{payments.length} total</span>}
        </p>
      </div>

      <PaymentsList payments={payments} />
    </div>
  );
}
