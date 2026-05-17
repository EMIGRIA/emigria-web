import React from 'react';
import { BookOpen, Banknote, FileText, Loader2, AlertOctagon } from 'lucide-react';

export const EduView: React.FC = () => (
    <div className="animate-in fade-in duration-500 w-full max-w-4xl mx-auto pt-6 pb-12 relative z-10">
        <div className="mb-10 flex flex-col items-center text-center gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-2">
                <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Pusat Edukasi</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Pahami pola penipuan agen ilegal agar tidak menjadi korban.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
                {
                    title: "Gaji Terlalu Fantastis (Overpaid)",
                    desc: "Waspada jika ditawarkan gaji belasan hingga puluhan juta untuk sektor non-formal tanpa syarat keahlian khusus. Ini adalah taktik umpan klasik.",
                    icon: <Banknote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
                    color: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30"
                },
                {
                    title: "Penggunaan Visa Turis/Ziarah",
                    desc: "Agen resmi selalu mengurus Visa Kerja (Work Permit) sebelum keberangkatan. Jika disuruh pakai visa turis, itu adalah ilegal.",
                    icon: <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                    color: "bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30"
                },
                {
                    title: "Proses Instan (Bypass Prosedur)",
                    desc: "Keberangkatan resmi butuh waktu berminggu-minggu untuk proses pelatihan (BLK) dan BP2MI. Jangan percaya janji instan.",
                    icon: <Loader2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
                    color: "bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/30"
                },
                {
                    title: "Transfer ke Rekening Pribadi",
                    desc: "Perusahaan Penempatan Resmi (P3MI) tidak akan meminta transfer biaya pendaftaran ke rekening atas nama perorangan.",
                    icon: <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400" />,
                    color: "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800/30"
                }
            ].map((tip, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 items-start transition-shadow hover:shadow-md">
                    <div className={`p-4 rounded-xl shrink-0 border ${tip.color}`}>
                        {tip.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{tip.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);