import nodemailer from "nodemailer";
import { generateReceiptPdfBuffer } from "./generateReceiptPdfServer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface QuoteEmailData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  doorType: string;
  material: string;
  color: string;
  glassType: string;
  size: string;
  cost: number;
  quoteUrl: string;
  deliveryType?: string;
  deliveryAddress?: string;
}

export async function sendQuoteEmail(data: QuoteEmailData) {
  const formattedCost = Number(data.cost).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <!-- Card -->
    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <!-- Greeting -->
      <div style="padding:32px 32px 24px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6;">
          We've prepared a quote for your door project. Please review the details below and let us know how you'd like to proceed.
        </p>
      </div>

      <!-- Quote Details -->
      <div style="padding:0 32px 24px;">
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:20px;">
          <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;">Quote ${data.quoteNumber}</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;width:100px;">Door Type</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.doorType}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Material</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.material}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Color</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.color}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Glass</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.glassType}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Size</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.size}</td>
            </tr>
            ${data.deliveryType ? `<tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Delivery</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.deliveryType === "pickup" ? "Client Pickup" : `Delivery${data.deliveryAddress ? ` to: ${data.deliveryAddress}` : ""}`}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0 6px;font-size:13px;color:#a1a1aa;border-top:1px solid #e4e4e7;">Total Cost</td>
              <td style="padding:10px 0 6px;font-size:13px;color:#18181b;font-weight:600;border-top:1px solid #e4e4e7;">$${formattedCost}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.quoteUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          View Full Quote
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;">
          You can accept or decline this quote from the link above.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#a1a1aa;font-size:12px;">
      <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} Scenic Doors. All rights reserved.</p>
      <p style="margin:0;">Premium Door Solutions</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Scenic Doors" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: data.clientEmail,
    subject: `Your Quote ${data.quoteNumber} from Scenic Doors`,
    html,
  });
}

interface InvoiceEmailData {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  quoteNumber: string;
  paymentType: string;
  amount: number;
  invoiceUrl: string;
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  const formattedAmount = Number(data.amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });

  const typeLabel = data.paymentType === "advance_50" ? "50% Advance Payment" : "50% Balance Payment";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <!-- Card -->
    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <!-- Greeting -->
      <div style="padding:32px 32px 24px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6;">
          Please find your invoice below for the ${typeLabel.toLowerCase()} on your door project.
        </p>
      </div>

      <!-- Invoice Details -->
      <div style="padding:0 32px 24px;">
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:20px;">
          <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;">${data.invoiceNumber}</p>
          <p style="margin:0 0 16px;font-size:12px;color:#a1a1aa;">${typeLabel} &bull; Quote ${data.quoteNumber}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;color:#71717a;">Amount Due</span>
            <span style="font-size:13px;font-weight:600;color:#18181b;">$${formattedAmount}</span>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.invoiceUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          View Invoice & Pay
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;">
          You can view the full invoice, download the PDF, and submit your payment from the link above.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#a1a1aa;font-size:12px;">
      <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} Scenic Doors. All rights reserved.</p>
      <p style="margin:0;">Premium Door Solutions</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Scenic Doors" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: data.clientEmail,
    subject: `Invoice ${data.invoiceNumber} — ${typeLabel} | Scenic Doors`,
    html,
  });
}

interface BalanceEmailData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  amount: number;
  payUrl: string;
}

export async function sendBalanceEmail(data: BalanceEmailData) {
  const formattedAmount = Number(data.amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <!-- Card -->
    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <!-- Greeting -->
      <div style="padding:32px 32px 24px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6;">
          Great news! Your door project is now complete. The remaining balance payment is now due.
        </p>
      </div>

      <!-- Balance Details -->
      <div style="padding:0 32px 24px;">
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:20px;">
          <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;">Quote ${data.quoteNumber}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;color:#71717a;">50% Balance Due</span>
            <span style="font-size:24px;font-weight:700;color:#18181b;">$${formattedAmount}</span>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.payUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          View Payment Details
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;">
          Please arrange the balance payment at your earliest convenience.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#a1a1aa;font-size:12px;">
      <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} Scenic Doors. All rights reserved.</p>
      <p style="margin:0;">Premium Door Solutions</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Scenic Doors" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: data.clientEmail,
    subject: `Balance Payment Due - Quote ${data.quoteNumber} | Scenic Doors`,
    html,
  });
}

interface PaymentReceiptData {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
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

export async function sendPaymentReceiptEmail(data: PaymentReceiptData) {
  const formattedAmount = Number(data.amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });

  const typeLabel = data.paymentType === "advance_50" ? "50% Advance Payment" : "50% Balance Payment";
  const paidDate = new Date(data.paidAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <!-- Card -->
    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <!-- Green banner -->
      <div style="background:#f0fdf4;border-bottom:1px solid #dcfce7;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#16a34a;">Payment Confirmed</p>
      </div>

      <!-- Greeting -->
      <div style="padding:24px 32px 16px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0;font-size:14px;color:#71717a;line-height:1.6;">
          We've received your payment. Here's your receipt for your records.
        </p>
      </div>

      <!-- Receipt Details -->
      <div style="padding:0 32px 24px;">
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:20px;">
          <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;">Receipt</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;width:120px;">Invoice</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Type</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${typeLabel}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Quote</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.quoteNumber}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Method</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${methodLabels[data.paymentMethod] || data.paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Reference</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.paymentReference}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Date</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${paidDate}</td>
            </tr>
            <tr>
              <td style="padding:10px 0 6px;font-size:13px;color:#a1a1aa;border-top:1px solid #e4e4e7;">Amount Paid</td>
              <td style="padding:10px 0 6px;font-size:13px;color:#16a34a;font-weight:600;border-top:1px solid #e4e4e7;">$${formattedAmount}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Note -->
      <div style="padding:0 32px 32px;">
        <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">
          Thank you for your payment. If you have any questions, please don't hesitate to reach out.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#a1a1aa;font-size:12px;">
      <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} Scenic Doors. All rights reserved.</p>
      <p style="margin:0;">Premium Door Solutions</p>
    </div>
  </div>
</body>
</html>`;

  const pdfBuffer = generateReceiptPdfBuffer({
    invoiceNumber: data.invoiceNumber,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    quoteNumber: data.quoteNumber,
    paymentType: data.paymentType,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    paymentReference: data.paymentReference,
    paidAt: data.paidAt,
  });

  await transporter.sendMail({
    from: `"Scenic Doors" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: data.clientEmail,
    subject: `Payment Receipt ${data.invoiceNumber} | Scenic Doors`,
    html,
    attachments: [
      {
        filename: `Receipt-${data.invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
