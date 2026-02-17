"use client";

export default function PrintButton() {
  return (
    <button
      className="print-btn no-print"
      onClick={() => window.print()}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "8px 16px",
        background: "#6d28d9",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
      }}
    >
      Print / Save PDF
    </button>
  );
}
