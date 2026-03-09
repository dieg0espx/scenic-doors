/**
 * Mobile-safe PDF download.
 * Uses anchor+download for desktop, window.open for mobile (iOS Safari
 * breaks a.click() from async code due to user-gesture chain).
 */
export function savePdf(
  doc: { save: (name: string) => void; output: (type: "blob") => Blob },
  filename: string
) {
  try {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // window.open works reliably on iOS Safari from async code
      window.open(url, "_blank");
      // Revoke after a delay to let the new tab load
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } else {
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
    doc.save(filename);
  }
}
