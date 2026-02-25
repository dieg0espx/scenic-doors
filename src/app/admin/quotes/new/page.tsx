import { FileText } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import { getClients } from "@/lib/actions/clients";
import { getAdminUsers } from "@/lib/actions/admin-users";
import { getCurrentAdminUser } from "@/lib/auth";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const [clients, adminUsers, params, adminUser] = await Promise.all([
    getClients(),
    getAdminUsers(),
    searchParams,
    getCurrentAdminUser(),
  ]);

  const leadId = params.leadId;
  const prefill = leadId
    ? {
        client_name: params.name || "",
        client_email: params.email || "",
        customer_phone: params.phone || "",
        customer_zip: params.zip || "",
        customer_type: params.customerType || "homeowner",
      }
    : undefined;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-5 h-5 text-violet-400" />
          <p className="text-violet-400/80 text-sm font-medium">Sales</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">New Quote</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Create a new quote for a customer.
        </p>
      </div>

      <QuoteForm
        clients={clients}
        adminUsers={adminUsers}
        prefill={prefill}
        leadId={leadId}
        createdBy={adminUser?.name}
        userRole={adminUser?.role}
      />

      {/* Custom scrollbar for dropdowns */}
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
