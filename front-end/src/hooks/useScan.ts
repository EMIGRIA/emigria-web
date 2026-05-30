import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

interface ScanParams {
  mode: "image" | "text" | "url";
  file?: File | null;
  text?: string;
  url?: string;
}

export function useScan() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const scan = async ({ mode, file, text, url }: ScanParams) => {
    setLoading(true);
    try {
      let response;

      if (mode === "image") {
        if (!file) {
          toast.error("Silakan pilih file gambar terlebih dahulu.");
          return;
        }
        const fd = new FormData();
        fd.append("brochure", file);
        response = await api.post("/api/scan", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post(
          "/api/scan",
          mode === "text" ? { text } : { url }
        );
      }

      // Pass result via router state — no re-fetch needed
      navigate("/result", { state: { result: response.data } });
    } catch (err: any) {
      console.error(err);
      
      let errorMessage = "Terjadi kesalahan. Periksa koneksi internet Anda.";
      
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message;
        
        if (status === 429) {
          errorMessage = "Terlalu banyak permintaan, coba lagi nanti.";
        } else if (status >= 500) {
          errorMessage = "Layanan AI sedang bermasalah, silakan coba lagi nanti.";
        } else if (status === 400 || serverMessage === "Validation failed") {
          if (mode === "url") {
            errorMessage = "Format tautan (URL) tidak valid. Pastikan tautan lengkap dan benar.";
          } else if (mode === "text") {
            errorMessage = "Teks lowongan tidak valid atau terlalu pendek.";
          } else {
            errorMessage = "Format berkas brosur tidak valid atau tidak terbaca.";
          }
        } else {
          errorMessage = serverMessage ?? "Gagal menganalisis lowongan kerja.";
        }
      } else if (err.request) {
        errorMessage = "Koneksi terputus. Pastikan internet Anda aktif.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { scan, loading };
}
