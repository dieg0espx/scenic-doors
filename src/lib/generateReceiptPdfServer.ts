import { jsPDF } from "jspdf";

interface ReceiptData {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  paymentType: string;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
  paidAt: string;
}

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  zelle: "Zelle",
  check: "Check",
  cash: "Cash",
};

export function generateReceiptPdfBuffer(data: ReceiptData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const typeLabel = data.paymentType === "advance_50" ? "50% Advance Payment" : "50% Balance Payment";
  const paidDate = new Date(data.paidAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text("Scenic Doors", margin, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("Premium Door Solutions", margin, y + 14);

  // RECEIPT badge - top right
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(pageWidth - margin - 38, y, 38, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(22, 163, 74);
  doc.text("PAID", pageWidth - margin - 19, y + 7, { align: "center" });

  y += 24;

  // RECEIPT title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text("RECEIPT", pageWidth - margin, y + 7, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(data.invoiceNumber, pageWidth - margin, y + 13, { align: "right" });

  // Meta info
  const metaItems = [
    { label: "Date Paid", value: paidDate },
    { label: "Payment Type", value: typeLabel },
    { label: "Quote Reference", value: data.quoteNumber },
  ];

  doc.setFontSize(9);
  for (const item of metaItems) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 140, 140);
    doc.text(item.label + ":", margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(item.value, margin + 38, y);
    y += 5.5;
  }

  y += 8;

  // --- Divider ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // --- Paid To / From ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text("Paid By", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text(data.clientName, margin, y);
  y += 4.5;
  doc.setTextColor(120, 120, 120);
  doc.text(data.clientEmail, margin, y);
  y += 10;

  // --- Divider ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // --- Payment Details Table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text("Payment Details", margin, y);
  y += 8;

  const details = [
    { label: "Payment Method", value: methodLabels[data.paymentMethod] || data.paymentMethod },
    { label: "Reference Number", value: data.paymentReference },
    { label: "Date", value: paidDate },
  ];

  // Table header
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(margin, y - 1, contentWidth, 8, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("DETAIL", margin + 4, y + 4);
  doc.text("VALUE", margin + contentWidth / 2, y + 4);
  y += 12;

  doc.setFontSize(9);
  for (let i = 0; i < details.length; i++) {
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(margin, y - 3.5, contentWidth, 7, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(details[i].label, margin + 4, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(details[i].value, margin + contentWidth / 2, y);
    y += 7;
  }

  y += 10;

  // --- Amount Box ---
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(22, 163, 74);
  doc.text("Amount Paid", margin + 8, y + 11);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(
    `$${Number(data.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    margin + contentWidth - 8,
    y + 12,
    { align: "right" }
  );

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

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
