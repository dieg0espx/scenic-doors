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

interface InvoiceData {
  id: string;
  client_name: string;
  amount: number;
  payment_type: string;
  status: string;
  created_at: string;
  quotes: {
    quote_number: string;
    door_type: string;
    cost: number;
    material: string;
    color: string;
    glass_type: string;
    size: string;
    client_email: string;
    delivery_type?: string;
    delivery_address?: string;
  };
}

export async function generateInvoicePdf(payment: InvoiceData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const isAdvance = payment.payment_type === "advance_50";
  const invoiceLabel = isAdvance ? "Advance Payment" : "Balance Payment";
  const invoiceNumber = `INV-${payment.quotes.quote_number.replace("QT-", "")}${isAdvance ? "-A" : "-B"}`;

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

  // INVOICE badge - top right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text("INVOICE", pageWidth - margin, y + 7, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(invoiceNumber, pageWidth - margin, y + 13, { align: "right" });

  y += 26;

  // --- Status badge ---
  const isPaid = payment.status === "completed";
  if (isPaid) {
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(pageWidth - margin - 28, y - 2, 28, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(22, 163, 74);
    doc.text("PAID", pageWidth - margin - 14, y + 3.5, { align: "center" });
  } else {
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(pageWidth - margin - 32, y - 2, 32, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(180, 120, 0);
    doc.text("UNPAID", pageWidth - margin - 16, y + 3.5, { align: "center" });
  }

  // --- Invoice meta ---
  const issueDate = new Date(payment.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFontSize(9);
  const metaItems = [
    { label: "Invoice Date", value: issueDate },
    { label: "Invoice Type", value: invoiceLabel },
    { label: "Quote Reference", value: payment.quotes.quote_number },
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

  // --- Bill To ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text("Bill To", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text(payment.client_name, margin, y);
  y += 4.5;
  doc.setTextColor(120, 120, 120);
  doc.text(payment.quotes.client_email, margin, y);
  y += 4.5;
  if (payment.quotes.delivery_type === "delivery" && payment.quotes.delivery_address) {
    doc.text(payment.quotes.delivery_address, margin, y);
    y += 4.5;
  }

  y += 8;

  // --- Items Table ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 1;

  // Table header
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, y, contentWidth, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("DESCRIPTION", margin + 4, y + 6);
  doc.text("QTY", margin + contentWidth - 50, y + 6, { align: "right" });
  doc.text("AMOUNT", margin + contentWidth - 4, y + 6, { align: "right" });
  y += 16;

  // Project line item
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(`${payment.quotes.door_type} — ${payment.quotes.material}`, margin + 4, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const specLine = `${payment.quotes.color} | ${payment.quotes.glass_type} | ${payment.quotes.size}`;
  doc.text(specLine, margin + 4, y);

  // qty & total on the first line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text("1", margin + contentWidth - 50, y - 4.5, { align: "right" });

  const totalCost = Number(payment.quotes.cost);
  doc.text(
    `$${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    margin + contentWidth - 4,
    y - 4.5,
    { align: "right" }
  );

  y += 8;

  // Divider
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y, pageWidth - margin, y);
  y += 2;

  // Payment breakdown (if advance, show 50% of total)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Project Total:", margin + contentWidth - 60, y + 5);
  doc.setTextColor(70, 70, 70);
  doc.text(
    `$${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    margin + contentWidth - 4,
    y + 5,
    { align: "right" }
  );

  doc.setTextColor(120, 120, 120);
  doc.text(`${isAdvance ? "50% Advance" : "50% Balance"} Due:`, margin + contentWidth - 60, y + 11);

  y += 15;

  // Amount due box
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin + contentWidth - 70, y, 70, 12, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(22, 163, 74);
  const amount = Number(payment.amount);
  doc.text(
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    margin + contentWidth - 4,
    y + 8.5,
    { align: "right" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("Amount Due:", margin + contentWidth - 74, y + 8.5, { align: "right" });

  y += 22;

  // --- Payment Terms ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text("Payment Terms", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);

  const terms = isAdvance
    ? [
        "This invoice represents the 50% advance payment due upon contract signing.",
        "The remaining 50% balance will be invoiced upon project completion.",
        "Payment is due within 7 days of invoice date.",
      ]
    : [
        "This invoice represents the 50% balance payment due upon project completion.",
        "The advance payment of 50% has been previously received.",
        "Payment is due within 7 days of invoice date.",
      ];

  for (const term of terms) {
    const lines = doc.splitTextToSize(`• ${term}`, contentWidth - 8);
    doc.text(lines, margin + 4, y);
    y += lines.length * 4 + 2;
  }

  y += 6;

  // --- Delivery Info ---
  if (payment.quotes.delivery_type) {
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text("Delivery", margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    if (payment.quotes.delivery_type === "pickup") {
      doc.text("Client Pickup", margin + 4, y);
    } else {
      doc.text(
        `Delivery to: ${payment.quotes.delivery_address || "Address TBD"}`,
        margin + 4,
        y
      );
    }
    y += 8;
  }

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
