"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { addQuotePhoto, deleteQuotePhoto } from "@/lib/actions/quote-photos";
import type { QuotePhoto } from "@/lib/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PER_CATEGORY = 10;

interface PortalPhotosProps {
  quoteId: string;
  photos: QuotePhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<QuotePhoto[]>>;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: "uploading" | "saving" | "done" | "error";
  error?: string;
}

export default function PortalPhotos({ quoteId, photos, setPhotos }: PortalPhotosProps) {
  const interiorPhotos = photos.filter((p) => p.photo_type === "interior");
  const exteriorPhotos = photos.filter((p) => p.photo_type === "exterior");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-ocean-200 p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ocean-900 mb-1 uppercase tracking-wider flex items-center gap-2">
          <Camera className="w-4 h-4" /> Site Photos
        </h3>
        <p className="text-xs text-ocean-400 mb-6">
          Upload photos of the installation site to help our team plan your project. This step is optional.
        </p>

        <PhotoSection
          label="Interior"
          type="interior"
          photos={interiorPhotos}
          quoteId={quoteId}
          setPhotos={setPhotos}
        />

        <div className="border-t border-ocean-100 my-6" />

        <PhotoSection
          label="Exterior"
          type="exterior"
          photos={exteriorPhotos}
          quoteId={quoteId}
          setPhotos={setPhotos}
        />
      </div>
    </div>
  );
}

/* ─── Section (Interior / Exterior) ─── */

interface PhotoSectionProps {
  label: string;
  type: "interior" | "exterior";
  photos: QuotePhoto[];
  quoteId: string;
  setPhotos: React.Dispatch<React.SetStateAction<QuotePhoto[]>>;
}

function PhotoSection({ label, type, photos, quoteId, setPhotos }: PhotoSectionProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const atLimit = photos.length >= MAX_PER_CATEGORY;

  /* ── Upload handler ── */
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const available = MAX_PER_CATEGORY - photos.length;
      const batch = fileArray.slice(0, available);

      for (const file of batch) {
        const uid = crypto.randomUUID();

        // Client-side validation
        if (!ALLOWED_TYPES.includes(file.type)) {
          setUploading((prev) => [
            ...prev,
            { id: uid, name: file.name, progress: "error", error: "Invalid file type" },
          ]);
          continue;
        }
        if (file.size > MAX_SIZE) {
          setUploading((prev) => [
            ...prev,
            { id: uid, name: file.name, progress: "error", error: "File exceeds 10 MB" },
          ]);
          continue;
        }

        setUploading((prev) => [...prev, { id: uid, name: file.name, progress: "uploading" }]);

        try {
          // 1. Upload to Cloudinary
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
          if (!res.ok) {
            const body = await res.json().catch(() => ({ error: "Upload failed" }));
            throw new Error(body.error || "Upload failed");
          }
          const { url } = await res.json();

          // 2. Persist to DB
          setUploading((prev) =>
            prev.map((u) => (u.id === uid ? { ...u, progress: "saving" } : u))
          );
          const saved = await addQuotePhoto({
            quote_id: quoteId,
            photo_url: url,
            photo_type: type,
          });

          setPhotos((prev) => [saved, ...prev]);
          setUploading((prev) =>
            prev.map((u) => (u.id === uid ? { ...u, progress: "done" } : u))
          );
        } catch (err) {
          setUploading((prev) =>
            prev.map((u) =>
              u.id === uid
                ? { ...u, progress: "error", error: err instanceof Error ? err.message : "Upload failed" }
                : u
            )
          );
        }
      }

      // Clean up completed items after a short delay
      setTimeout(() => {
        setUploading((prev) => prev.filter((u) => u.progress !== "done"));
      }, 1500);
    },
    [photos.length, quoteId, type, setPhotos]
  );

  /* ── Delete handler ── */
  const handleDelete = useCallback(
    async (photoId: string) => {
      try {
        await deleteQuotePhoto(photoId, quoteId);
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      } catch {
        // silently fail — photo will remain visible
      }
    },
    [quoteId, setPhotos]
  );

  /* ── Drag & Drop ── */
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!atLimit) setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!atLimit && e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <p className="text-xs text-ocean-400 uppercase tracking-wider font-medium mb-3">
        {label} ({photos.length}/{MAX_PER_CATEGORY})
      </p>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-ocean-200"
            >
              <Image
                src={photo.photo_url}
                alt={photo.caption || label}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
                  <p className="text-white text-xs truncate">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {!atLimit && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-primary-400 bg-primary-50"
              : "border-ocean-200 hover:border-primary-300 hover:bg-ocean-50"
          }`}
        >
          <Upload className="w-6 h-6 text-ocean-300 mx-auto mb-2" />
          <p className="text-sm text-ocean-500">
            Drag &amp; drop or <span className="text-primary-500 font-medium">browse</span>
          </p>
          <p className="text-xs text-ocean-400 mt-1">JPEG, PNG, WebP, or AVIF — max 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploading.map((u) => (
            <div key={u.id} className="flex items-center gap-2 text-xs">
              {u.progress === "error" ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              ) : u.progress === "done" ? (
                <span className="text-green-500 font-bold flex-shrink-0">✓</span>
              ) : (
                <Loader2 className="w-3.5 h-3.5 text-primary-500 animate-spin flex-shrink-0" />
              )}
              <span className="text-ocean-600 truncate">{u.name}</span>
              {u.progress === "uploading" && (
                <span className="text-ocean-400 ml-auto flex-shrink-0">Uploading…</span>
              )}
              {u.progress === "saving" && (
                <span className="text-ocean-400 ml-auto flex-shrink-0">Saving…</span>
              )}
              {u.progress === "error" && (
                <span className="text-red-500 ml-auto flex-shrink-0">{u.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
