"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { RevenueBySource, LeadsOverTime, ConversionFunnel } from "@/lib/types";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

interface Props {
  revenueBySource: RevenueBySource[];
  leadsOverTime: LeadsOverTime[];
  conversionFunnel: ConversionFunnel[];
}

export default function MarketingCharts({
  revenueBySource,
  leadsOverTime,
  conversionFunnel,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Source - Pie */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white mb-3 sm:mb-4">Revenue by Source</h3>
          {revenueBySource.length === 0 ? (
            <div className="h-48 sm:h-64 flex items-center justify-center">
              <p className="text-white/25 text-sm">No data yet</p>
            </div>
          ) : (
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBySource}
                    dataKey="revenue"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={(props: PieLabelRenderProps) =>
                      `${props.name || ""} (${((props.percent as number) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {revenueBySource.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#161b22",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "12px",
                    }}
                    formatter={(value?: number | string) => [
                      `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
                      "Revenue",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Leads Over Time - Line */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white mb-3 sm:mb-4">Leads Over Time (30 days)</h3>
          {leadsOverTime.every((d) => d.count === 0) ? (
            <div className="h-48 sm:h-64 flex items-center justify-center">
              <p className="text-white/25 text-sm">No data yet</p>
            </div>
          ) : (
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                    tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#161b22",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "12px",
                    }}
                    labelFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Performance by Source Table */}
      {revenueBySource.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Performance by Source</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="text-left px-3 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Source</th>
                  <th className="text-right px-3 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Leads</th>
                  <th className="text-right px-3 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Revenue</th>
                  <th className="text-right px-3 sm:px-5 py-3 text-[11px] uppercase tracking-wider text-white/30 font-semibold hidden sm:table-cell">Avg/Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {revenueBySource.map((s, i) => (
                  <tr key={s.source} className="hover:bg-white/[0.02]">
                    <td className="px-3 sm:px-5 py-3 text-white/70 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="truncate">{s.source}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-right text-white/50">{s.count}</td>
                    <td className="px-3 sm:px-5 py-3 text-right text-white font-medium">
                      ${s.revenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-right text-white/40 hidden sm:table-cell">
                      ${s.count > 0 ? (s.revenue / s.count).toLocaleString("en-US", { minimumFractionDigits: 0 }) : "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conversion Funnel */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-white mb-3 sm:mb-4">Conversion Funnel</h3>
        {conversionFunnel.every((s) => s.count === 0) ? (
          <div className="py-6 sm:py-8 text-center">
            <p className="text-white/25 text-sm">No data yet</p>
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="stage"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: "#161b22",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "12px",
                  }}
                  formatter={(value?: number | string) => [
                    `${value ?? 0}`,
                    "Count",
                  ]}
                />
                <Bar dataKey="count" fill="#8b5cf6" fillOpacity={0.6} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
