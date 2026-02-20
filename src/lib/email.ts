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

interface NewQuoteNotificationData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  doorType: string;
  cost: number;
  assignedRepName: string | null;
  adminUrl: string;
}

export async function sendNewQuoteNotificationEmail(
  data: NewQuoteNotificationData,
  recipientEmails: string[]
) {
  if (recipientEmails.length === 0) return;

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
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:#f5f3ff;border-bottom:1px solid #ede9fe;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#7c3aed;">New Quote Submitted</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.6;">
          A new quote has been submitted and requires attention.
        </p>
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;width:120px;">Quote</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.quoteNumber}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Client</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.clientName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Email</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.clientEmail}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Door Type</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.doorType}</td>
            </tr>
            <tr>
              <td style="padding:10px 0 6px;font-size:13px;color:#a1a1aa;border-top:1px solid #e4e4e7;">Total</td>
              <td style="padding:10px 0 6px;font-size:13px;color:#18181b;font-weight:600;border-top:1px solid #e4e4e7;">$${formattedCost}</td>
            </tr>
            ${data.assignedRepName ? `<tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Assigned To</td>
              <td style="padding:6px 0;font-size:13px;color:#7c3aed;font-weight:500;">${data.assignedRepName}</td>
            </tr>` : ""}
          </table>
        </div>
      </div>

      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.adminUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          View Quote in Admin
        </a>
      </div>
    </div>

    <div style="text-align:center;padding:24px 0;color:#a1a1aa;font-size:12px;">
      <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} Scenic Doors. All rights reserved.</p>
      <p style="margin:0;">Premium Door Solutions</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Scenic Doors" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: recipientEmails.join(", "),
    subject: `New Quote ${data.quoteNumber} — ${data.clientName} | Scenic Doors`,
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

interface WelcomeEmailData {
  name: string;
  email: string;
  password: string;
  role: string;
  loginUrl: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const roleLabel =
    data.role === "admin" ? "Admin" :
    data.role === "sales" ? "Sales Person" :
    data.role === "manager" ? "Manager" :
    data.role === "marketing" ? "Marketing" : "User";

  // HTML-escape the password to prevent rendering issues
  const safePassword = data.password
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:#f5f3ff;border-bottom:1px solid #ede9fe;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#7c3aed;">Welcome to Scenic Doors</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.name},</p>
        <p style="margin:0 0 20px;font-size:14px;color:#71717a;line-height:1.6;">
          Your account has been created. You can now log in to the Scenic Doors admin panel using the credentials below.
        </p>

        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:20px;">
          <p style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;">Your Login Credentials</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;width:100px;">Role</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${roleLabel}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#a1a1aa;">Email</td>
              <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${data.email}</td>
            </tr>
          </table>
        </div>

        <!-- Password in a distinct copyable box -->
        <div style="margin-top:16px;background:#18181b;border-radius:10px;padding:16px 20px;text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;font-weight:600;">Your Password</p>
          <p style="margin:0;font-size:18px;font-weight:700;font-family:'Courier New',Courier,monospace;color:#ffffff;letter-spacing:2px;word-break:break-all;user-select:all;">${safePassword}</p>
        </div>

        <p style="margin:20px 0 0;font-size:12px;color:#ef4444;line-height:1.5;">
          For security, please change your password after your first login.
        </p>
      </div>

      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.loginUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          Log In Now
        </a>
      </div>
    </div>

    <div style="text-align:center;padding:24px 0;color:#a1a1aa;font-size:12px;">
      <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} Scenic Doors. All rights reserved.</p>
      <p style="margin:0;">Premium Door Solutions</p>
    </div>
  </div>
</body>
</html>`;

  // Also include plain text version so password is always copyable
  const text = `Welcome to Scenic Doors!\n\nHi ${data.name},\n\nYour account has been created.\n\nEmail: ${data.email}\nPassword: ${data.password}\nRole: ${roleLabel}\n\nLog in at: ${data.loginUrl}\n\nPlease change your password after your first login.`;

  await transporter.sendMail({
    from: `"Scenic Doors" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: data.email,
    subject: `Your Scenic Doors Account Has Been Created`,
    html,
    text,
  });
}

