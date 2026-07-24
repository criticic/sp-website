'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaSpinner, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

type Props = {
  name: string;
  defaultValue?: string;
};

export default function ImageUploader({ name, defaultValue }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState(defaultValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = imageUrl;
    }
  }, [imageUrl]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPreview(data.url);
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function clearImage() {
    setPreview(null);
    setImageUrl('');
  }

  return (
    <div>
      <label className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Photo</label>
      <input type="hidden" name={name} ref={inputRef} defaultValue={defaultValue || ''} />

      {preview ? (
        <div className="relative inline-block">
          <Image src={preview} alt="Preview" width={120} height={120} className="object-cover w-28 h-28 border border-slate/10" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 shadow hover:bg-red-600 transition-colors"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-36 h-36 border border-dashed border-slate/30 cursor-pointer hover:border-gold transition-colors bg-white">
          {uploading ? (
            <FaSpinner className="w-8 h-8 text-slate/40 animate-spin" />
          ) : (
            <>
              <FaCloudUploadAlt className="w-8 h-8 text-slate/40 mb-1" />
              <span className="text-xs text-slate/60 font-body">Click to upload</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {error && <p className="text-red-400 text-xs mt-1 font-mono">{error}</p>}
    </div>
  );
}
