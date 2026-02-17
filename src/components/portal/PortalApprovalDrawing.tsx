"use client";

import { useState, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { signApprovalDrawing } from "@/lib/actions/approval-drawings";
import type { ApprovalDrawing } from "@/lib/types";

interface PortalApprovalDrawingProps {
  drawing: ApprovalDrawing | null;
  quoteName: string;
  quoteId: string;
}

export default function PortalApprovalDrawing({ drawing, quoteName, quoteId }: PortalApprovalDrawingProps) {
  const [signing, setSigning] = useState(false);
  const [showSignPad, setShowSignPad] = useState(false);
  const [customerName, setCustomerName] = useState(quoteName);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  if (!drawing) {
    return (
      <div className="bg-white rounded-xl border border-ocean-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-ocean-100 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-ocean-400" />
        </div>
        <h3 className="text-lg font-semibold text-ocean-900 mb-2">Approval Drawing Pending</h3>
        <p className="text-ocean-500 text-sm max-w-md mx-auto">
          Your approval drawing is being prepared by our team. You&apos;ll receive an email notification when it&apos;s ready for review.
        </p>
      </div>
    );
  }

  if (drawing.status === "signed") {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-ocean-900 mb-1">Approval Drawing Signed</h3>
          <p className="text-ocean-500 text-sm">
            Signed by {drawing.customer_name} on{" "}
            {new Date(drawing.signed_at!).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <DrawingDetails drawing={drawing} />
      </div>
    );
  }

  function initCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a2634";
    ctx.lineCap = "round";
  }

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawingRef.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function handleSign() {
    const canvas = canvasRef.current;
    if (!canvas || !customerName.trim()) return;
    setSigning(true);
    try {
      const signatureData = canvas.toDataURL("image/png");
      await signApprovalDrawing(drawing!.id, customerName, signatureData);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to sign");
    } finally {
      setSigning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-center gap-3">
        <FileText className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          Please review the approval drawing below and sign to confirm your order specifications.
        </p>
      </div>

      <DrawingDetails drawing={drawing} />

      {/* Sign Section */}
      {!showSignPad ? (
        <div className="bg-white rounded-xl border border-ocean-200 p-6 text-center">
          <h3 className="text-lg font-semibold text-ocean-900 mb-2">Ready to Approve?</h3>
          <p className="text-ocean-500 text-sm mb-4">
            By signing, you confirm that the specifications above are correct and authorize manufacturing.
          </p>
          <button
            onClick={() => {
              setShowSignPad(true);
              setTimeout(initCanvas, 100);
            }}
            className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Sign Approval Drawing
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-ocean-200 p-6">
          <h3 className="text-lg font-semibold text-ocean-900 mb-4">Sign Below</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">Your Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 border border-ocean-200 rounded-lg text-ocean-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-ocean-700 mb-1.5">Signature</label>
            <div className="border-2 border-dashed border-ocean-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-[150px] sm:h-[200px] cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <button
              onClick={clearCanvas}
              className="text-xs text-ocean-400 hover:text-ocean-600 mt-1 cursor-pointer"
            >
              Clear signature
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowSignPad(false)}
              className="px-6 py-3 border border-ocean-200 rounded-lg text-ocean-600 font-medium hover:bg-ocean-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSign}
              disabled={signing || !customerName.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
            >
              {signing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing...
                </>
              ) : (
                "Confirm & Sign"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawingDetails({ drawing }: { drawing: ApprovalDrawing }) {
  const specs = [
    { label: "Overall Width", value: `${drawing.overall_width}"` },
    { label: "Overall Height", value: `${drawing.overall_height}"` },
    { label: "Panel Count", value: String(drawing.panel_count) },
    { label: "Slide Direction", value: drawing.slide_direction },
    { label: "In-Swing", value: drawing.in_swing },
    { label: "System Type", value: drawing.system_type || "—" },
  ];

  return (
    <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider">
        Approval Drawing Specifications
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {specs.map(({ label, value }) => (
          <div key={label} className="bg-ocean-50 rounded-lg p-3">
            <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">{label}</span>
            <p className="text-ocean-900 font-medium text-sm capitalize">{value}</p>
          </div>
        ))}
      </div>
      {drawing.configuration && (
        <div className="mt-4 bg-ocean-50 rounded-lg p-3">
          <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">Configuration</span>
          <p className="text-ocean-900 font-medium text-sm">{drawing.configuration}</p>
        </div>
      )}
      {drawing.additional_notes && (
        <div className="mt-4 bg-ocean-50 rounded-lg p-3">
          <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">Notes</span>
          <p className="text-ocean-900 text-sm">{drawing.additional_notes}</p>
        </div>
      )}
    </div>
  );
}