interface InternalNotificationData {
  heading: string;
  headingColor: string;
  headingBg: string;
  headingBorder: string;
  message: string;
  details: { label: string; value: string }[];
  adminUrl?: string;
  ctaLabel?: string;
}

export async function sendInternalNotificationEmail(
  data: InternalNotificationData,
  recipientEmails: string[]
) {
  if (recipientEmails.length === 0) return;

  const detailRows = data.details
    .map(
      (d) => `<tr>
        <td style="padding:6px 0;font-size:13px;color:#a1a1aa;width:120px;">${d.label}</td>
        <td style="padding:6px 0;font-size:13px;color:#18181b;font-weight:500;">${d.value}</td>
      </tr>`
    )
    .join("");

  const ctaButton = data.adminUrl
    ? `<div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.adminUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          ${data.ctaLabel || "View in Admin"}
        </a>
      </div>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:${data.headingBg};border-bottom:1px solid ${data.headingBorder};padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:${data.headingColor};">${data.heading}</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.6;">${data.message}</p>
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:20px;">
          <table style="width:100%;border-collapse:collapse;">${detailRows}</table>
        </div>
      </div>

      ${ctaButton}
    </div>

    <div style="text-align:center;padding:24px 0;color:#a1a1aa;font-size:12px;">
      <p style="margin:0 0 4px;">&copy; ${new Date().getFullYear()} Scenic Doors. All rights reserved.</p>
      <p style="margin:0;">Premium Door Solutions</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Scenic Doors" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: recipientEmails.join(", "),
    subject: `${data.heading} | Scenic Doors`,
    html,
  });
}

interface QuoteApprovedEmailData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  contractUrl: string;
}

export async function sendQuoteApprovedEmail(data: QuoteApprovedEmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:#f0fdf4;border-bottom:1px solid #dcfce7;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#16a34a;">Quote Approved</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.6;">
          Great news! Your quote <strong>${data.quoteNumber}</strong> has been approved. You can now proceed to sign the contract to get your project started.
        </p>
      </div>

      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.contractUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          Sign Contract
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;">
          Click the button above to review and sign your contract.
        </p>
      </div>
    </div>

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
    subject: `Quote ${data.quoteNumber} Approved — Sign Your Contract | Scenic Doors`,
    html,
  });
}

interface ApprovalDrawingEmailData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  portalUrl: string;
}

export async function sendApprovalDrawingEmail(data: ApprovalDrawingEmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:#fffbeb;border-bottom:1px solid #fef3c7;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#d97706;">Approval Drawing Ready</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.6;">
          Your approval drawing for quote <strong>${data.quoteNumber}</strong> is ready for review. Please take a moment to review the door specifications and sign off so we can begin manufacturing.
        </p>
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:16px 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;width:100px;">Quote</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.quoteNumber}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;">Status</td>
              <td style="padding:4px 0;font-size:13px;color:#d97706;font-weight:500;">Awaiting Your Signature</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.portalUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          Review &amp; Sign Drawing
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;">
          Click the button above to review the drawing and sign to approve manufacturing.
        </p>
      </div>
    </div>

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
    subject: `Approval Drawing Ready — Quote ${data.quoteNumber} | Scenic Doors`,
    html,
  });
}

interface ManufacturingStartedEmailData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  orderNumber: string;
  doorType: string;
  portalUrl: string;
}

export async function sendManufacturingStartedEmail(data: ManufacturingStartedEmailData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:#eff6ff;border-bottom:1px solid #dbeafe;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#2563eb;">Manufacturing Has Started!</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.6;">
          Great news! Your <strong>${data.doorType}</strong> order has entered manufacturing. Our team is now building your custom doors to the exact specifications you approved.
        </p>
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:16px 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;width:100px;">Order</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;">Quote</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.quoteNumber}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;">Status</td>
              <td style="padding:4px 0;font-size:13px;color:#2563eb;font-weight:500;">In Manufacturing</td>
            </tr>
          </table>
        </div>
        <p style="margin:16px 0 0;font-size:14px;color:#71717a;line-height:1.6;">
          We&apos;ll keep you updated on the progress. You can check the status of your order anytime through your client portal.
        </p>
      </div>

      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.portalUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          View Order Status
        </a>
      </div>
    </div>

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
    subject: `Your Doors Are Now in Manufacturing — ${data.orderNumber} | Scenic Doors`,
    html,
  });
}

interface ShippingNotificationEmailData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  orderNumber: string;
  trackingNumber: string;
  shippingCarrier: string;
  portalUrl: string;
}

export async function sendShippingNotificationEmail(data: ShippingNotificationEmailData) {
  const carrierLine = data.shippingCarrier
    ? `<tr>
        <td style="padding:4px 0;font-size:13px;color:#a1a1aa;width:100px;">Carrier</td>
        <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.shippingCarrier}</td>
      </tr>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:#ecfdf5;border-bottom:1px solid #d1fae5;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#059669;">Your Order Has Shipped!</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.6;">
          Great news! Your door order has been shipped and is on its way to you. Here are your tracking details:
        </p>
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:16px 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;width:100px;">Order</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;">Quote</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.quoteNumber}</td>
            </tr>
            ${carrierLine}
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;">Tracking #</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:600;font-family:'Courier New',Courier,monospace;">${data.trackingNumber}</td>
            </tr>
          </table>
        </div>
        <p style="margin:16px 0 0;font-size:14px;color:#71717a;line-height:1.6;">
          You can track your shipment and view your order details through your client portal.
        </p>
      </div>

      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.portalUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#10b981,#059669);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          Track Your Order
        </a>
      </div>
    </div>

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
    subject: `Your Order Has Shipped — ${data.orderNumber} | Scenic Doors`,
    html,
  });
}

