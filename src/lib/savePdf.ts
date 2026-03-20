/**
 * Mobile-safe PDF save.
 *
 * Mobile: uses navigator.share() (native share sheet — save to Files, AirDrop, etc.)
 * Desktop: uses anchor + download attribute
 * Fallback: open PDF in new tab so the user can save manually
 */
export async function savePdf(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: { save: (name: string) => any; output: (type: "blob") => Blob },
  filename: string
) {
  const blob = doc.output("blob");

  // Mobile only: try native share sheet (iOS Safari + Chrome Android)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    try {
      const file = new File([blob], filename, { type: "application/pdf" });
      if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return;
        }
      }
    } catch {
      // File constructor or canShare not supported — fall through
    }
  }

  // Desktop / fallback: anchor + download
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  } catch {
    // If anchor download fails (e.g. popup blockers), open in new tab
    window.open(url, "_blank");
  }
}
