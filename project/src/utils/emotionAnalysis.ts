import { EmotionAnalysis } from '../types';

// Enhanced emotion detection patterns
const emotionPatterns = {
  stress: [
    'stressed', 'overwhelmed', 'pressure', 'deadline', 'busy', 'exhausted',
    'tired', 'burned out', 'can\'t cope', 'too much', 'breaking point',
    'overloaded', 'chaos', 'frantic', 'rushing', 'panic'
  ],
  anxiety: [
    'anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'fear',
    'concerned', 'uneasy', 'restless', 'tense', 'on edge', 'jittery',
    'catastrophe', 'what if', 'terrified', 'dread', 'apprehensive'
  ],
  sadness: [
    'sad', 'depressed', 'down', 'low', 'blue', 'unhappy', 'miserable',
    'hopeless', 'empty', 'lonely', 'isolated', 'crying', 'tears',
    'grief', 'mourning', 'heartbroken', 'defeated', 'worthless'
  ],
  anger: [
    'angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated',
    'rage', 'hate', 'pissed', 'livid', 'outraged', 'resentful',
    'bitter', 'hostile', 'aggressive', 'fed up', 'infuriated'
  ],
  joy: [
    'happy', 'joyful', 'excited', 'great', 'amazing', 'wonderful',
    'fantastic', 'good', 'awesome', 'thrilled', 'delighted',
    'cheerful', 'optimistic', 'grateful', 'blessed', 'content'
  ]
};

const intensityModifiers = {
  high: ['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally'],
  medium: ['quite', 'fairly', 'somewhat', 'rather', 'pretty'],
  low: ['a bit', 'slightly', 'a little', 'kind of', 'sort of']
};

export function analyzeEmotion(text: string): EmotionAnalysis {
  const lowercaseText = text.toLowerCase();
  const words = lowercaseText.split(/\s+/);
  
  const emotions = {
    stress: 0,
    anxiety: 0,
    sadness: 0,
    anger: 0,
    joy: 0,
    neutral: 0
  };

  // Calculate emotion scores
  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    let score = 0;
    patterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    });

    // Apply intensity modifiers
    intensityModifiers.high.forEach(modifier => {
      if (lowercaseText.includes(modifier) && score > 0) {
        score *= 1.5;
      }
    });

    intensityModifiers.medium.forEach(modifier => {
      if (lowercaseText.includes(modifier) && score > 0) {
        score *= 1.2;
      }
    });

    emotions[emotion as keyof typeof emotions] = Math.min(score, 1);
  });

  // Normalize scores
  const totalScore = Object.values(emotions).reduce((sum, score) => sum + score, 0);
  if (totalScore === 0) {
    emotions.neutral = 1;
  } else {
    Object.keys(emotions).forEach(key => {
      emotions[key as keyof typeof emotions] /= totalScore;
    });
  }

  // Determine primary emotion
  const primaryEmotion = Object.entries(emotions).reduce((a, b) => 
    emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b
  )[0];

  return {
    primary: primaryEmotion,
    confidence: emotions[primaryEmotion as keyof typeof emotions],
    emotions
  };
}

export function getEmotionColor(emotion: string): string {
  const colors = {
    stress: '#ef4444', // red
    anxiety: '#f97316', // orange
    sadness: '#3b82f6', // blue
    anger: '#dc2626', // dark red
    joy: '#22c55e', // green
    neutral: '#6b7280' // gray
  };
  return colors[emotion as keyof typeof colors] || colors.neutral;
}

export function getEmotionIcon(emotion: string): string {
  const icons = {
    stress: '😰',
    anxiety: '😟',
    sadness: '😢',
    anger: '😠',
    joy: '😊',
    neutral: '😐'
  };
  return icons[emotion as keyof typeof icons] || icons.neutral;
}