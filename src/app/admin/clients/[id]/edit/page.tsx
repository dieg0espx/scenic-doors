import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { getClientById } from "@/lib/actions/clients";
import ClientForm from "@/components/ClientForm";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) redirect("/admin/clients");

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-5 h-5 text-teal-400" />
          <p className="text-teal-400/80 text-sm font-medium">CRM</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Client</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Editing <span className="text-white/50">{client.name}</span>
        </p>
      </div>

      <ClientForm initialData={client} />
    </div>
  );
}
