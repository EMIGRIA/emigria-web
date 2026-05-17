export type TabType = 'scanner' | 'history' | 'edu' | 'help';
export type InputModeType = 'text' | 'image';
export type StatusType = 'Aman' | 'Waspada' | 'Bahaya' | string;

export interface JobAnalysisResult {
    status: StatusType;
    riskScore: number;
    jobTitle: string;
    destination: string;
    salary: string;
    redFlags: string[];
    geographicRisk: string;
    recommendation: string;
}

export interface HistoryItem extends JobAnalysisResult {
    id: number;
    date: string;
}