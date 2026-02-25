import { Users } from "lucide-react";
import ClientForm from "@/components/ClientForm";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-5 h-5 text-teal-400" />
          <p className="text-teal-400/80 text-sm font-medium">CRM</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">New Client</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Add a new client to your database.
        </p>
      </div>

      <ClientForm />
    </div>
  );
}
