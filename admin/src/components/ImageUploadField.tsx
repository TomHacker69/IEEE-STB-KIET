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
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      {value ? (
        <div className="relative inline-block border border-slate-200 rounded-lg p-2 bg-slate-50">
          {isPdf ? (
            <div className="flex items-center gap-3 p-3 bg-white rounded border border-slate-200">
              <FileText className="w-8 h-8 text-red-500" />
              <div className="text-xs">
                <span className="font-semibold text-slate-700 block truncate max-w-[200px]">
                  Document File Uploaded
                </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ieee-blue hover:underline"
                >
                  View Document
                </a>
              </div>
            </div>
          ) : (
            <div className="relative group w-36 h-28 rounded-md overflow-hidden bg-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-ieee-blue animate-spin" />
                <span className="text-xs text-slate-500">Uploading to Cloudinary...</span>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 mb-2 text-slate-400" />
                <p className="mb-1 text-xs text-slate-600 font-medium">Click or drag file to upload</p>
                <p className="text-[11px] text-slate-400">JPG, PNG, WEBP, or PDF</p>
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

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

