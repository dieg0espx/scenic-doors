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

  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <AdminSidebar />
      <main className="flex-1 p-4 pt-18 md:pt-6 sm:p-6 md:p-8 lg:p-10 min-w-0">{children}</main>
    </div>
  );
}
