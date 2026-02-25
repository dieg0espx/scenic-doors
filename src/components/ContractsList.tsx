"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollText, Download, Loader2 } from "lucide-react";
import { generateContractPdf } from "@/lib/generateContractPdf";

interface Contract {
  id: string;
  client_name: string;
  signature_url: string;
  signed_at: string;
  quotes: {
    quote_number: string;
    door_type: string;
    cost: number;
    material: string;
    color: string;
    glass_type: string;
    size: string;
    client_email: string;
    delivery_type?: string;
    delivery_address?: string;
  };
}

export default function ContractsList({ contracts }: { contracts: Contract[] }) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleDownloadPdf(contract: Contract) {
    setDownloadingId(contract.id);
    try {
      const doc = await generateContractPdf(contract);
      doc.save(`Contract-${contract.quotes?.quote_number || contract.id}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setDownloadingId(null);
    }
  }

  if (contracts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 sm:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <ScrollText className="w-7 h-7 text-amber-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No contracts yet</h3>
        <p className="text-white/30 text-sm">Contracts will appear here once clients sign.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {contracts.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-medium text-[15px]">{c.client_name}</p>
                <p className="text-white/30 text-xs font-mono">{c.quotes?.quote_number}</p>
              </div>
              <div className="w-16 h-10 bg-white rounded-lg overflow-hidden shadow-sm shrink-0">
                <Image src={c.signature_url} alt="Signature" width={64} height={40} className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Type</p>
                <p className="text-white/50 text-xs mt-0.5">{c.quotes?.door_type}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Cost</p>
                <p className="text-white font-semibold text-sm mt-0.5">${Number(c.quotes?.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Signed</p>
                <p className="text-white/40 text-xs mt-0.5">{new Date(c.signed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              <div className="flex items-end justify-end">
                <button
                  onClick={() => handleDownloadPdf(c)}
                  disabled={downloadingId === c.id}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {downloadingId === c.id ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                  ) : (
                    <><Download className="w-3.5 h-3.5" /> PDF</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Quote #</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Client</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Door Type</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Cost</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Signed</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Signature</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {contracts.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 text-white/60 font-mono text-xs">{c.quotes?.quote_number}</td>
                <td className="px-5 py-4 text-white font-medium text-[13px]">{c.client_name}</td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{c.quotes?.door_type}</td>
                <td className="px-5 py-4 text-white font-semibold text-[13px]">${Number(c.quotes?.cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td className="px-5 py-4 text-white/30 text-xs">{new Date(c.signed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-5 py-4">
                  <div className="w-16 h-10 bg-white rounded-lg overflow-hidden shadow-sm">
                    <Image src={c.signature_url} alt="Signature" width={64} height={40} className="w-full h-full object-contain" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleDownloadPdf(c)}
                    disabled={downloadingId === c.id}
                    title="Download contract PDF"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {downloadingId === c.id ? (
                      <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
                    ) : (
                      <><Download className="w-3 h-3" /> Download PDF</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
