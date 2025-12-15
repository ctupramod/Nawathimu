export type Language = 'en' | 'si' | 'ta';

export interface User {
  username: string;
  name: string;
  addiction: string;
  quitDate: string; // ISO string
  coins: number;
  level: number;
  city: string;
  ageRange: string;
  email?: string;
  phone?: string;
  isAdmin?: boolean;
  currentStreak: number;
  lastCheckInDate?: string;
}

export interface SymptomRecord {
  id: string;
  name: string;
  category: 'Physical' | 'Emotional' | 'Mental' | 'Other';
  severity: number; // 1-10
}

export interface CheckInLog {
  id: string;
  date: string; // ISO string
  mood: number; // 1-10
  cravings: number; // 1-10
  symptoms: SymptomRecord[];
  notes: string;
  advice?: {
    practicalTips: string[];
    encouragement: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredDays: number;
  unlocked: boolean;
}

export interface AiAdvice {
  id: string;
  date: string;
  symptoms: string;
  advice: string[]; // Array of practical tips
  encouragement: string;
}

export interface ChatMessage {
  id: string;
  senderUsername: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface AdminConfig {
  emergencyContacts: { name: string; number: string }[];
  herbalRemedies: { name: string; description: string }[];
}

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  CHECKIN = 'CHECKIN',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  JOURNAL = 'JOURNAL',
  GAMES = 'GAMES',
  COMMUNITY = 'COMMUNITY',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE'
}

export const SYMPTOM_CATEGORIES = {
  Physical: ["muscle_pain", "headache", "nausea", "sweating", "tremors", "fatigue", "insomnia"],
  Emotional: ["anxiety", "irritability", "depression"],
  Mental: ["brain_fog", "cravings"]
};

export const SRI_LANKA_CITIES = [
  "Colombo", "Gampaha", "Kandy", "Galle", "Matara", 
  "Nuwara Eliya", "Jaffna", "Trincomalee", "Batticaloa", 
  "Anuradhapura", "Polonnaruwa", "Kurunegala", "Ratnapura", 
  "Badulla", "Monaragala", "Kegalle", "Kalutara", 
  "Puttalam", "Ampara", "Mullaitivu", "Kilinochchi", 
  "Mannar", "Vavuniya", "Hambantota"
];