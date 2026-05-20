import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";

interface ImageDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function ImageDropzone({ onFileSelect, selectedFile }: ImageDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const setFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] group ${
        isDragActive
          ? "border-brand-green bg-brand-surface/50"
          : selectedFile
          ? "border-brand-green bg-brand-surface/20"
          : "border-border-main hover:border-brand-green hover:bg-brand-surface"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative flex flex-col items-center space-y-3">
          <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-border-main shadow-md">
            <img src={previewUrl} alt="Preview lowongan" className="w-full h-full object-cover" />
            <button
              onClick={handleClear}
              className="absolute top-1 right-1 bg-brand-surface border border-border-main hover:bg-risk-critical hover:text-white rounded-full p-1 text-text-main shadow transition-all cursor-pointer flex items-center justify-center w-5 h-5 text-[10px]"
              title="Hapus gambar"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-text-sub truncate max-w-[200px]">
            {selectedFile?.name}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          <UploadCloud className="w-10 h-10 text-text-sub/50 group-hover:text-brand-green group-hover:scale-110 transition-all duration-300" />
          <div>
            <p className="font-sans font-medium text-sm text-text-main">
              Seret & lepas foto brosur lowongan
            </p>
            <p className="font-sans text-xs text-text-sub/60 mt-1">
              atau klik untuk memilih dari galeri
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
