import { jsPDF } from "jspdf";

const LOGO_URL =
  "https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif";

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

export interface ApprovalPdfInput {
  overall_width: number;
  overall_height: number;
  panel_count: number;
  slide_direction: string; // "left" | "right" | "bi-part"
  in_swing: string; // "interior" | "exterior"
  frame_color?: string;
  hardware_color?: string;
  customer_name?: string | null;
  signature_data?: string | null;
  signed_at?: string | null;
}

/* ================================================================
   Main export — generates one page per call
   ================================================================ */
export async function generateApprovalDrawingPdf(data: ApprovalPdfInput) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pw = doc.internal.pageSize.getWidth(); // 215.9
  const ml = 22;
  const mr = 22;

  let y = 16;

  /* ── Logo ─────────────────────────────────────────────── */
  try {
    const logoBase64 = await fetchImageAsPngBase64(LOGO_URL);
    doc.addImage(logoBase64, "PNG", ml, y, 26, 9);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text("SCENIC DOORS", ml, y + 6);
  }

  /* ── Title ────────────────────────────────────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(25, 25, 25);
  doc.text("SCENIC DOORS \u2013 SLIDE & STACK APPROVAL", pw / 2, y + 5, {
    align: "center",
  });

  y += 16;

  /* ── Subtitle ─────────────────────────────────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text("OUTSIDE VIEW", pw / 2, y, { align: "center" });

  y += 6;

  /* ── Door Diagram ─────────────────────────────────────── */
  const diagramW = pw - ml - mr;
  const diagramH = 108;
  drawDoorDiagram(doc, ml, y, diagramW, diagramH, data);

  y += diagramH + 14;

  /* ── Specification Form ───────────────────────────────── */
  const labelX = ml;
  const valX = ml + 50; // value column start
  const col2LabelX = pw / 2 + 8;
  const col2ValX = col2LabelX + 42;

  // Derive checkbox states
  const slidesLeft =
    data.slide_direction === "left" || data.slide_direction === "bi-part";
  const slidesRight =
    data.slide_direction === "right" || data.slide_direction === "bi-part";
  const inSwing =
    data.in_swing === "interior" || data.in_swing === "in-swing";
  const outSwing =
    data.in_swing === "exterior" || data.in_swing === "out-swing";

  // Lead panel: derive from slide direction
  let leadLeft =
    data.slide_direction === "left" || data.slide_direction === "bi-part";
  let leadRight =
    data.slide_direction === "right" || data.slide_direction === "bi-part";

  const frameColor = normalizeFrameColor(data.frame_color);
  const hwColor = normalizeHardwareColor(data.hardware_color || data.frame_color);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(35, 35, 35);

  // Row 1: Overall Width / Overall Height
  doc.text("Overall Width", labelX, y + 5);
  drawValueBox(doc, valX, y, 32, `${data.overall_width}"`);
  doc.text("Overall Height", col2LabelX, y + 5);
  drawValueBox(doc, col2ValX, y, 32, `${data.overall_height}"`);
  y += 12;

  // Row 2: Number of Panels
  doc.text("Number of Panels", labelX, y + 5);
  drawValueBox(doc, valX, y, 24, String(data.panel_count));
  y += 12;

  // Row 3: Opening Direction — Slides Left / Slides Right
  doc.text("Opening Direction", labelX, y + 4);
  drawCheckbox(doc, valX, y, slidesLeft);
  doc.text("Slides Left", valX + 7, y + 4);
  drawCheckbox(doc, col2LabelX, y, slidesRight);
  doc.text("Slides Right", col2LabelX + 7, y + 4);
  y += 10;

  // Row 4: In-Swing / Out-Swing (continuation, no label)
  drawCheckbox(doc, valX, y, inSwing);
  doc.text("In-Swing", valX + 7, y + 4);
  drawCheckbox(doc, col2LabelX, y, outSwing);
  doc.text("Out-Swing", col2LabelX + 7, y + 4);
  y += 11;

  // Row 5: Lead Panel Location
  doc.text("Lead Panel Location", labelX, y + 4);
  drawCheckbox(doc, valX, y, leadLeft);
  doc.text("Left", valX + 7, y + 4);
  drawCheckbox(doc, col2LabelX, y, leadRight);
  doc.text("Right", col2LabelX + 7, y + 4);
  y += 11;

  // Row 6: Frame Color
  doc.text("Frame Color", labelX, y + 4);
  drawCheckbox(doc, valX, y, frameColor === "black");
  doc.text("Black", valX + 7, y + 4);
  drawCheckbox(doc, col2LabelX, y, frameColor === "white");
  doc.text("White", col2LabelX + 7, y + 4);
  drawCheckbox(doc, col2ValX, y, frameColor === "bronze");
  doc.text("Bronze", col2ValX + 7, y + 4);
  y += 11;

  // Row 7: Hardware Color
  doc.text("Hardware Color", labelX, y + 4);
  drawCheckbox(doc, valX, y, hwColor === "black");
  doc.text("Black", valX + 7, y + 4);
  drawCheckbox(doc, col2LabelX, y, hwColor === "white");
  doc.text("White", col2LabelX + 7, y + 4);
  drawCheckbox(doc, col2ValX, y, hwColor === "silver");
  doc.text("Silver", col2ValX + 7, y + 4);
  y += 16;

  /* ── Customer Name / Date / Signature ─────────────────── */
  const lineEnd = pw - mr;
  const hasSigned = !!data.customer_name && !!data.signature_data;

  doc.text("Customer Name", labelX, y + 5);
  const nameBarW = col2LabelX - valX - 6;
  drawBlueBar(doc, valX, y, nameBarW, 7);
  if (data.customer_name) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(35, 35, 35);
    doc.text(data.customer_name, valX + 3, y + 5);
    doc.setFont("helvetica", "normal");
  }

  doc.text("Date", col2LabelX, y + 5);
  const dateBarW = lineEnd - col2ValX + 8;
  drawBlueBar(doc, col2ValX - 8, y, dateBarW, 7);
  if (hasSigned && data.signed_at) {
    const dateStr = new Date(data.signed_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(35, 35, 35);
    doc.text(dateStr, col2ValX - 8 + 3, y + 5);
    doc.setFont("helvetica", "normal");
  }
  y += 12;

  doc.text("Signature", labelX, y + 5);
  const sigBarW = lineEnd - valX;
  const sigBarH = hasSigned ? 22 : 7;
  drawBlueBar(doc, valX, y, sigBarW, sigBarH);
  if (hasSigned && data.signature_data) {
    try {
      doc.addImage(data.signature_data, "PNG", valX + 2, y + 1, sigBarW - 4, sigBarH - 2);
    } catch {
      // If signature image fails, leave the bar empty
    }
  }

  return doc;
}

