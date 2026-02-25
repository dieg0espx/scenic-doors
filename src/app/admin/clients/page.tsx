import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { getClients } from "@/lib/actions/clients";
import ClientsList from "@/components/ClientsList";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users className="w-5 h-5 text-teal-400" />
            <p className="text-teal-400/80 text-sm font-medium">CRM</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Clients</h1>
          <p className="text-white/35 text-sm mt-1.5">
            Manage your client database. {clients.length > 0 && <span className="text-white/50">{clients.length} total</span>}
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-sm font-medium transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
      </div>

      <ClientsList clients={clients} />
    </div>
  );
}
