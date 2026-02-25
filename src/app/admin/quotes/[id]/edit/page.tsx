import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { getQuoteById } from "@/lib/actions/quotes";
import { getClients } from "@/lib/actions/clients";
import { getAdminUsers } from "@/lib/actions/admin-users";
import QuoteForm from "@/components/QuoteForm";

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quote, clients, adminUsers] = await Promise.all([
    getQuoteById(id),
    getClients(),
    getAdminUsers(),
  ]);

  if (!quote) {
    redirect("/admin/quotes");
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-5 h-5 text-violet-400" />
          <p className="text-violet-400/80 text-sm font-medium">Sales</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Quote</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Editing quote <span className="font-mono text-white/50">{quote.quote_number}</span>
        </p>
      </div>

      <QuoteForm initialData={quote} clients={clients} adminUsers={adminUsers} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>
    </div>
  );
}
