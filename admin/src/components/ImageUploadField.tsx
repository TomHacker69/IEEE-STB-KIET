'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  helperText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  folder = 'general',
  accept = 'image/*',
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const url = await api.upload(file, folder);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const isPdf = value?.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>

      {value ? (
        <div className="relative inline-block neu-card-sm rounded-2xl p-2.5 border border-white/70">
          {isPdf ? (
            <div className="flex items-center gap-3 p-3 neu-inset rounded-xl">
              <FileText className="w-8 h-8 text-red-500 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 block truncate max-w-[200px]">
                  Document File Uploaded
                </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ieee-blue font-bold hover:underline"
                >
                  View Document
                </a>
              </div>
            </div>
          ) : (
            <div className="relative group w-36 h-28 rounded-xl overflow-hidden neu-inset p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            </div>
          )}

          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 neu-inset rounded-2xl cursor-pointer hover:shadow-[inset_4px_4px_8px_#c4d0e0,inset_-4px_-4px_8px_#ffffff] transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-ieee-blue animate-spin" />
                <span className="text-xs font-semibold text-slate-500">Uploading to Cloudinary...</span>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 mb-2 text-ieee-blue" />
                <p className="mb-1 text-xs text-slate-700 font-bold">Click or drag file to upload</p>
                <p className="text-[11px] text-slate-400 font-medium">JPG, PNG, WEBP, or PDF</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {helperText && <p className="text-[11px] text-slate-500 font-medium">{helperText}</p>}
      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
    </div>
  );
};
