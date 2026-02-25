import Link from "next/link";
import { Users, Eye } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  created_at: string;
}

export default function ClientsList({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 sm:p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7 text-teal-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No clients yet</h3>
        <p className="text-white/30 text-sm">Add your first client to get started.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {clients.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <Link href={`/admin/clients/${c.id}`} className="text-white font-medium text-[15px] hover:text-teal-300 transition-colors">{c.name}</Link>
                <p className="text-white/30 text-xs truncate">{c.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Phone</p>
                <p className="text-white/50 text-xs mt-0.5">{c.phone || "—"}</p>
              </div>
              <div>
                <p className="text-white/25 text-[11px] uppercase tracking-wider font-medium">Company</p>
                <p className="text-white/50 text-xs mt-0.5">{c.company || "—"}</p>
              </div>
              <div className="col-span-2 flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <p className="text-white/40 text-xs">{new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-colors active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </Link>
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
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Name</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Email</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Phone</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Company</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Created</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/admin/clients/${c.id}`} className="text-white font-medium text-[13px] hover:text-teal-300 transition-colors">{c.name}</Link>
                </td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{c.email}</td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{c.phone || "—"}</td>
                <td className="px-5 py-4 text-white/50 text-[13px]">{c.company || "—"}</td>
                <td className="px-5 py-4 text-white/30 text-xs">{new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
