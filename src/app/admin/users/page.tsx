import { Users } from "lucide-react";
import { getAdminUsers, getAdminUserCounts } from "@/lib/actions/admin-users";
import UsersList from "@/components/admin/UsersList";
import UserForm from "@/components/admin/UserForm";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, counts] = await Promise.all([
    getAdminUsers(),
    getAdminUserCounts(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-5 h-5 text-violet-400" />
          <p className="text-violet-400/80 text-sm font-medium">Team</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Users</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Manage team members and roles.
        </p>
      </div>

      {/* Summary counts */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-white/30 text-xs">Total:</span>{" "}
          <span className="text-white font-semibold text-sm">{counts.total}</span>
        </div>
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15">
          <span className="text-emerald-300/60 text-xs">Active:</span>{" "}
          <span className="text-emerald-300 font-semibold text-sm">{counts.active}</span>
        </div>
        <div className="px-4 py-2.5 rounded-xl bg-gray-500/[0.06] border border-gray-500/15">
          <span className="text-gray-300/60 text-xs">Inactive:</span>{" "}
          <span className="text-gray-300 font-semibold text-sm">{counts.inactive}</span>
        </div>
        {Object.entries(counts.byRole).map(([role, count]) => (
          <div key={role} className="px-4 py-2.5 rounded-xl bg-violet-500/[0.04] border border-violet-500/10">
            <span className="text-violet-300/50 text-xs capitalize">{role}:</span>{" "}
            <span className="text-violet-300 font-semibold text-sm">{count}</span>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <UserForm />
        <UsersList users={users} />
      </div>
    </div>
  );
}
