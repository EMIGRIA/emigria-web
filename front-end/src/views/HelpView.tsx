import React from 'react';
import { PhoneCall, ShieldAlert, ShieldCheck, ChevronRight } from 'lucide-react';

export const HelpView: React.FC = () => (
    <div className="animate-in fade-in duration-500 w-full max-w-4xl mx-auto pt-6 pb-12 relative z-10">
        <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Pusat Bantuan Darurat</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Kontak resmi lembaga pemerintah yang dapat dihubungi kapan saja.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-red-600 dark:bg-red-700 rounded-2xl p-8 shadow-md text-white relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                    <PhoneCall className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                    <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-5">
                        <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-extrabold text-2xl mb-3">Kondisi Darurat?</h3>
                    <p className="text-red-50 mb-8 text-base leading-relaxed max-w-sm">
                        Jika Anda disekap atau menghadapi kekerasan fisik oleh agen ilegal, segera hubungi pihak kepolisian.
                    </p>
                    <button onClick={() => window.open('tel:110')} className="w-full sm:w-auto px-8 py-4 bg-white text-red-600 font-extrabold rounded-xl shadow-lg hover:bg-slate-50 active:scale-95 transition-all text-lg inline-flex items-center justify-center gap-2">
                        <PhoneCall className="w-5 h-5" /> Hubungi Polisi (110)
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 flex flex-col justify-center">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" /> BP2MI Resmi
                </h3>
                <div className="space-y-4">
                    <a href="tel:08001000" className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-blue-600 dark:text-blue-400"><PhoneCall className="w-6 h-6" /></div>
                            <div>
                                <p className="font-bold text-base text-slate-900 dark:text-white">Call Center Pengaduan</p>
                                <p className="text-sm text-slate-500">Layanan Bebas Pulsa (24 Jam)</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </a>
                </div>
            </div>
        </div>
    </div>
);