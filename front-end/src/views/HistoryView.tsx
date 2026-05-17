import React from 'react';
import { History, MapPin, XCircle } from 'lucide-react';
import type { HistoryItem, TabType } from '../types/index';
import { getStatusConfig } from '../utils/helpers';

interface HistoryViewProps {
    historyData: HistoryItem[];
    setHistoryData: (data: HistoryItem[]) => void;
    setActiveTab: (tab: TabType) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ historyData, setHistoryData, setActiveTab }) => {
    const deleteHistory = (id: number) => {
        const newHistory = historyData.filter(item => item.id !== id);
        setHistoryData(newHistory);
        localStorage.setItem('emigria_history_v4', JSON.stringify(newHistory));
    };

    return (
        <div className="animate-in fade-in duration-500 w-full max-w-4xl mx-auto pt-6 pb-12 relative z-10">
            <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Riwayat Anda</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">Akses kembali hasil verifikasi loker sebelumnya.</p>
            </div>

            {historyData.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                        <History className="w-10 h-10" />
                    </div>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">Riwayat Kosong</p>
                    <button onClick={() => setActiveTab('scanner')} className="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-full hover:bg-blue-100 transition-colors">
                        Pindai Sekarang
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {historyData.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group h-full">
                            <div className="flex items-start justify-between mb-4 gap-4">
                                <div className="flex items-start gap-3 flex-1 overflow-hidden">
                                    <div className={`p-2.5 rounded-xl shrink-0 ${getStatusConfig(item.status).bg} ${getStatusConfig(item.status).text}`}>
                                        {getStatusConfig(item.status).icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{item.jobTitle || 'Posisi Tidak Dikenal'}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1 truncate"><MapPin className="w-3.5 h-3.5 shrink-0" /> {item.destination || '-'}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wide ${getStatusConfig(item.status).bg} ${getStatusConfig(item.status).text}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
                                <p className="text-xs font-medium text-slate-400">{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <button onClick={() => deleteHistory(item.id)} className="text-xs font-bold text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg">
                                    <XCircle className="w-3.5 h-3.5" /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};