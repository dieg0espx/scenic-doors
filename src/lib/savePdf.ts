/**
 * Mobile-safe PDF save.
 *
 * Mobile: uses navigator.share() (native share sheet — save to Files, AirDrop, etc.)
 * Desktop: uses anchor + download attribute
 * Fallback: jsPDF's built-in save
 */
export async function savePdf(
  doc: { save: (name: string) => void; output: (type: "blob") => Blob },
  filename: string
) {
  try {
    const blob = doc.output("blob");

    // Mobile: try native share sheet (iOS Safari + Chrome Android)
    const file = new File([blob], filename, { type: "application/pdf" });
    if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename });
        return;
      } catch (e) {
        // User cancelled share — that's fine
        if (e instanceof Error && e.name === "AbortError") return;
        // Other error — fall through to anchor download
      }
    }

    // Desktop / fallback: anchor + download
    const url = URL.createObjectURL(blob);
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
    doc.save(filename);
  }
}
