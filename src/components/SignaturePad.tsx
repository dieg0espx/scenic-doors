"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Eraser, PenLine } from "lucide-react";

interface SignaturePadProps {
  onSignature: (dataUrl: string) => void;
}

export default function SignaturePad({ onSignature }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  const getCoordinates = useCallback(
    (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) return null;
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw signature guide line at ~75% height
    ctx.beginPath();
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    const guideY = rect.height * 0.75;
    ctx.moveTo(rect.width * 0.1, guideY);
    ctx.lineTo(rect.width * 0.9, guideY);
    ctx.stroke();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function startDraw(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      const coords = getCoordinates(e);
      if (!coords) return;

      setIsDrawing(true);
      ctx!.beginPath();
      ctx!.moveTo(coords.x / (window.devicePixelRatio || 1), coords.y / (window.devicePixelRatio || 1));
    }

    function draw(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      if (!isDrawing) return;
      const coords = getCoordinates(e);
      if (!coords) return;

      const isTouch = "touches" in e;
      ctx!.lineWidth = isTouch ? 3 : 2;
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      ctx!.strokeStyle = "#1a1a1a";
      ctx!.lineTo(coords.x / (window.devicePixelRatio || 1), coords.y / (window.devicePixelRatio || 1));
      ctx!.stroke();
      setHasDrawn(true);
    }

    function endDraw() {
      if (isDrawing) {
        setIsDrawing(false);
        const dataUrl = canvas!.toDataURL("image/png");
        onSignature(dataUrl);
      }
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", endDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);
    };
  }, [isDrawing, getCoordinates, onSignature]);

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw guide line
    ctx.beginPath();
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    const guideY = rect.height * 0.75;
    ctx.moveTo(rect.width * 0.1, guideY);
    ctx.lineTo(rect.width * 0.9, guideY);
    ctx.stroke();

    setHasDrawn(false);
    onSignature("");
  }

  return (
    <div>
      <div className="rounded-xl border-2 border-dashed border-white/[0.12] overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-52 sm:h-44 cursor-crosshair"
          style={{ touchAction: "none" }}
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="text-[13px] text-white/30 flex items-center gap-1.5">
          {hasDrawn ? (
            <>
              <PenLine className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400/80">Signature captured</span>
            </>
          ) : (
            <>
              <PenLine className="w-3.5 h-3.5" />
              {isTouchDevice ? "Use your finger to sign above" : "Draw your signature above"}
            </>
          )}
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1.5 text-[13px] text-white/30 hover:text-white/60 transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
}