/* ================================================================
   Door Diagram
   ================================================================ */
function drawDoorDiagram(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  data: ApprovalPdfInput,
) {
  const panels = Math.max(1, data.panel_count);
  const slidesRight = data.slide_direction === "right";

  // Outer frame shadow (subtle 3-D effect)
  doc.setFillColor(42, 42, 48);
  doc.rect(x + 0.8, y + 0.8, w, h, "F");

  // Main outer frame
  doc.setFillColor(58, 58, 64);
  doc.rect(x, y, w, h, "F");

  // Highlight edges (top + left lighter)
  doc.setDrawColor(82, 82, 88);
  doc.setLineWidth(0.6);
  doc.line(x, y, x + w, y);
  doc.line(x, y, x, y + h);

  // Inner frame border
  const fi = 3.5; // frame inset
  doc.setFillColor(68, 68, 74);
  doc.rect(x + fi, y + fi, w - fi * 2, h - fi * 2, "F");

  // Glass area
  const gi = 2; // glass inset from inner frame
  const gx = x + fi + gi;
  const gy = y + fi + gi;
  const gw = w - (fi + gi) * 2;
  const gh = h - (fi + gi) * 2;

  // Panel metrics
  const mullionW = 2.8;
  const totalMullion = (panels - 1) * mullionW;
  const panelW = (gw - totalMullion) / panels;

  for (let i = 0; i < panels; i++) {
    const px = gx + i * (panelW + mullionW);

    // Glass fill — light blue
    doc.setFillColor(198, 218, 238);
    doc.rect(px, gy, panelW, gh, "F");

    // Subtle horizontal gradient band near top (header rail tint)
    doc.setFillColor(188, 208, 228);
    doc.rect(px, gy, panelW, gh * 0.08, "F");

    // Diagonal line
    doc.setDrawColor(148, 165, 182);
    doc.setLineWidth(0.35);
    if (slidesRight) {
      // / direction (top-right to bottom-left)
      doc.line(
        px + panelW * 0.88,
        gy + gh * 0.03,
        px + panelW * 0.12,
        gy + gh * 0.97,
      );
    } else {
      // \ direction (top-left to bottom-right)
      doc.line(
        px + panelW * 0.12,
        gy + gh * 0.03,
        px + panelW * 0.88,
        gy + gh * 0.97,
      );
    }
  }

  // Mullion bars between panels (draw ON TOP of glass)
  doc.setFillColor(58, 58, 64);
  for (let i = 1; i < panels; i++) {
    const mx = gx + i * panelW + (i - 1) * mullionW;
    doc.rect(mx, gy, mullionW, gh, "F");
  }

  // Reset
  doc.setLineWidth(0.2);
}

/* ================================================================
   Helpers
   ================================================================ */

function drawCheckbox(
  doc: jsPDF,
  x: number,
  y: number,
  checked: boolean,
) {
  const s = 5;
  if (checked) {
    doc.setFillColor(172, 196, 220);
    doc.setDrawColor(130, 152, 178);
    doc.rect(x, y, s, s, "FD");
    // Checkmark
    doc.setDrawColor(38, 38, 42);
    doc.setLineWidth(0.65);
    doc.line(x + 1.1, y + 2.7, x + 2.1, y + 3.8);
    doc.line(x + 2.1, y + 3.8, x + 4.0, y + 1.3);
    doc.setLineWidth(0.2);
  } else {
    doc.setFillColor(228, 232, 238);
    doc.setDrawColor(160, 165, 172);
    doc.rect(x, y, s, s, "FD");
  }
}

function drawValueBox(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  value: string,
) {
  doc.setFillColor(182, 204, 224);
  doc.rect(x, y, w, 7, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(value, x + 3, y + 5);
}

function drawBlueBar(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  doc.setFillColor(182, 204, 224);
  doc.rect(x, y, w, h, "F");
}

function normalizeFrameColor(color?: string): string {
  if (!color) return "black";
  const c = color.toLowerCase();
  if (c.includes("white")) return "white";
  if (c.includes("bronze")) return "bronze";
  return "black";
}

function normalizeHardwareColor(color?: string): string {
  if (!color) return "black";
  const c = color.toLowerCase();
  if (c.includes("white")) return "white";
  if (c.includes("silver") || c.includes("chrome") || c.includes("stainless"))
    return "silver";
  return "black";
}
