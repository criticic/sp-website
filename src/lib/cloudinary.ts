import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PEOPLE_FOLDER = 'sp-website/people';

export async function uploadImage(
  file: string | Buffer,
  publicId?: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder: PEOPLE_FOLDER,
    public_id: publicId,
    overwrite: true,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
  return result.secure_url;
}

export async function uploadExistingImage(
  localPath: string,
  memberName: string
): Promise<string> {
  return uploadImage(localPath, slugify(memberName));
}

export function getOptimizedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
}

export function getCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+?)\.(jpg|jpeg|png|gif|webp)/);
  return match ? match[1] : null;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|gif)$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export { PEOPLE_FOLDER };
