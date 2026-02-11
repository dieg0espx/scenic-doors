import { jsPDF } from "jspdf";

interface ContractData {
  client_name: string;
  signature_url: string;
  signed_at: string;
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

async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

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

export async function generateContractPdf(contract: ContractData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // --- Header / Branding ---
  try {
    const logoBase64 = await fetchImageAsPngBase64("https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif");
    doc.addImage(logoBase64, "PNG", margin, y, 55, 15);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text("Scenic Doors", margin, y + 10);
  }

  y += 24;

  // --- Title ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Service Agreement & Contract", margin, y);
  y += 10;

  // --- Meta info ---
  const signedDate = new Date(contract.signed_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metaItems = [
    { label: "Date", value: signedDate },
    { label: "Quote Reference", value: contract.quotes.quote_number },
    { label: "Client", value: contract.client_name },
    { label: "Email", value: contract.quotes.client_email },
  ];

  doc.setFontSize(9);
  for (const item of metaItems) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 140, 140);
    doc.text(item.label + ":", margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(item.value, margin + 35, y);
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
    { label: "Door Type", value: contract.quotes.door_type },
    { label: "Material", value: contract.quotes.material },
    { label: "Color", value: contract.quotes.color },
    { label: "Glass Type", value: contract.quotes.glass_type },
    { label: "Size", value: contract.quotes.size },
  ];

  if (contract.quotes.delivery_type) {
    specs.push({
      label: "Delivery",
      value:
        contract.quotes.delivery_type === "pickup"
          ? "Client Pickup"
          : `Delivery to: ${contract.quotes.delivery_address || "TBD"}`,
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

  // --- Payment Terms ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Payment Terms", margin, y);
  y += 8;

  const cost = Number(contract.quotes.cost);
  const formattedTotal = cost.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formattedAdvance = (cost * 0.5).toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formattedBalance = (cost * 0.5).toLocaleString("en-US", { minimumFractionDigits: 2 });

  doc.setFillColor(240, 253, 244); // light green bg
  doc.roundedRect(margin, y - 2, contentWidth, 22, 2, 2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Total Project Cost", margin + 4, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(`$${formattedTotal}`, margin + contentWidth - 4, y + 4, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("50% Advance Payment", margin + 4, y + 11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(`$${formattedAdvance}`, margin + contentWidth - 4, y + 11, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("50% Balance (upon completion)", margin + 4, y + 18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text(`$${formattedBalance}`, margin + contentWidth - 4, y + 18, { align: "right" });

  y += 30;

  // --- Terms & Conditions ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Terms & Conditions", margin, y);
  y += 7;

  const terms = [
    "Scenic Doors agrees to supply and install the specified door system according to the specifications above.",
    "The estimated timeline for completion will be communicated upon receipt of the advance payment.",
    "Any changes to the original specifications may result in additional charges.",
    "All materials come with manufacturer warranties. Installation is warranted for 5 years.",
    "Cancellation within 72 hours of signing is eligible for a full refund of the advance payment.",
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);

  for (let i = 0; i < terms.length; i++) {
    const lines = doc.splitTextToSize(`${i + 1}. ${terms[i]}`, contentWidth - 8);
    if (y + lines.length * 4 > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines, margin + 4, y);
    y += lines.length * 4 + 2;
  }

  y += 8;

  // --- Signature ---
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Signature", margin, y);
  y += 8;

  try {
    const sigBase64 = await fetchImageAsBase64(contract.signature_url);
    doc.addImage(sigBase64, "PNG", margin, y, 60, 25);
    y += 28;
  } catch {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text("[Signature image unavailable]", margin, y + 5);
    y += 12;
  }

  doc.setDrawColor(180, 180, 180);
  doc.line(margin, y, margin + 70, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Signed by: ${contract.client_name}`, margin, y);
  y += 5;
  doc.text(`Date: ${signedDate}`, margin, y);

  // --- Footer ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.text(
      `© ${new Date().getFullYear()} Scenic Doors — Premium Door Solutions`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return doc;
}
