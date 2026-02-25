import { jsPDF } from "jspdf";

const LOGO_URL = "https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif";

async function fetchImageAsPngBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function formatDeliveryAddress(raw: string): string {
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === "object" && p.street) {
      const parts = [p.street, p.unit, p.city, p.state, p.zip].filter(Boolean);
      return parts.join(", ");
    }
  } catch { /* plain text */ }
  return raw;
}

interface OrderData {
  order_number: string;
  client_name: string;
  client_email: string;
  status: string;
  created_at: string;
  quote: {
    quote_number: string;
    door_type: string;
    cost: number;
    material: string;
    color: string;
    glass_type: string;
    size: string;
    delivery_type?: string;
    delivery_address?: string;
  };
  payments: {
    payment_type: string;
    amount: number;
    status: string;
    created_at: string;
  }[];
}

export async function generateOrderPdf(order: OrderData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // --- Header / Branding ---
  try {
    const logoBase64 = await fetchImageAsPngBase64(LOGO_URL);
    doc.addImage(logoBase64, "PNG", margin, y, 55, 15);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text("Scenic Doors", margin, y + 10);
  }

  // ORDER badge - top right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text("ORDER", pageWidth - margin, y + 7, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(order.order_number, pageWidth - margin, y + 13, { align: "right" });

  y += 26;

  // --- Status badge ---
  const statusColors: Record<string, { bg: [number, number, number]; text: [number, number, number]; label: string }> = {
    pending: { bg: [254, 243, 199], text: [180, 120, 0], label: "PENDING" },
    in_progress: { bg: [219, 234, 254], text: [37, 99, 235], label: "IN PROGRESS" },
    completed: { bg: [220, 252, 231], text: [22, 163, 74], label: "COMPLETED" },
    cancelled: { bg: [254, 226, 226], text: [220, 38, 38], label: "CANCELLED" },
  };
  const st = statusColors[order.status] || statusColors.pending;
  const badgeWidth = doc.getTextWidth(st.label) + 8;
  doc.setFillColor(...st.bg);
  doc.roundedRect(pageWidth - margin - badgeWidth, y - 2, badgeWidth, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...st.text);
  doc.text(st.label, pageWidth - margin - badgeWidth / 2, y + 3.5, { align: "center" });

  // --- Order meta ---
  doc.setFontSize(9);
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metaItems = [
    { label: "Order Date", value: orderDate },
    { label: "Quote Reference", value: order.quote.quote_number },
    { label: "Client", value: order.client_name },
    { label: "Email", value: order.client_email },
  ];

  for (const item of metaItems) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 140, 140);
    doc.text(item.label + ":", margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(item.value, margin + 38, y);
    y += 5.5;
  }

  y += 6;

  // --- Divider ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // --- Project Specifications ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Project Specifications", margin, y);
  y += 8;

  const specs = [
    { label: "Door Type", value: order.quote.door_type },
    { label: "Material", value: order.quote.material },
    { label: "Color", value: order.quote.color },
    { label: "Glass Type", value: order.quote.glass_type },
    { label: "Size", value: order.quote.size },
  ];

  if (order.quote.delivery_type) {
    specs.push({
      label: "Delivery",
      value:
        order.quote.delivery_type === "pickup"
          ? "Client Pickup"
          : `Delivery to: ${order.quote.delivery_address ? formatDeliveryAddress(order.quote.delivery_address) : "TBD"}`,
    });
  }

  // Table header
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(margin, y - 1, contentWidth, 8, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("SPECIFICATION", margin + 4, y + 4);
  doc.text("DETAIL", margin + contentWidth / 2, y + 4);
  y += 10;

  // Table rows
  doc.setFontSize(9);
  for (let i = 0; i < specs.length; i++) {
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(margin, y - 3.5, contentWidth, 7, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(specs[i].label, margin + 4, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(specs[i].value || "-", margin + contentWidth / 2, y);
    y += 7;
  }

  y += 8;

  // --- Payment Summary ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Payment Summary", margin, y);
  y += 8;

  const cost = Number(order.quote.cost);
  const typeLabels: Record<string, string> = {
    advance_50: "50% Advance",
    balance_50: "50% Balance",
  };

  // Payment rows
  for (const p of order.payments) {
    const isPaid = p.status === "completed";
    const bgColor: [number, number, number] = isPaid ? [240, 253, 244] : [254, 252, 232];
    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, y - 2, contentWidth, 12, 2, 2, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    doc.text(typeLabels[p.payment_type] || p.payment_type, margin + 4, y + 4);

    const pDate = new Date(p.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(pDate, margin + 4, y + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(
      `$${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      margin + contentWidth - 30,
      y + 5,
      { align: "right" }
    );

    // Status label
    const pColor: [number, number, number] = isPaid ? [22, 163, 74] : [180, 120, 0];
    doc.setFontSize(8);
    doc.setTextColor(...pColor);
    doc.text(isPaid ? "Paid" : "Pending", margin + contentWidth - 4, y + 5, { align: "right" });

    y += 15;
  }

  y += 4;

  // Totals
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(margin, y - 2, contentWidth, 22, 2, 2, "F");

  const totalPaid = order.payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const remaining = cost - totalPaid;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Total", margin + 4, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(`$${cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, margin + contentWidth - 4, y + 4, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Paid", margin + 4, y + 10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 163, 74);
  doc.text(`$${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, margin + contentWidth - 4, y + 10, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Remaining", margin + 4, y + 16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(remaining > 0 ? 180 : 22, remaining > 0 ? 120 : 163, remaining > 0 ? 0 : 74);
  doc.text(`$${remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, margin + contentWidth - 4, y + 16, { align: "right" });

  // --- Footer ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text(
    `© ${new Date().getFullYear()} Scenic Doors — Premium Door Solutions`,
    pageWidth / 2,
    290,
    { align: "center" }
  );

  return doc;
}
