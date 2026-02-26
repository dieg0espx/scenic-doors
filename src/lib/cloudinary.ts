import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadSignature(dataUrl: string) {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: "scenic-doors/signatures",
    resource_type: "image",
  });
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
}

interface UploadPhotoOptions {
  folder?: string;
  publicId?: string;
}

interface UploadPhotoResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadPhoto(
  buffer: Buffer,
  options: UploadPhotoOptions = {}
): Promise<UploadPhotoResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "scenic-doors/photos",
        public_id: options.publicId,
        transformation: [
          { width: 1920, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function uploadDocument(
  buffer: Buffer,
  originalName: string
): Promise<{ url: string; publicId: string; bytes: number }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "scenic-doors/documents",
        resource_type: "auto",
        public_id: originalName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_"),
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
        });
      }
    );
    stream.end(buffer);
  });
}

export default cloudinary;
