import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdminUser(): Promise<{
  id: string;
  name: string;
  role: string;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, name, role")
    .eq("email", user.email)
    .single();

  if (!adminUser) return null;

  return { id: adminUser.id, name: adminUser.name, role: adminUser.role };
}
