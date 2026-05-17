import { useState, useEffect } from 'react';
import { Header, BottomNav } from './components/Navigation';
import { ScannerView } from './views/ScannerView';
import { HistoryView } from './views/HistoryView';
import { EduView } from './views/EduView';
import { HelpView } from './views/HelpView';
import type { TabType, HistoryItem } from './types/index';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const saved = localStorage.getItem('emigria_history_v4');
    if (saved) {
      try {
        setHistoryData(JSON.parse(saved) as HistoryItem[]);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <main className="px-4 py-6 max-w-6xl mx-auto pb-24 md:pb-12">
        {activeTab === 'scanner' && (
          <ScannerView
            historyData={historyData}
            setHistoryData={setHistoryData}
            isDarkMode={isDarkMode}
          />
        )}
        {activeTab === 'history' && (
          <HistoryView
            historyData={historyData}
            setHistoryData={setHistoryData}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'edu' && <EduView />}
        {activeTab === 'help' && <HelpView />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}