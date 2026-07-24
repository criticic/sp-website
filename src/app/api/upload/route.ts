import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = crypto.randomUUID();

  return new Promise<Response>((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'sp-website/people',
        public_id: publicId,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          resolve(NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ url: result.secure_url, publicId: result.public_id }));
        }
      }
    );

    uploadStream.end(buffer);
  });
}
