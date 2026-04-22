'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

interface PhotoUploadProps {
  onImageSelect: (base64: string, mediaType: 'image/jpeg' | 'image/png' | 'image/webp') => void;
  onClear?: () => void;
}

export function PhotoUpload({ onImageSelect, onClear }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(',')[1];
        const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp';
        setPreview(dataUrl);
        onImageSelect(base64, mediaType);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          position: 'relative',
          padding: preview ? '0' : '3.5rem 2rem',
          background: isDragging ? 'hsl(30, 40%, 8%)' : 'hsl(25, 35%, 6%)',
          border: `1px dashed ${isDragging ? 'hsl(30, 68%, 55%)' : 'hsl(25, 25%, 22%)'}`,
          cursor: 'pointer',
          transition: 'background 0.2s, border-color 0.2s',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <input
          {...getInputProps()}
          aria-label="味噌の写真をアップロード"
          aria-describedby="photo-upload-hint"
        />

        {preview ? (
          <Image
            src={preview}
            alt="アップロードした味噌の写真"
            width={1024}
            height={1024}
            unoptimized
            style={{ display: 'block', maxHeight: '18rem', margin: '0 auto', objectFit: 'contain', width: 'auto' }}
          />
        ) : (
          <>
            {/* Crosshair finder decoration */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {/* corners */}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                <span
                  key={pos}
                  style={{
                    position: 'absolute',
                    width: '16px',
                    height: '16px',
                    borderColor: isDragging ? 'hsl(30, 68%, 55%)' : 'hsl(25, 30%, 30%)',
                    borderStyle: 'solid',
                    borderWidth: 0,
                    ...(pos === 'top-left'
                      ? { top: 12, left: 12, borderTopWidth: 1, borderLeftWidth: 1 }
                      : pos === 'top-right'
                      ? { top: 12, right: 12, borderTopWidth: 1, borderRightWidth: 1 }
                      : pos === 'bottom-left'
                      ? { bottom: 12, left: 12, borderBottomWidth: 1, borderLeftWidth: 1 }
                      : { bottom: 12, right: 12, borderBottomWidth: 1, borderRightWidth: 1 }),
                    transition: 'border-color 0.2s',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: isDragging ? 'hsl(30, 68%, 55%)' : 'hsl(35, 15%, 42%)',
                marginBottom: '0.75rem',
                transition: 'color 0.2s',
              }}
            >
              {isDragging ? 'Drop to scan' : 'Scan / 解析'}
            </div>

            <div
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1rem',
                color: isDragging ? 'hsl(35, 20%, 75%)' : 'hsl(35, 15%, 50%)',
                marginBottom: '0.5rem',
                transition: 'color 0.2s',
              }}
            >
              {isDragging
                ? 'ここにドロップ'
                : '写真をドラッグ&ドロップ、またはクリックして選択'}
            </div>

            <div
              id="photo-upload-hint"
              style={{
                fontFamily: 'var(--font-lora), serif',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                color: 'hsl(35, 15%, 48%)',
              }}
            >
              JPEG · PNG · WebP
            </div>
          </>
        )}
      </div>

      {preview && (
        <button
          type="button"
          onClick={() => { setPreview(null); onClear?.(); }}
          style={{
            marginTop: '0.75rem',
            fontFamily: 'var(--font-lora), serif',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'hsl(35, 15%, 42%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'hsl(30, 68%, 55%)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'hsl(35, 15%, 42%)')}
        >
          写真を変更 →
        </button>
      )}
    </div>
  );
}
