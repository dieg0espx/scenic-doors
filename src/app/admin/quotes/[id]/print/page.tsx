import { redirect } from "next/navigation";
import { getQuoteDetail } from "@/lib/actions/quotes";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function QuotePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getQuoteDetail(id);

  if (!quote) redirect("/admin/quotes");

  const total = Number(quote.grand_total || quote.cost || 0);

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print, aside, nav { display: none !important; }
          main { padding: 0 !important; }
          .print-page { color: #1a1a1a !important; }
        }
        .print-page { font-family: 'Inter', system-ui, sans-serif; color: #1a1a1a; background: white; padding: 2rem; max-width: 800px; margin: 0 auto; font-size: 14px; line-height: 1.5; border-radius: 16px; }
        .print-page .p-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e5e5; }
        .print-page .p-logo { font-size: 24px; font-weight: 700; color: #1a1a1a; }
        .print-page .p-logo-sub { font-size: 11px; color: #888; margin-top: 4px; }
        .print-page .p-title { text-align: right; }
        .print-page .p-title h2 { font-size: 20px; color: #1a1a1a; font-family: inherit; }
        .print-page .p-number { font-family: monospace; color: #666; font-size: 13px; }
        .print-page .p-date { color: #888; font-size: 12px; margin-top: 4px; }
        .print-page .p-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .print-page .p-section { margin-bottom: 1.5rem; }
        .print-page .p-section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px; font-weight: 600; }
        .print-page .p-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
        .print-page .p-value { color: #333; margin-top: 2px; }
        .print-page table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .print-page th { text-align: left; padding: 8px 12px; background: #f5f5f5; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; font-weight: 600; }
        .print-page td { padding: 10px 12px; border-bottom: 1px solid #eee; color: #333; }
        .print-page .txt-right { text-align: right; }
        .print-page .total-row { background: #f9f9f9; }
        .print-page .total-row td { font-weight: 600; font-size: 16px; padding: 12px; }
        .print-page .p-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #eee; text-align: center; color: #aaa; font-size: 11px; }
      `}</style>

      <PrintButton />

      <div className="print-page">
        <div className="p-header">
          <div>
            <div className="p-logo">Scenic Doors</div>
            <div className="p-logo-sub">Premium Door Installation · Southern California</div>
          </div>
          <div className="p-title">
            <h2>Quote</h2>
            <div className="p-number">{quote.quote_number}</div>
            <div className="p-date">
              {new Date(quote.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="p-grid">
          <div>
            <div className="p-section-title">Customer</div>
            <div className="p-value" style={{ fontWeight: 600 }}>{quote.client_name}</div>
            <div className="p-value" style={{ color: "#666" }}>{quote.client_email}</div>
            {quote.customer_phone && (
              <div className="p-value" style={{ color: "#666" }}>{quote.customer_phone}</div>
            )}
            {quote.customer_zip && (
              <div className="p-value" style={{ color: "#666" }}>ZIP: {quote.customer_zip}</div>
            )}
          </div>
          <div>
            <div className="p-section-title">Project Details</div>
            <div><span className="p-label">Door Type: </span><span className="p-value">{quote.door_type}</span></div>
            <div><span className="p-label">Material: </span><span className="p-value">{quote.material}</span></div>
            <div><span className="p-label">Color: </span><span className="p-value">{quote.color}</span></div>
            <div><span className="p-label">Glass: </span><span className="p-value">{quote.glass_type}</span></div>
            <div><span className="p-label">Size: </span><span className="p-value">{quote.size}</span></div>
          </div>
        </div>

        {Array.isArray(quote.items) && quote.items.length > 0 && (
          <div className="p-section">
            <div className="p-section-title">Line Items</div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="txt-right">Qty</th>
                  <th className="txt-right">Unit Price</th>
                  <th className="txt-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item: { id?: string; name: string; quantity: number; unit_price: number; total: number }, idx: number) => (
                  <tr key={item.id || idx}>
                    <td>{item.name}</td>
                    <td className="txt-right">{item.quantity}</td>
                    <td className="txt-right">${Number(item.unit_price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="txt-right">${Number(item.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-section">
          <div className="p-section-title">Pricing Summary</div>
          <table>
            <tbody>
              {Number(quote.subtotal) > 0 && (
                <tr>
                  <td>Subtotal</td>
                  <td className="txt-right">${Number(quote.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
              {Number(quote.installation_cost) > 0 && (
                <tr>
                  <td>Installation</td>
                  <td className="txt-right">${Number(quote.installation_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
              {Number(quote.delivery_cost) > 0 && (
                <tr>
                  <td>Delivery</td>
                  <td className="txt-right">${Number(quote.delivery_cost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
              {Number(quote.tax) > 0 && (
                <tr>
                  <td>Tax</td>
                  <td className="txt-right">${Number(quote.tax).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
              <tr className="total-row">
                <td>Grand Total</td>
                <td className="txt-right">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {quote.delivery_type && (
          <div className="p-section">
            <div className="p-section-title">Delivery</div>
            <p style={{ color: "#333", textTransform: "capitalize" }}>
              {quote.delivery_type}
              {quote.delivery_address && ` — ${quote.delivery_address}`}
            </p>
          </div>
        )}

        {quote.notes && (
          <div className="p-section">
            <div className="p-section-title">Notes</div>
            <p style={{ color: "#555" }}>{quote.notes}</p>
          </div>
        )}

        <div className="p-footer">
          <p>Scenic Doors · Premium Door Installation · Southern California</p>
          <p style={{ marginTop: "4px" }}>This quote is valid for 30 days from the date above.</p>
        </div>
      </div>
    </>
  );
}
