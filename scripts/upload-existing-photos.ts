import { readdirSync } from 'fs';
import { resolve } from 'path';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

const PEOPLE_DIR = resolve(__dirname, '../public/assets/people');
const FOLDER = 'sp-website/people';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|gif)$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadAll() {
  const files = readdirSync(PEOPLE_DIR).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
  console.log(`Found ${files.length} images to upload\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = resolve(PEOPLE_DIR, file);
    const publicId = slugify(file);
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const crypto = await import('crypto');
    const toSign = `folder=${FOLDER}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    process.stdout.write(`[${i + 1}/${files.length}] Uploading ${file}... `);

    try {
      const formData = new FormData();
      const fileBuffer = await Bun.file(filePath).arrayBuffer();
      formData.append('file', new Blob([fileBuffer]), file);
      formData.append('folder', FOLDER);
      formData.append('public_id', publicId);
      formData.append('overwrite', 'true');
      formData.append('timestamp', timestamp);
      formData.append('api_key', API_KEY);
      formData.append('signature', signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || JSON.stringify(result));
      console.log(`✓ ${result.secure_url}`);
      success++;
    } catch (err: any) {
      console.log(`✗ ${err.message || JSON.stringify(err)}`);
      failed++;
    }

    await sleep(300);
  }

  console.log(`\nDone! ${success} succeeded, ${failed} failed`);
}

uploadAll().catch(console.error);
