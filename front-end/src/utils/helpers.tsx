import { AlertOctagon, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import type { StatusType, HistoryItem, JobAnalysisResult } from '../types/index';

export const getStatusConfig = (status: StatusType) => {
    switch (status) {
        case 'Bahaya': return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-400', bar: 'bg-red-500', icon: <AlertOctagon className="w-8 h-8 text-red-600 dark:text-red-500" /> };
        case 'Waspada': return { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', bar: 'bg-amber-500', icon: <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-500" /> };
        case 'Aman': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500', icon: <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-500" /> };
        default: return { bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300', bar: 'bg-slate-400', icon: <Search className="w-8 h-8 text-slate-500" /> };
    }
};

export const handleShareAction = (data: HistoryItem | JobAnalysisResult | null) => {
    if (!data) return;
    const text = `*Hasil Verifikasi Emigria*\n\nPosisi: ${data.jobTitle}\nTujuan: ${data.destination}\nStatus: *${data.status}* (Risiko: ${data.riskScore}/100)\n\n*Catatan Bahaya:*\n${data.redFlags.map(f => `- ${f}`).join('\n')}\n\nSelalu validasi di situs resmi BP2MI!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};