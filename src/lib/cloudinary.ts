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

export default cloudinary;
