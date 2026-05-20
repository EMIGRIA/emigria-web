import { useState } from "react";
import ImageDropzone from "./ImageDropzone";
import ScanButton from "./ScanButton";
import LoadingOverlay from "../common/LoadingOverlay";
import { useScan } from "../../hooks/useScan";
import toast from "react-hot-toast";
import { Image, FileText, Link2 } from "lucide-react";

export default function ScanInput() {
  const [activeTab, setActiveTab] = useState<"image" | "text" | "url">("image");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const { scan, loading } = useScan();

  const handleScan = () => {
    if (activeTab === "image") {
      if (!file) {
        toast.error("Silakan pilih atau jatuhkan gambar brosur terlebih dahulu.");
        return;
      }
      scan({ mode: "image", file });
    } else if (activeTab === "text") {
      if (!text.trim()) {
        toast.error("Silakan tempel teks lowongan terlebih dahulu.");
        return;
      }
      scan({ mode: "text", text });
    } else if (activeTab === "url") {
      if (!url.trim()) {
        toast.error("Silakan tempel tautan lowongan terlebih dahulu.");
        return;
      }
      scan({ mode: "url", url });
    }
  };

  const isButtonDisabled = () => {
    if (activeTab === "image") return !file;
    if (activeTab === "text") return !text.trim();
    if (activeTab === "url") return !url.trim();
    return true;
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="bg-brand-surface rounded-2xl p-6 shadow-2xl border border-border-main space-y-6">
        {/* Tab switcher */}
        <div className="flex bg-brand-deep p-1.5 rounded-xl border border-border-main">
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 font-sans text-xs font-semibold py-2 px-1 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
              activeTab === "image"
                ? "bg-brand-surface text-brand-green shadow-sm"
                : "text-text-sub hover:text-brand-green"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Foto Brosur</span>
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 font-sans text-xs font-semibold py-2 px-1 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
              activeTab === "text"
                ? "bg-brand-surface text-brand-green shadow-sm"
                : "text-text-sub hover:text-brand-green"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tempel Teks</span>
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`flex-1 font-sans text-xs font-semibold py-2 px-1 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none ${
              activeTab === "url"
                ? "bg-brand-surface text-brand-green shadow-sm"
                : "text-text-sub hover:text-brand-green"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Paste URL</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[180px] transition-all duration-300">
          {activeTab === "image" && (
            <div className="animate-[fadeInUp_0.4s_ease_both]">
              <ImageDropzone onFileSelect={setFile} selectedFile={file} />
            </div>
          )}

          {activeTab === "text" && (
            <div className="animate-[fadeInUp_0.4s_ease_both]">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tempel isi detail lowongan pekerjaan di sini (syarat, deskripsi gaji, dll)..."
                className="w-full min-h-[180px] bg-brand-deep border border-border-main rounded-xl p-4 text-sm font-sans focus:outline-none focus:border-brand-green resize-y transition-colors placeholder:text-text-sub/40 text-text-main"
              />
            </div>
          )}

          {activeTab === "url" && (
            <div className="animate-[fadeInUp_0.4s_ease_both]">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://contoh-lowongan.com/karir/123"
                className="w-full bg-brand-deep border border-border-main rounded-xl p-4 text-sm font-sans focus:outline-none focus:border-brand-green transition-colors placeholder:text-text-sub/40 text-text-main"
              />
              <p className="text-[10px] text-text-sub/60 mt-2 ml-1 font-sans">
                * Pastikan URL mengarah langsung ke laman detail lowongan pekerjaan.
              </p>
            </div>
          )}
        </div>

        {/* CTA Scan Button */}
        <ScanButton
          onClick={handleScan}
          loading={loading}
          disabled={isButtonDisabled()}
        />
      </div>
    </>
  );
}
