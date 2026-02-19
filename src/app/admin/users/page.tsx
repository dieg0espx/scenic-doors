import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";
import { getAdminUsers, getUserStats } from "@/lib/actions/admin-users";
import UsersList from "@/components/admin/UsersList";
import UserForm from "@/components/admin/UserForm";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  // Admin-only guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("role")
    .eq("email", user.email!)
    .single();

  if (!adminUser || adminUser.role !== "admin") {
    redirect("/admin");
  }

  const [users, userStats] = await Promise.all([
    getAdminUsers(),
    getUserStats().catch(() => ({})),
  ]);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-5 h-5 text-violet-400" />
          <p className="text-violet-400/80 text-sm font-medium">Team</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Manage team members and roles.
        </p>
      </div>

      <div className="space-y-6">
        <UserForm />
        <UsersList users={users} userStats={userStats} />
      </div>
    </div>
  );
}
