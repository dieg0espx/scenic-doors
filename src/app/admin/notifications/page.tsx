import { Bell } from "lucide-react";
import { getNotificationSettings } from "@/lib/actions/notification-settings";
import { getAdminUsers } from "@/lib/actions/admin-users";
import NotificationSettingsComponent from "@/components/admin/NotificationSettings";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const [settings, users] = await Promise.all([
    getNotificationSettings(),
    getAdminUsers(),
  ]);
  const activeUsers = users.filter((u) => u.status === "active" && u.email);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Bell className="w-5 h-5 text-amber-400" />
          <p className="text-amber-400/80 text-sm font-medium">Settings</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Configure which email addresses receive notifications for different events.
        </p>
      </div>

      <NotificationSettingsComponent settings={settings} users={activeUsers} />
    </div>
  );
}
