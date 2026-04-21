'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface PhotoUploadProps {
  onImageSelect: (base64: string, mediaType: 'image/jpeg' | 'image/png' | 'image/webp') => void;
}

export function PhotoUpload({ onImageSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="アップロードした味噌の写真" className="max-h-64 mx-auto rounded" />
        ) : (
          <div>
            <div className="text-4xl mb-3">📷</div>
            <p className="text-muted-foreground">
              {isDragActive ? 'ここにドロップ' : '写真をドラッグ&ドロップ、またはクリックして選択'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP 対応</p>
          </div>
        )}
      </div>
      {preview && (
        <button
          type="button"
          onClick={() => setPreview(null)}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground"
        >
          写真を変更
        </button>
      )}
    </div>
  );
}
