import * as React from 'react';
import { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { Button } from '../ui/button';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  width?: number; // Prop para largura
  height?: number; // Prop para altura
  label?: string; // Nova prop para o texto do label
}

export function FileUpload({
  onFileSelect,
  width = 446, // Valor padrão para width
  height = 337, // Valor padrão para height
  label = 'Foto' // Valor padrão para o label
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
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
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-[#6B4A37] font-nunito  text-[20px]">{label}</label>{' '}
      {}
      <div
        className={`flex flex-col items-center justify-center border-2 ${dragging ? 'border-blue-500' : 'border-gray-300'} border-dashed rounded-lg p-4 text-center cursor-pointer`}
        style={{ width: `${width}px`, height: `${height}px` }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <CloudUpload size={40} className="text-gray-500" />
          <p className="text-gray-600 text-[13px] font-nunito text-sm">
            Select a file or drag and drop here
          </p>
          <p className="text-gray-400 text-[12px] text-xs font-nunito">
            JPG, PNG or PDF. Please no more than 10MB
          </p>
          <Button
            className="mt-3 border-[#0F91D2] text-[#0F91D2] bg-white font-nunito hover:bg-[#0F91D2] hover:text-white"
            variant="outline"
          >
            SELECT FILE
          </Button>
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, application/pdf"
        />
      </div>
    </div>
  );
}
