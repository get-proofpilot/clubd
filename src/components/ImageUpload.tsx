'use client';

import { useState, useCallback, useRef } from 'react';
import { Camera, X, Plus, Loader2, ImageIcon } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';

interface UploadedImage {
  url: string;
  key: string;
}

interface ImageUploadProps {
  /** Currently uploaded image URLs */
  images: UploadedImage[];
  /** Called when images change (add/remove) */
  onChange: (images: UploadedImage[]) => void;
  /** Max number of images allowed */
  maxImages?: number;
  /** Show as a single cover image uploader vs multi-image gallery */
  variant?: 'cover' | 'gallery';
  /** Custom class for the container */
  className?: string;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  variant = 'cover',
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing('eventImage', {
    onUploadProgress: (p) => setUploadProgress(p),
    onClientUploadComplete: (res) => {
      if (res) {
        const newImages = res.map((r) => ({ url: r.ufsUrl, key: r.key }));
        onChange([...images, ...newImages].slice(0, maxImages));
      }
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadError: () => {
      setIsUploading(false);
      setUploadProgress(0);
    },
  });

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxImages - images.length;
      if (remaining <= 0) return;
      const toUpload = fileArray.slice(0, remaining);
      setIsUploading(true);
      await startUpload(toUpload);
    },
    [images.length, maxImages, startUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    (index: number) => {
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange],
  );

  if (variant === 'cover') {
    const coverImage = images[0];

    return (
      <div className={className}>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] transition-colors hover:border-[var(--color-primary)]"
        >
          {coverImage ? (
            <>
              <img
                src={coverImage.url}
                alt="Cover"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
                <span className="text-sm font-medium text-white">Change image</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(0);
                }}
                className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={14} />
              </button>
            </>
          ) : isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" strokeWidth={1.8} />
              <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Uploading... {uploadProgress}%
              </p>
            </>
          ) : (
            <>
              <Camera className="h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.8} />
              <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">Add cover image</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Tap or drag & drop</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
    );
  }

  // Gallery variant
  return (
    <div className={className}>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scroll">
        {images.map((img, i) => (
          <div key={img.key} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)]">
            <img src={img.url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-24 w-24 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Plus size={20} />
                <span className="mt-1 text-[10px] font-medium">Add</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
