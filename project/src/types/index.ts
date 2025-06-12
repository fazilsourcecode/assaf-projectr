export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: EmotionAnalysis;
}

export interface EmotionAnalysis {
  primary: string;
  confidence: number;
  emotions: {
    stress: number;
    anxiety: number;
    sadness: number;
    anger: number;
    joy: number;
    neutral: number;
  };
}

export interface WellnessActivity {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | 'meditation' | 'exercise' | 'journaling' | 'affirmation';
  duration: number;
  instructions: string[];
  tags: string[];
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: number; // 1-10 scale
  emotions: string[];
  notes?: string;
}

export interface UserSession {
  sessionId: string;
  startTime: Date;
  messages: Message[];
  moodHistory: MoodEntry[];
  preferences: {
    voiceEnabled: boolean;
    notifications: boolean;
    anonymousMode: boolean;
  };
}