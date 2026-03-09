/**
 * Mobile-safe PDF download using blob URL.
 * Falls back to jsPDF's built-in save if blob approach fails.
 */
export function savePdf(
  doc: { save: (name: string) => void; output: (type: "blob") => Blob },
  filename: string
) {
  try {
    const blob = doc.output("blob");
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
