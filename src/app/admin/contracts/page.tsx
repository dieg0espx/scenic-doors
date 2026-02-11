import { ScrollText } from "lucide-react";
import { getContracts } from "@/lib/actions/contracts";
import ContractsList from "@/components/ContractsList";

export const dynamic = "force-dynamic";

export default async function ContractsPage() {
  const contracts = await getContracts();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <ScrollText className="w-5 h-5 text-amber-400" />
          <p className="text-amber-400/80 text-sm font-medium">Legal</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Contracts</h1>
        <p className="text-white/35 text-sm mt-1.5">
          View signed contracts and agreements. {contracts.length > 0 && <span className="text-white/50">{contracts.length} signed</span>}
        </p>
      </div>

      <ContractsList contracts={contracts} />
    </div>
  );
}
