import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { getQuotes } from "@/lib/actions/quotes";
import QuotesList from "@/components/QuotesList";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const quotes = await getQuotes();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FileText className="w-5 h-5 text-violet-400" />
            <p className="text-violet-400/80 text-sm font-medium">Sales</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quotes</h1>
          <p className="text-white/35 text-sm mt-1.5">
            Create and manage customer quotes. {quotes.length > 0 && <span className="text-white/50">{quotes.length} total</span>}
          </p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Quote
        </Link>
      </div>

      <QuotesList quotes={quotes} />
    </div>
  );
}
