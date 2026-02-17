"use client";

import { useState } from "react";
import { Search, Users, Trash2 } from "lucide-react";
import type { AdminUser } from "@/lib/types";
import { deleteAdminUser } from "@/lib/actions/admin-users";

const roleColors: Record<string, string> = {
  admin: "bg-red-400/10 text-red-300",
  sales: "bg-violet-400/10 text-violet-300",
  manager: "bg-amber-400/10 text-amber-300",
  installer: "bg-sky-400/10 text-sky-300",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-400/10 text-emerald-300",
  inactive: "bg-gray-400/10 text-gray-300",
};

interface Props {
  users: AdminUser[];
}

export default function UsersList({ users }: Props) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const roles = Array.from(new Set(users.map((u) => u.role)));
  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    return true;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    await deleteAdminUser(id);
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7 text-violet-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No users yet</h3>
        <p className="text-white/30 text-sm">Add your first team member above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-medium cursor-pointer focus:outline-none"
        >
          <option value="all">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/[0.04]">
          {filtered.map((u) => (
            <div key={u.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{u.name}</p>
                  {u.email && <p className="text-white/30 text-xs">{u.email}</p>}
                </div>
                <div className="flex gap-1.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${roleColors[u.role] || roleColors.sales}`}>
                    {u.role}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${statusColors[u.status] || statusColors.active}`}>
                    {u.status}
                  </span>
                </div>
              </div>
              {u.zipcodes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {u.zipcodes.map((z) => (
                    <span key={z} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 text-[10px]">{z}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Name</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Contact</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Role</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Zipcodes</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold">Start</th>
              <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-wider text-white/30 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-white font-medium text-[13px]">{u.prefix ? `${u.prefix} ` : ""}{u.name}</p>
                  {u.location_code && <p className="text-white/20 text-[11px]">LOC: {u.location_code}</p>}
                </td>
                <td className="px-5 py-3.5">
                  {u.email && <p className="text-white/50 text-xs">{u.email}</p>}
                  {u.phone && <p className="text-white/30 text-xs">{u.phone}</p>}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${roleColors[u.role] || roleColors.sales}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${statusColors[u.status] || statusColors.active}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {u.zipcodes.slice(0, 3).map((z) => (
                      <span key={z} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 text-[10px]">{z}</span>
                    ))}
                    {u.zipcodes.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/20 text-[10px]">+{u.zipcodes.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-white/25 text-xs">
                  {u.start_date
                    ? new Date(u.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="p-1.5 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
