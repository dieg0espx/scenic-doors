const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

interface SlackNotification {
  heading: string;
  message: string;
  details: { label: string; value: string }[];
  adminUrl?: string;
  color?: string; // hex color for the sidebar stripe
}

export async function sendSlackNotification(notification: SlackNotification) {
  const webhookUrl = SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fields = notification.details.map((d) => ({
    type: "mrkdwn",
    text: `*${d.label}*\n${d.value}`,
  }));

  // Slack Block Kit payload
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: notification.heading, emoji: true },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: notification.message },
    },
    ...(fields.length > 0
      ? [{ type: "section", fields: fields.slice(0, 10) }]
      : []),
    ...(notification.adminUrl
      ? [
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "View in Admin", emoji: true },
                url: notification.adminUrl,
                style: "primary",
              },
            ],
          },
        ]
      : []),
  ];

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attachments: [
          {
            color: notification.color || "#6d28d9",
            blocks,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("Slack webhook failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Slack notification error:", err);
  }
}
