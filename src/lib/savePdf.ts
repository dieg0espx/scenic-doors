/**
 * Mobile-safe PDF download.
 *
 * The problem: on mobile browsers, both a.click() and window.open() fail
 * when called AFTER an await (user-gesture chain is broken by async work).
 *
 * Solution: call openPdfWindow() BEFORE the await (synchronously in the click
 * handler) to preserve the gesture, then pass the window ref to savePdf()
 * which redirects it to the blob URL.
 *
 * Usage:
 *   const w = openPdfWindow();
 *   const doc = await generatePdf(...);
 *   savePdf(doc, "file.pdf", w);
 */

/** Call this synchronously inside the click handler, BEFORE any await. */
export function openPdfWindow(): Window | null {
  return window.open("", "_blank");
}

export function savePdf(
  doc: { save: (name: string) => void; output: (type: "blob") => Blob },
  filename: string,
  preOpenedWindow?: Window | null
) {
  try {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);

    if (preOpenedWindow) {
      // Redirect the pre-opened window (works on all mobile browsers)
      preOpenedWindow.location.href = url;
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } else {
      // No pre-opened window — try anchor download (works on desktop)
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
    }
  } catch {
    // If pre-opened window exists but we errored, close it
    if (preOpenedWindow) preOpenedWindow.close();
    doc.save(filename);
  }
}
