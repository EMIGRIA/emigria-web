import React from 'react';
import { ShieldAlert, Sun, Moon, Search, History, BookOpen, PhoneCall } from 'lucide-react';
import type { TabType } from '../types/index';

interface HeaderProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isDarkMode, toggleTheme }) => (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scanner')}>
                <div className="bg-blue-600 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-sm flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">Emigria.</h1>
                    <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mt-0.5">Keamanan PMI</p>
                </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
                {[
                    { id: 'scanner', label: 'Verifikasi Loker' },
                    { id: 'history', label: 'Riwayat' },
                    { id: 'edu', label: 'Pusat Edukasi' },
                    { id: 'help', label: 'Bantuan' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    </header>
);

interface BottomNavProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => (
    <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
        <div className="flex justify-around p-2">
            {[
                { id: 'scanner', label: 'Verifikasi', icon: Search },
                { id: 'history', label: 'Riwayat', icon: History },
                { id: 'edu', label: 'Edukasi', icon: BookOpen },
                { id: 'help', label: 'Bantuan', icon: PhoneCall }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex flex-col items-center p-2 min-w-[4.5rem] rounded-xl transition-all ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                    <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'fill-blue-100 dark:fill-blue-900/50' : ''}`} />
                    <span className="text-[10px] font-bold">{tab.label}</span>
                </button>
            ))}
        </div>
    </nav>
);