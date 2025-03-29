'use client';
import * as React from 'react';
import { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { Button } from '../ui/button';

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  width?: number | string;
  height?: number;
  label?: string;
  initialImage?: string | null;
}

export function FileUpload({
  onFileSelect,
  width = 446,
  height = 337,
  label = 'Foto',
  initialImage = null
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        onFileSelect(file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onFileSelect(null);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-[#6B4A37] font-nunito text-[20px]">
          {label}
        </label>
      )}
      <div
        className={`relative flex flex-col items-center justify-center border-2 ${
          dragging ? 'border-blue-500' : 'border-gray-300'
        } border-dashed rounded-lg p-4 text-center cursor-pointer`}
        style={{ width: `${width}px`, height: `${height}px` }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-full object-cover rounded-md"
            />
            <Button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
              size="sm"
              onClick={handleRemove}
            >
              Remover
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <CloudUpload size={40} className="text-black" />
            <p className="text-black text-[13px] font-nunito text-sm">
              Select a file or drag and drop here
            </p>
            <p className="text-black text-[12px] text-xs font-nunito">
              JPG, PNG. Please no more than 10MB
            </p>
            <Button
              className="mt-3 border-[#0F91D2] text-[#0F91D2] bg-white font-nunito hover:bg-[#0F91D2] hover:text-white"
              variant="outline"
            >
              SELECT FILE
            </Button>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>
    </div>
  );
}
