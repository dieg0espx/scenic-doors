"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  Loader2,
  Paperclip,
  X,
} from "lucide-react";
import { addQuoteDocument, deleteQuoteDocument } from "@/lib/actions/quote-documents";
import type { QuoteDocument } from "@/lib/types";

interface Props {
  quoteId: string;
  initialDocuments: QuoteDocument[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType === "application/pdf") return FileText;
  return File;
}

function getFileColor(fileType: string) {
  if (fileType.startsWith("image/")) return { icon: "text-sky-400", bg: "bg-sky-500/10" };
  if (fileType === "application/pdf") return { icon: "text-red-400", bg: "bg-red-500/10" };
  return { icon: "text-white/40", bg: "bg-white/[0.04]" };
}

export default function DocumentUploader({ quoteId, initialDocuments }: Props) {
  const [documents, setDocuments] = useState<QuoteDocument[]>(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    try {
      for (const file of fileArray) {
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload-document", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
        const { url, fileType } = await res.json();

        // Save to database
        const doc = await addQuoteDocument({
          quote_id: quoteId,
          file_url: url,
          file_name: file.name,
          file_type: fileType || file.type,
          file_size: file.size,
          uploaded_by: "admin",
        });

        setDocuments((prev) => [doc, ...prev]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm("Delete this document?")) return;
    setDeleting(docId);
    try {
      await deleteQuoteDocument(docId, quoteId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          dragOver
            ? "border-violet-500/40 bg-violet-500/[0.06]"
            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.03]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            <p className="text-white/40 text-xs font-medium">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-white/20" />
            <p className="text-white/40 text-xs font-medium">
              Drop files here or <span className="text-violet-400">browse</span>
            </p>
            <p className="text-white/15 text-[10px]">PDF, Images, Documents up to 25MB</p>
          </>
        )}
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-1.5">
          {documents.map((doc) => {
            const Icon = getFileIcon(doc.file_type);
            const color = getFileColor(doc.file_type);
            const isDeleting = deleting === doc.id;

            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] group hover:bg-white/[0.04] transition-all"
              >
                <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${color.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 text-sm font-medium truncate block hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {doc.file_name}
                  </a>
                  <p className="text-white/20 text-[10px]">
                    {formatFileSize(doc.file_size)} &middot;{" "}
                    {new Date(doc.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                  disabled={isDeleting}
                  className="shrink-0 p-1.5 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {documents.length === 0 && !uploading && (
        <p className="text-white/15 text-xs text-center py-1">No documents uploaded yet</p>
      )}
    </div>
  );
}
