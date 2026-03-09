"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  Download,
  ClipboardCheck,
} from "lucide-react";
import { signApprovalDrawing, requestApprovalDrawing } from "@/lib/actions/approval-drawings";
import { generateApprovalDrawingPdf, generateMultiApprovalDrawingPdf } from "@/lib/generateApprovalDrawingPdf";
import DoorTypeAnimation from "@/components/DoorTypeAnimation";
import type { ApprovalDrawing } from "@/lib/types";

interface QuoteItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface PortalApprovalDrawingProps {
  drawing?: ApprovalDrawing | null;
  drawings?: ApprovalDrawing[];
  quoteName: string;
  quoteId: string;
  quoteColor?: string;
  quoteDoorType?: string;
  portalStage?: string;
  quoteItems?: QuoteItem[];
}

export default function PortalApprovalDrawing({ drawing: legacyDrawing, drawings = [], quoteName, quoteId, quoteColor, quoteDoorType, portalStage, quoteItems = [] }: PortalApprovalDrawingProps) {
  // Build the array of drawings — use drawings array, fall back to legacy single drawing
  const allDrawings = drawings.length > 0 ? drawings : (legacyDrawing ? [legacyDrawing] : []);
  const hasMultipleItems = quoteItems.length > 1;
  const [signing, setSigning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(portalStage === "drawing_requested");
  const [showSignPad, setShowSignPad] = useState(false);
  const [signingDrawingId, setSigningDrawingId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState(quoteName);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const hasSignatureRef = useRef(false);
  const isCanvasInitRef = useRef(false);

  function drawingToPdfInput(d: ApprovalDrawing) {
    return {
      overall_width: d.overall_width,
      overall_height: d.overall_height,
      panel_count: d.panel_count,
      slide_direction: d.slide_direction,
      in_swing: d.in_swing,
      frame_color: d.frame_color || quoteColor,
      hardware_color: d.hardware_color,
      customer_name: d.customer_name,
      signature_data: d.signature_data,
      signed_at: d.signed_at,
      system_type: d.system_type,
    };
  }

  async function handleDownloadPdf(d: ApprovalDrawing) {
    setDownloading(true);
    try {
      const doc = await generateApprovalDrawingPdf(drawingToPdfInput(d));
      doc.save(`Approval-Drawing-${quoteId.slice(0, 8)}.pdf`);
    } catch {
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDownloadAllPdf() {
    setDownloading(true);
    try {
      const doc = await generateMultiApprovalDrawingPdf(allDrawings.map(drawingToPdfInput));
      doc.save(`Approval-Drawings-${quoteId.slice(0, 8)}.pdf`);
    } catch {
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  }

  async function handleRequestDrawing() {
    setRequesting(true);
    try {
      await requestApprovalDrawing(quoteId);
      setRequested(true);
    } catch {
      alert("Failed to submit request. Please try again.");
    } finally {
      setRequesting(false);
    }
  }

  // No drawings at all
  if (allDrawings.length === 0) {
    // Drawing already requested — show waiting state
    if (requested) {
      return (
        <div className="bg-white rounded-xl border border-ocean-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-ocean-900 mb-2">Approval Drawing Requested</h3>
          <p className="text-ocean-500 text-sm max-w-md mx-auto">
            We&apos;ve received your request! Our team is preparing your approval drawing. You&apos;ll receive an email notification when it&apos;s ready for review.
          </p>
        </div>
      );
    }

    // No drawing yet, no request — show CTA to request one
    return (
      <div className="bg-white rounded-xl border border-ocean-200 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="w-7 h-7 text-primary-500" />
        </div>
        <h3 className="text-lg font-semibold text-ocean-900 mb-2">Request Approval Drawing</h3>
        <p className="text-ocean-500 text-sm max-w-md mx-auto mb-5">
          Ready to move forward? Request an approval drawing so our team can prepare a detailed diagram of your door configuration for your review and sign-off.
        </p>
        <button
          onClick={handleRequestDrawing}
          disabled={requesting}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-lg transition-colors cursor-pointer"
        >
          {requesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Requesting...
            </>
          ) : (
            <>
              <ClipboardCheck className="w-4 h-4" />
              Request Approval Drawing
            </>
          )}
        </button>
      </div>
    );
  }

  // Check if all drawings are signed
  const allSigned = allDrawings.every((d) => d.status === "signed");
  // Find the first unsigned drawing for signing
  const unsignedDrawing = allDrawings.find((d) => d.status !== "signed");

  const getCoords = useCallback((e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  // Set up canvas with proper touch handling (passive: false to prevent scrolling)
  useEffect(() => {
    if (!showSignPad) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize white background once
    if (!isCanvasInitRef.current) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      isCanvasInitRef.current = true;
    }

    ctx.strokeStyle = "#1a2634";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    function handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      const coords = getCoords(e, canvas!);
      if (!coords) return;
      ctx!.beginPath();
      ctx!.moveTo(coords.x, coords.y);
      isDrawingRef.current = true;
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      if (!isDrawingRef.current) return;
      const coords = getCoords(e, canvas!);
      if (!coords) return;
      ctx!.lineTo(coords.x, coords.y);
      ctx!.stroke();
      hasSignatureRef.current = true;
    }

    function handleTouchEnd(e: TouchEvent) {
      e.preventDefault();
      if (isDrawingRef.current && hasSignatureRef.current) {
        setSignatureData(canvas!.toDataURL("image/png"));
      }
      isDrawingRef.current = false;
    }

    function handleMouseDown(e: MouseEvent) {
      const coords = getCoords(e, canvas!);
      if (!coords) return;
      ctx!.beginPath();
      ctx!.moveTo(coords.x, coords.y);
      isDrawingRef.current = true;
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDrawingRef.current) return;
      const coords = getCoords(e, canvas!);
      if (!coords) return;
      ctx!.lineTo(coords.x, coords.y);
      ctx!.stroke();
      hasSignatureRef.current = true;
    }

    function handleMouseUp() {
      if (isDrawingRef.current && hasSignatureRef.current) {
        setSignatureData(canvas!.toDataURL("image/png"));
      }
      isDrawingRef.current = false;
    }

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [showSignPad, getCoords]);

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hasSignatureRef.current = false;
    setSignatureData(null);
  }

  async function handleSign() {
    const drawingToSign = signingDrawingId
      ? allDrawings.find((d) => d.id === signingDrawingId)
      : unsignedDrawing;
    if (!signatureData || !customerName.trim() || !drawingToSign) return;
    setSigning(true);
    try {
      await signApprovalDrawing(drawingToSign.id, customerName, signatureData);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to sign");
    } finally {
      setSigning(false);
    }
  }

  // All signed — show consolidated signed view
  if (allSigned) {
    const firstSigned = allDrawings[0];
    return (
      <div className="space-y-6">
        <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-ocean-900 mb-1">
            {allDrawings.length > 1 ? "All Approval Drawings Signed" : "Approval Drawing Signed"}
          </h3>
          <p className="text-ocean-500 text-sm">
            Signed by {firstSigned.customer_name} on{" "}
            {new Date(firstSigned.signed_at!).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <button
            onClick={handleDownloadAllPdf}
            disabled={downloading}
            className="mt-4 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download All PDFs
          </button>
        </div>
        {allDrawings.map((d, idx) => (
          <div key={d.id}>
            {hasMultipleItems && (
              <h4 className="text-sm font-semibold text-ocean-700 mb-2">
                {quoteItems[idx]?.name || `Door ${idx + 1}`}
              </h4>
            )}
            <DrawingDetails drawing={d} doorType={quoteDoorType} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 flex items-center gap-3">
        <FileText className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          Please review the approval drawing{allDrawings.length > 1 ? "s" : ""} below and sign to confirm your order specifications.
        </p>
      </div>

      {allDrawings.map((d, idx) => {
        const isSigned = d.status === "signed";
        const isSigningThis = showSignPad && signingDrawingId === d.id;

        return (
          <div key={d.id} className="space-y-4">
            {hasMultipleItems && (
              <h4 className="text-sm font-semibold text-ocean-700">
                {quoteItems[idx]?.name || `Door ${idx + 1}`}
                {isSigned && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                  </span>
                )}
              </h4>
            )}
            <DrawingDetails
              drawing={d}
              doorType={quoteDoorType}
              onDownload={() => handleDownloadPdf(d)}
              downloading={downloading}
            />

            {/* Per-drawing sign section */}
            {!isSigned && !isSigningThis && (
              <div className="bg-white rounded-xl border border-ocean-200 p-5 text-center">
                <p className="text-ocean-500 text-sm mb-3">
                  By signing, you confirm that the specifications above are correct.
                </p>
                <button
                  onClick={() => {
                    isCanvasInitRef.current = false;
                    hasSignatureRef.current = false;
                    setSignatureData(null);
                    setSigningDrawingId(d.id);
                    setShowSignPad(true);
                  }}
                  className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
                >
                  Sign Approval Drawing
                </button>
              </div>
            )}

            {isSigningThis && (
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
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-ocean-400">
                      {signatureData ? "Signature captured" : "Sign above using mouse or touch"}
                    </p>
                    <button
                      onClick={clearCanvas}
                      disabled={!signatureData}
                      className="text-xs text-ocean-400 hover:text-ocean-600 disabled:opacity-40 cursor-pointer"
                    >
                      Clear signature
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowSignPad(false); setSigningDrawingId(null); }}
                    className="px-6 py-3 border border-ocean-200 rounded-lg text-ocean-600 font-medium hover:bg-ocean-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSign}
                    disabled={signing || !customerName.trim() || !signatureData}
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
      })}
    </div>
  );
}

function DrawingDetails({ drawing, doorType, onDownload, downloading }: { drawing: ApprovalDrawing; doorType?: string; onDownload?: () => void; downloading?: boolean }) {
  const specs = [
    { label: "Overall Width", value: `${drawing.overall_width}"` },
    { label: "Overall Height", value: `${drawing.overall_height}"` },
    { label: "Panel Count", value: String(drawing.panel_count) },
    { label: "Slide Direction", value: drawing.slide_direction },
    { label: "In-Swing", value: drawing.in_swing },
    { label: "System Type", value: drawing.system_type || "—" },
  ];

  // Use the drawing's system_type for animation, fall back to quote's door_type
  const animDoorType = drawing.system_type || doorType || "";

  return (
    <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-ocean-900 mb-4 uppercase tracking-wider">
        Approval Drawing
      </h3>

      {/* Interactive Door Animation */}
      {animDoorType && (
        <div className="rounded-xl overflow-hidden border border-ocean-100 mb-1">
          <DoorTypeAnimation
            doorType={animDoorType}
            compact
            panelCount={drawing.panel_count}
            panelLayout={drawing.configuration}
          />
        </div>
      )}

      {/* Specs Grid */}
      <h4 className="text-[10px] font-semibold text-ocean-400 uppercase tracking-widest mt-5 mb-3">
        Specifications
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {specs.map(({ label, value }) => (
          <div key={label} className="bg-ocean-50 rounded-lg p-3">
            <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">{label}</span>
            <p className="text-ocean-900 font-medium text-sm capitalize">{value}</p>
          </div>
        ))}
      </div>
      {drawing.configuration && (
        <div className="mt-3 bg-ocean-50 rounded-lg p-3">
          <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">Configuration</span>
          <p className="text-ocean-900 font-medium text-sm">{drawing.configuration}</p>
        </div>
      )}
      {drawing.additional_notes && (
        <div className="mt-3 bg-ocean-50 rounded-lg p-3">
          <span className="text-[11px] text-ocean-400 uppercase tracking-wider font-medium">Notes</span>
          <p className="text-ocean-900 text-sm">{drawing.additional_notes}</p>
        </div>
      )}
      {onDownload && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-500 disabled:opacity-60 cursor-pointer"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

