export enum FeatureId {
  TRANSLATE = 'translate',
  GRAMMAR = 'grammar',
  SIMPLIFY = 'simplify',
  EXPAND = 'expand',
  TONE = 'tone',
  GENERATE = 'generate',
  SUMMARY = 'summary'
}

export enum ToneType {
  FORMAL = 'Formal',
  CASUAL = 'Casual',
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  PERSUASIVE = 'Persuasive'
}

export interface HistoryItem {
  id: string;
  feature: FeatureId;
  input: string;
  output: string;
  timestamp: number;
}

export interface AppSettings {
  apiKey: string;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'my'; // English or Burmese UI support
}

export interface GenerationRequest {
  feature: FeatureId;
  text: string;
  tone?: ToneType;
  context?: string; // Additional instructions
}