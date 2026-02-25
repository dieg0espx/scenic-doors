"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  MarketingMetrics,
  RevenueBySource,
  LeadsOverTime,
  ConversionFunnel,
} from "@/lib/types";

export async function getMarketingMetrics(
  period?: string
): Promise<MarketingMetrics> {
  const supabase = await createClient();

  let dateFilter: string | null = null;
  if (period === "7d") {
    dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (period === "30d") {
    dateFilter = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();
  } else if (period === "90d") {
    dateFilter = new Date(
      Date.now() - 90 * 24 * 60 * 60 * 1000
    ).toISOString();
  }

  let leadsQuery = supabase.from("leads").select("id, has_quote, source", { count: "exact" });
  let quotesQuery = supabase.from("quotes").select("id, cost, grand_total, status, lead_status");
  let paymentsQuery = supabase.from("payments").select("amount").eq("status", "completed");

  if (dateFilter) {
    leadsQuery = leadsQuery.gte("created_at", dateFilter);
    quotesQuery = quotesQuery.gte("created_at", dateFilter);
    paymentsQuery = paymentsQuery.gte("created_at", dateFilter);
  }

  const [leadsRes, quotesRes, paymentsRes] = await Promise.all([
    leadsQuery,
    quotesQuery,
    paymentsQuery,
  ]);

  const leads = leadsRes.data ?? [];
  const quotes = quotesRes.data ?? [];
  const payments = paymentsRes.data ?? [];

  const abandonedLeads = leads.filter((l) => !l.has_quote).length;
  const completedQuotes = quotes.filter(
    (q) => q.status === "accepted"
  ).length;
  const revenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalLeads = leads.length;
  const conversionRate =
    totalLeads > 0 ? (completedQuotes / totalLeads) * 100 : 0;
  const totalQuoteValue = quotes.reduce(
    (sum, q) => sum + Number(q.grand_total || q.cost || 0),
    0
  );
  const avgQuoteValue =
    quotes.length > 0 ? totalQuoteValue / quotes.length : 0;

  return {
    abandonedLeads,
    completedQuotes,
    revenue,
    conversionRate,
    avgQuoteValue,
    costPerLead: totalLeads > 0 ? revenue * 0.1 / totalLeads : 0,
    roi: revenue > 0 ? ((revenue - revenue * 0.1) / (revenue * 0.1)) * 100 : 0,
  };
}

export async function getRevenueBySource(): Promise<RevenueBySource[]> {
  const supabase = await createClient();
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("source");
  const { data: quotes, error: quotesError } = await supabase
    .from("quotes")
    .select("cost, grand_total, lead_id, leads(source)")
    .not("lead_id", "is", null);

  if (leadsError) throw new Error(leadsError.message);
  if (quotesError) throw new Error(quotesError.message);

  const sourceMap = new Map<string, { revenue: number; count: number }>();

  // Count leads by source
  for (const lead of leads ?? []) {
    const src = lead.source || "Direct";
    if (!sourceMap.has(src)) sourceMap.set(src, { revenue: 0, count: 0 });
    sourceMap.get(src)!.count++;
  }

  // Attribute revenue by source through lead linkage
  for (const quote of quotes ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const src = (quote as any).leads?.source || "Direct";
    if (!sourceMap.has(src)) sourceMap.set(src, { revenue: 0, count: 0 });
    sourceMap.get(src)!.revenue += Number(quote.grand_total || quote.cost || 0);
  }

  return Array.from(sourceMap.entries()).map(([source, data]) => ({
    source,
    revenue: data.revenue,
    count: data.count,
  }));
}

export async function getLeadsOverTime(): Promise<LeadsOverTime[]> {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("leads")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at");

  if (error) throw new Error(error.message);

  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dayMap.set(d.toISOString().split("T")[0], 0);
  }

  for (const row of data ?? []) {
    const day = new Date(row.created_at).toISOString().split("T")[0];
    if (dayMap.has(day)) dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  return Array.from(dayMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));
}

export async function getConversionFunnel(): Promise<ConversionFunnel[]> {
  const supabase = await createClient();

  const [leadsRes, quotesRes, sentRes, acceptedRes, ordersRes] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("quotes").select("id", { count: "exact", head: true }),
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .in("status", ["sent", "viewed", "accepted"]),
      supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .eq("status", "accepted"),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]);

  const firstError = [leadsRes, quotesRes, sentRes, acceptedRes, ordersRes].find((r) => r.error);
  if (firstError?.error) throw new Error(firstError.error.message);

  const totalLeads = leadsRes.count ?? 0;
  const stages = [
    { stage: "Leads", count: totalLeads },
    { stage: "Quotes Created", count: quotesRes.count ?? 0 },
    { stage: "Quotes Sent", count: sentRes.count ?? 0 },
    { stage: "Quotes Accepted", count: acceptedRes.count ?? 0 },
    { stage: "Orders", count: ordersRes.count ?? 0 },
  ];

  return stages.map((s) => ({
    ...s,
    percentage: totalLeads > 0 ? (s.count / totalLeads) * 100 : 0,
  }));
}
