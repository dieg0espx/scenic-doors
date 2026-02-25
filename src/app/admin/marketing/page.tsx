import { BarChart3, UserX, FileText, DollarSign, TrendingUp, Calculator, Target, Activity } from "lucide-react";
import { getMarketingMetrics, getRevenueBySource, getLeadsOverTime, getConversionFunnel } from "@/lib/actions/marketing";
import MarketingCharts from "@/components/admin/MarketingCharts";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const [metrics, revenueBySource, leadsOverTime, conversionFunnel] =
    await Promise.all([
      getMarketingMetrics(),
      getRevenueBySource(),
      getLeadsOverTime(),
      getConversionFunnel(),
    ]);

  const metricCards = [
    { label: "Abandoned Leads", value: metrics.abandonedLeads, icon: UserX, color: "red" },
    { label: "Completed Quotes", value: metrics.completedQuotes, icon: FileText, color: "emerald" },
    { label: "Revenue", value: `$${metrics.revenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, icon: DollarSign, color: "emerald" },
    { label: "Conversion Rate", value: `${metrics.conversionRate.toFixed(1)}%`, icon: TrendingUp, color: "violet" },
    { label: "Avg Quote Value", value: `$${metrics.avgQuoteValue.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, icon: Calculator, color: "sky" },
    { label: "Cost Per Lead", value: `$${metrics.costPerLead.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, icon: Target, color: "amber" },
    { label: "ROI", value: `${metrics.roi.toFixed(0)}%`, icon: Activity, color: "teal" },
  ];

  const colorMap: Record<string, { border: string; bg: string; iconBg: string; iconText: string }> = {
    red: { border: "border-red-500/15", bg: "from-red-500/[0.06]", iconBg: "bg-red-500/15", iconText: "text-red-400" },
    emerald: { border: "border-emerald-500/15", bg: "from-emerald-500/[0.06]", iconBg: "bg-emerald-500/15", iconText: "text-emerald-400" },
    violet: { border: "border-violet-500/15", bg: "from-violet-500/[0.06]", iconBg: "bg-violet-500/15", iconText: "text-violet-400" },
    sky: { border: "border-sky-500/15", bg: "from-sky-500/[0.06]", iconBg: "bg-sky-500/15", iconText: "text-sky-400" },
    amber: { border: "border-amber-500/15", bg: "from-amber-500/[0.06]", iconBg: "bg-amber-500/15", iconText: "text-amber-400" },
    teal: { border: "border-teal-500/15", bg: "from-teal-500/[0.06]", iconBg: "bg-teal-500/15", iconText: "text-teal-400" },
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          <p className="text-violet-400/80 text-sm font-medium">Analytics</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Marketing</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Track marketing performance and conversion metrics.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {metricCards.map((card) => {
          const c = colorMap[card.color];
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} to-transparent p-4 sm:p-5`}
            >
              <div className={`w-8 h-8 rounded-xl ${c.iconBg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${c.iconText}`} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">{card.value}</p>
              <p className="text-white/35 text-[11px] mt-0.5 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      <MarketingCharts
        revenueBySource={revenueBySource}
        leadsOverTime={leadsOverTime}
        conversionFunnel={conversionFunnel}
      />
    </div>
  );
}
