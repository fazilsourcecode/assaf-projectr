import { WellnessActivity } from '../types';

export const wellnessActivities: WellnessActivity[] = [
  {
    id: 'box-breathing',
    title: '4-7-8 Breathing Technique',
    description: 'A calming breathing exercise to reduce stress and anxiety',
    type: 'breathing',
    duration: 5,
    instructions: [
      'Sit comfortably with your back straight',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat 3-4 times'
    ],
    tags: ['stress', 'anxiety', 'sleep']
  },
  {
    id: 'body-scan',
    title: 'Progressive Body Scan',
    description: 'Mindful awareness of physical sensations to promote relaxation',
    type: 'meditation',
    duration: 10,
    instructions: [
      'Lie down or sit comfortably',
      'Close your eyes and take three deep breaths',
      'Start at the top of your head',
      'Slowly scan down your body',
      'Notice any tension or sensations',
      'Breathe into areas of tension',
      'Continue to your toes'
    ],
    tags: ['stress', 'tension', 'relaxation']
  },
  {
    id: 'gratitude-journal',
    title: 'Gratitude Practice',
    description: 'Reflect on positive aspects of your life',
    type: 'journaling',
    duration: 5,
    instructions: [
      'Find a quiet space',
      'Think of 3 things you\'re grateful for today',
      'Write them down or say them aloud',
      'For each item, reflect on why it matters',
      'Notice how this makes you feel',
      'End with a moment of appreciation'
    ],
    tags: ['sadness', 'negativity', 'perspective']
  },
  {
    id: 'anger-release',
    title: 'Anger Release Exercise',
    description: 'Physical movement to channel and release anger',
    type: 'exercise',
    duration: 10,
    instructions: [
      'Find a private space',
      'Take 5 deep breaths',
      'Punch a pillow or do jumping jacks',
      'Scream into a pillow if needed',
      'Continue until you feel tension release',
      'End with gentle stretching',
      'Take 3 more deep breaths'
    ],
    tags: ['anger', 'frustration', 'tension']
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others',
    type: 'meditation',
    duration: 8,
    instructions: [
      'Sit quietly and close your eyes',
      'Start with yourself: "May I be happy and healthy"',
      'Think of a loved one: "May you be happy and healthy"',
      'Think of a neutral person: "May you be happy and healthy"',
      'Think of someone difficult: "May you be happy and healthy"',
      'Extend to all beings: "May all beings be happy and healthy"'
    ],
    tags: ['sadness', 'anger', 'compassion']
  },
  {
    id: 'positive-affirmations',
    title: 'Positive Affirmations',
    description: 'Strengthen self-esteem with positive self-talk',
    type: 'affirmation',
    duration: 3,
    instructions: [
      'Stand or sit with good posture',
      'Look in a mirror if possible',
      'Say each affirmation with conviction',
      '"I am capable and strong"',
      '"I deserve happiness and peace"',
      '"I can handle whatever comes my way"',
      'Repeat 3 times each'
    ],
    tags: ['self-esteem', 'confidence', 'sadness']
  },
  {
    id: 'five-senses',
    title: '5-4-3-2-1 Grounding',
    description: 'Ground yourself in the present moment using your senses',
    type: 'meditation',
    duration: 5,
    instructions: [
      'Sit comfortably and breathe deeply',
      'Name 5 things you can SEE',
      'Name 4 things you can TOUCH',
      'Name 3 things you can HEAR',
      'Name 2 things you can SMELL',
      'Name 1 thing you can TASTE',
      'Take three deep breaths'
    ],
    tags: ['anxiety', 'panic', 'grounding']
  }
];

export function getActivityRecommendations(primaryEmotion: string, emotions: any): WellnessActivity[] {
  const recommendations: WellnessActivity[] = [];
  
  // Get activities that match the primary emotion
  const primaryActivities = wellnessActivities.filter(activity => 
    activity.tags.includes(primaryEmotion)
  );
  
  recommendations.push(...primaryActivities);
  
  // Add activities for secondary emotions (those with significant scores)
  Object.entries(emotions).forEach(([emotion, score]) => {
    if (emotion !== primaryEmotion && score > 0.3) {
      const secondaryActivities = wellnessActivities.filter(activity => 
        activity.tags.includes(emotion) && !recommendations.includes(activity)
      );
      recommendations.push(...secondaryActivities);
    }
  });
  
  // Always include at least one general relaxation activity
  if (recommendations.length === 0) {
    recommendations.push(wellnessActivities[0]); // Default to breathing exercise
  }
  
  // Limit to top 3 recommendations
  return recommendations.slice(0, 3);
}