/**
 * Mobile-safe PDF download.
 * Uses anchor+download for most browsers (works on desktop & Chrome Android).
 * Falls back to window.open only for iOS Safari where a.click() from async
 * code breaks the user-gesture chain.
 */
export function savePdf(
  doc: { save: (name: string) => void; output: (type: "blob") => Blob },
  filename: string
) {
  try {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // iOS Safari blocks a.click() from async code — use window.open instead
      window.open(url, "_blank");
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
