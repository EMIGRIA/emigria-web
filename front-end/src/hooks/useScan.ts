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
      toast.error(
        err.response?.data?.message ?? "Terjadi kesalahan. Periksa koneksi."
      );
    } finally {
      setLoading(false);
    }
  };

  return { scan, loading };
}
