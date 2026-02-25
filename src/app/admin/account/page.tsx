import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CircleUser } from "lucide-react";
import AccountForm from "@/components/admin/AccountForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", user.email!)
    .single();

  if (!adminUser) redirect("/admin");

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <CircleUser className="w-5 h-5 text-violet-400" />
          <p className="text-violet-400/80 text-sm font-medium">Profile</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          My Account
        </h1>
        <p className="text-white/35 text-sm mt-1.5">
          View and manage your profile information.
        </p>
      </div>

      <AccountForm user={adminUser} />
    </div>
  );
}
