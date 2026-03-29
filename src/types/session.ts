export interface Correction {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  severity?: 'MINOR' | 'MODERATE' | 'MAJOR';
}

export interface StuckSuggestion {
  context: string;
  suggestions: string[];
}

export interface TranscriptEntry {
  role: 'USER' | 'AI';
  content: string;
  timestamp: Date;
}

export interface SessionSummary {
  duration: number;
  sentenceCount: number;
  grammarCorrections: number;
  fillerCount: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
  recommendedFocus: string;
}

export type CorrectionMode = 'LIGHT' | 'STRICT' | 'FLUENCY';
export type Plan = 'FREE' | 'PRO';
