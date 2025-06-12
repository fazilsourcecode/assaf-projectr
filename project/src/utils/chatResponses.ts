import { EmotionAnalysis, WellnessActivity } from '../types';
import { getActivityRecommendations } from './wellnessActivities';

export function generateResponse(text: string, emotion: EmotionAnalysis): string {
  const { primary, confidence, emotions } = emotion;
  
  // High confidence responses
  if (confidence > 0.7) {
    switch (primary) {
      case 'stress':
        return getStressResponse(text, emotions);
      case 'anxiety':
        return getAnxietyResponse(text, emotions);
      case 'sadness':
        return getSadnessResponse(text, emotions);
      case 'anger':
        return getAngerResponse(text, emotions);
      case 'joy':
        return getJoyResponse(text, emotions);
      default:
        return getNeutralResponse(text);
    }
  }
  
  // Mixed emotions or lower confidence
  if (confidence > 0.4) {
    return getMixedEmotionResponse(emotions);
  }
  
  return getNeutralResponse(text);
}

function getStressResponse(text: string, emotions: any): string {
  const responses = [
    "I can hear that you're feeling stressed right now. It's completely normal to feel overwhelmed sometimes. Let's work together to find some relief.",
    "Stress can feel really overwhelming. You're not alone in this feeling. I'm here to help you find some techniques that might bring you some peace.",
    "It sounds like you're carrying a heavy load right now. Stress affects us all differently, but there are proven ways to help manage these feelings."
  ];
  
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  const suggestion = "Would you like me to guide you through a quick breathing exercise or suggest some stress-relief techniques?";
  
  return `${baseResponse} ${suggestion}`;
}

function getAnxietyResponse(text: string, emotions: any): string {
  const responses = [
    "I notice you're feeling anxious. Anxiety can be really challenging, but you're taking a positive step by reaching out.",
    "Anxiety can make everything feel more intense. Thank you for sharing what you're going through with me.",
    "I hear the worry in your words. Anxiety is your mind's way of trying to protect you, but sometimes it can feel overwhelming."
  ];
  
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  const suggestion = "I have some grounding techniques that might help you feel more centered. Would you like to try one?";
  
  return `${baseResponse} ${suggestion}`;
}

function getSadnessResponse(text: string, emotions: any): string {
  const responses = [
    "I can sense that you're going through a difficult time. It's okay to feel sad - your emotions are valid.",
    "Thank you for trusting me with your feelings. Sadness can be really heavy to carry alone.",
    "I hear the pain in your words. It takes courage to acknowledge these difficult emotions."
  ];
  
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  const suggestion = "Sometimes gentle activities like gratitude practice or loving-kindness meditation can help. Would you like to explore these together?";
  
  return `${baseResponse} ${suggestion}`;
}

function getAngerResponse(text: string, emotions: any): string {
  const responses = [
    "I can feel the intensity of your anger. It's a powerful emotion that often signals something important needs attention.",
    "Anger can be overwhelming. Thank you for sharing these strong feelings with me.",
    "I hear your frustration. Anger often masks other emotions like hurt or disappointment."
  ];
  
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  const suggestion = "There are healthy ways to channel and release anger. Would you like me to share some techniques that might help?";
  
  return `${baseResponse} ${suggestion}`;
}

function getJoyResponse(text: string, emotions: any): string {
  const responses = [
    "I love hearing the happiness in your words! It's wonderful that you're experiencing joy.",
    "Your positive energy is contagious! Thank you for sharing this joyful moment with me.",
    "It's beautiful to witness your happiness. Joy is such a powerful and healing emotion."
  ];
  
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  const suggestion = "Would you like to explore ways to cultivate and maintain this positive feeling?";
  
  return `${baseResponse} ${suggestion}`;
}

function getMixedEmotionResponse(emotions: any): string {
  const responses = [
    "I'm sensing a mix of emotions in what you've shared. It's completely normal to feel multiple things at once.",
    "You seem to be experiencing several different emotions right now. That can feel complex and overwhelming.",
    "I notice you might be feeling a combination of emotions. The human experience is rarely simple."
  ];
  
  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  const suggestion = "Let's take this one step at a time. What feels most pressing for you right now?";
  
  return `${baseResponse} ${suggestion}`;
}

function getNeutralResponse(text: string): string {
  const responses = [
    "Thank you for sharing that with me. I'm here to listen and support you.",
    "I appreciate you opening up. How are you feeling in this moment?",
    "I'm glad you're here. What's on your mind today?",
    "Thank you for trusting me with your thoughts. How can I best support you right now?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export function getCrisisResponse(): string {
  return `I'm concerned about what you've shared. If you're having thoughts of hurting yourself or others, please reach out for immediate help:

**Crisis Resources:**
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

You matter, and there are people who want to help. Please don't hesitate to reach out to a mental health professional or emergency services if you need immediate support.`;
}

export function detectCrisisLanguage(text: string): boolean {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'don\'t want to live',
    'hurt myself', 'self harm', 'cutting', 'overdose',
    'no point in living', 'better off dead', 'want to die'
  ];
  
  const lowercaseText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowercaseText.includes(keyword));
}