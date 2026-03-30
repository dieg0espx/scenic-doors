import { redirect } from "next/navigation";
import { Tag } from "lucide-react";
import { getCurrentAdminUser } from "@/lib/auth";
import { getGlobalDiscounts } from "@/lib/actions/global-discounts";
import { getEffectiveRates } from "@/lib/actions/pricing-rates";
import GlobalDiscountsManager from "@/components/admin/GlobalDiscountsManager";
import PricingRatesEditor from "@/components/admin/PricingRatesEditor";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  const adminUser = await getCurrentAdminUser();
  if (!adminUser || adminUser.role !== "admin") {
    redirect("/admin");
  }

  const [discounts, rates] = await Promise.all([
    getGlobalDiscounts(),
    getEffectiveRates(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Tag className="w-5 h-5 text-amber-400" />
          <p className="text-amber-400/80 text-sm font-medium">PROMOTIONS & PRICING</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Discounts & Pricing</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Manage promotional discounts and set pricing rates per square foot for each door type.
        </p>
      </div>

      <div className="space-y-8">
        <PricingRatesEditor currentRates={rates} />
        <GlobalDiscountsManager discounts={discounts} />
      </div>
    </div>
  );
}
