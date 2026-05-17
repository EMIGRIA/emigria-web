import React, { useState, useRef, useEffect } from 'react';
import {
    FileText, UploadCloud, XCircle,
    Search, Loader2, Info, Share2
} from 'lucide-react';
import type { HistoryItem, JobAnalysisResult, InputModeType } from '../types/index';
import { getStatusConfig, handleShareAction } from '../utils/helpers';

interface ScannerViewProps {
    historyData: HistoryItem[];
    setHistoryData: (data: HistoryItem[]) => void;
    isDarkMode: boolean;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ historyData, setHistoryData }) => {
    const [inputMode, setInputMode] = useState<InputModeType>('text');
    const [textInput, setTextInput] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStep, setLoadingStep] = useState<number>(0);
    const [result, setResult] = useState<HistoryItem | null>(null);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearInput = () => {
        setTextInput('');
        setImagePreview(null);
        setImageBase64(null);
        setResult(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                setError("Ukuran gambar maksimal 4MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const resultString = reader.result as string;
                setImagePreview(resultString);
                setImageBase64(resultString.split(',')[1]);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const loadingMessages: string[] = [
        "Memeriksa dokumen rekrutmen...",
        "Mengekstrak informasi gaji & lokasi...",
        "Menganalisis anomali dan risiko...",
        "Memverifikasi dengan database keamanan...",
        "Menyusun laporan akhir..."
    ];

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (loading) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const analyzeJobOffer = async () => {
        if (inputMode === 'text' && !textInput.trim()) {
            setError("Masukkan teks loker terlebih dahulu."); return;
        }
        if (inputMode === 'image' && !imageBase64) {
            setError("Unggah brosur terlebih dahulu."); return;
        }

        setLoading(true); setError(''); setResult(null);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

        const systemPrompt = `Anda adalah 'Emigria', sistem AI ahli pendeteksi penipuan lowongan kerja luar negeri untuk PMI.
Tugas Anda menganalisis teks atau brosur lowongan kerja. Evaluasi kewajaran gaji, syarat visa, biaya agen, dan lokasi. 
KEMBALIKAN HANYA OBJEK JSON VALID.
Format:
{
  "status": "Aman" | "Waspada" | "Bahaya",
  "riskScore": number (0-100),
  "jobTitle": "Nama Pekerjaan",
  "destination": "Negara Tujuan",
  "salary": "Estimasi Gaji",
  "redFlags": ["alasan anomali 1", "alasan anomali 2"],
  "geographicRisk": "Analisis singkat risiko negara tujuan",
  "recommendation": "Saran tindakan konkrit"
}`;

        const userPayload = inputMode === 'text'
            ? { text: `Teks Lowongan: ${textInput}` }
            : { text: "Analisis gambar brosur ini.", inlineData: { mimeType: "image/jpeg", data: imageBase64 } };

        const payload = {
            contents: [{ role: "user", parts: inputMode === 'text' ? [userPayload] : [{ text: userPayload.text }, { inlineData: userPayload.inlineData }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
        };

        try {
            if (!apiKey) {
                throw new Error("API Key belum dipasang. Aplikasi hanya berjalan dalam mode pratinjau UI.");
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Gagal terhubung ke AI.");
            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (textResponse) {
                const parsedResult = JSON.parse(textResponse) as JobAnalysisResult;
                const resultWithDate: HistoryItem = { ...parsedResult, date: new Date().toISOString(), id: Date.now() };
                setResult(resultWithDate);

                const newHistory = [resultWithDate, ...historyData].slice(0, 15);
                setHistoryData(newHistory);
                localStorage.setItem('emigria_history_v4', JSON.stringify(newHistory));
            } else throw new Error("Format respons tidak valid.");
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 w-full max-w-4xl mx-auto pb-12">
            <div className="text-center mb-10 pt-8 md:pt-12 flex flex-col items-center justify-center relative z-10">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 mb-5">
                    Keamanan Pekerja Migran
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                    Verifikasi Loker Sebelum <span className="text-blue-600 dark:text-blue-400">Berangkat.</span>
                </h1>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    Pindai dokumen penawaran kerja Anda di sini. Sistem akan mendeteksi indikasi penipuan, manipulasi gaji, dan anomali visa dalam hitungan detik.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 max-w-3xl mx-auto">
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <button onClick={() => { setInputMode('text'); clearInput(); }} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${inputMode === 'text' ? 'text-blue-600' : 'text-slate-500'}`}><FileText className="w-5 h-5" /> Salin Teks</button>
                    <button onClick={() => { setInputMode('image'); clearInput(); }} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${inputMode === 'image' ? 'text-blue-600' : 'text-slate-500'}`}><UploadCloud className="w-5 h-5" /> Unggah Brosur</button>
                </div>

                <div className="p-6">
                    {inputMode === 'text' ? (
                        <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Tempel info loker di sini..." className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none resize-none text-slate-800 dark:text-white" />
                    ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-950 min-h-[12rem] flex flex-col items-center justify-center">
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                            {imagePreview ? (
                                <div className="relative max-w-xs">
                                    <img src={imagePreview} alt="Preview" className="max-h-40 rounded shadow-md" />
                                    <button onClick={(e) => { e.stopPropagation(); clearInput(); }} className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 rounded-full p-1 shadow"><XCircle className="w-5 h-5 text-red-500" /></button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                                    <p className="text-slate-500 text-sm">Klik untuk pilih gambar loker</p>
                                </>
                            )}
                        </div>
                    )}

                    {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">{error}</div>}

                    <button onClick={analyzeJobOffer} disabled={loading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        {loading ? 'Sistem Sedang Bekerja...' : 'Verifikasi Sekarang'}
                    </button>

                    {loading && (
                        <div className="mt-4 text-center animate-pulse">
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{loadingMessages[loadingStep]}</p>
                        </div>
                    )}
                </div>
            </div>

            {result && (
                <div className="space-y-6 max-w-3xl mx-auto mt-6">
                    <div className={`p-5 rounded-2xl border flex items-center gap-4 ${getStatusConfig(result.status).bg} ${getStatusConfig(result.status).border}`}>
                        {getStatusConfig(result.status).icon}
                        <div>
                            <h2 className={`text-xl font-bold ${getStatusConfig(result.status).text}`}>Status Loker: {result.status}</h2>
                            <p className={`text-xs ${getStatusConfig(result.status).text}`}>Tingkat Risiko: {result.riskScore}/100</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold mb-3 text-sm flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> Data Hasil Ekstraksi</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-slate-400">Posisi:</span> {result.jobTitle || 'Tidak terdeteksi'}</p>
                                <p><span className="text-slate-400">Negara:</span> {result.destination || 'Tidak terdeteksi'}</p>
                                <p><span className="text-slate-400">Gaji:</span> {result.salary || 'Tidak terdeteksi'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {result.redFlags && result.redFlags.length > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-200 dark:border-red-900/30">
                                    <h3 className="font-bold text-red-800 dark:text-red-400 text-sm mb-2">Temuan Kejanggalan</h3>
                                    <ul className="text-xs text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                                        {result.redFlags.map((f, idx) => <li key={idx}>{f}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
                        <p className="text-sm">Rekomendasi: "{result.recommendation}"</p>
                        <button onClick={() => handleShareAction(result)} className="bg-[#25D366] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"><Share2 className="w-4 h-4" /> Share WA</button>
                    </div>
                </div>
            )}
        </div>
    );
};