interface FollowUpEmailData {
  clientName: string;
  clientEmail: string;
  quoteNumber: string;
  doorType: string;
  sequenceNumber: number;
  quoteUrl: string;
}

const followUpMessages: Record<number, { subject: string; heading: string; body: string }> = {
  1: {
    subject: "Had a chance to review your quote?",
    heading: "Following Up on Your Quote",
    body: "We wanted to check in and see if you've had a chance to review your door quote. We're here to answer any questions you might have about the project.",
  },
  2: {
    subject: "Just checking in on your door project",
    heading: "Still Interested?",
    body: "We noticed you haven't had a chance to respond to your quote yet. We understand these decisions take time — just wanted to make sure you have everything you need to move forward.",
  },
  3: {
    subject: "Final follow-up on your Scenic Doors quote",
    heading: "One Last Check-In",
    body: "This is our final follow-up regarding your door quote. If your plans have changed, no worries at all. If you'd still like to move forward, we're ready when you are.",
  },
};

export async function sendFollowUpEmail(data: FollowUpEmailData) {
  const msg = followUpMessages[data.sequenceNumber] || followUpMessages[1];

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif" alt="Scenic Doors" width="180" style="height:auto;margin-bottom:8px;" />
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <div style="background:#fefce8;border-bottom:1px solid #fef9c3;padding:20px 32px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:700;color:#ca8a04;">${msg.heading}</p>
      </div>

      <div style="padding:24px 32px;">
        <p style="margin:0 0 8px;font-size:16px;color:#18181b;">Hi ${data.clientName},</p>
        <p style="margin:0 0 16px;font-size:14px;color:#71717a;line-height:1.6;">
          ${msg.body}
        </p>
        <div style="background:#fafafa;border-radius:12px;border:1px solid #f4f4f5;padding:16px 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;width:100px;">Quote</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.quoteNumber}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#a1a1aa;">Door Type</td>
              <td style="padding:4px 0;font-size:13px;color:#18181b;font-weight:500;">${data.doorType}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="padding:0 32px 32px;text-align:center;">
        <a href="${data.quoteUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;">
          View Your Quote
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#a1a1aa;">
          You can review, accept, or decline your quote from the link above.
        </p>
      </div>
    </div>

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
    subject: `${msg.subject} — Quote ${data.quoteNumber} | Scenic Doors`,
    html,
  });
}
