import type { Metadata } from "next";
import PortalClient from "./PortalClient";

export const metadata: Metadata = {
  title: "Your Project Portal | Scenic Doors",
  description: "View your quote, approval drawings, payment status, and shipping tracking.",
};

export const dynamic = "force-dynamic";

export default async function PortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PortalClient quoteId={id} />;
}
