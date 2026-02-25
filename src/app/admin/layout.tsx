import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the admin_users record for the logged-in user
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, name, role")
    .eq("email", user.email!)
    .single();

  const currentUser = adminUser
    ? { id: adminUser.id, name: adminUser.name, role: adminUser.role }
    : { id: "", name: user.email ?? "User", role: "user" };

  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <AdminSidebar currentUser={currentUser} />
      <main className="flex-1 p-4 pt-18 md:pt-6 sm:p-6 md:p-8 lg:p-10 min-w-0">{children}</main>
    </div>
  );
}
