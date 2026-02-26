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
  const slackConnected = !!process.env.SLACK_WEBHOOK_URL;

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

      {/* Slack integration status */}
      <div className={`rounded-2xl border mb-6 px-5 py-4 ${slackConnected ? "border-emerald-500/15 bg-emerald-500/[0.04]" : "border-white/[0.06] bg-white/[0.02]"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" fill={slackConnected ? "#10b981" : "#525252"} />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-white">Slack Notifications</h3>
              <p className="text-white/35 text-xs mt-0.5">
                {slackConnected
                  ? "Connected — all lead and quote notifications will also be sent to Slack."
                  : "Not connected — add SLACK_WEBHOOK_URL to your environment variables to enable."}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${slackConnected ? "bg-emerald-500/15 text-emerald-300" : "bg-white/[0.06] text-white/30"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${slackConnected ? "bg-emerald-400" : "bg-white/20"}`} />
            {slackConnected ? "Connected" : "Not configured"}
          </span>
        </div>
      </div>

      <NotificationSettingsComponent settings={settings} users={activeUsers} />
    </div>
  );
}
