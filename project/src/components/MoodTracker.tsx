import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from '../types';
import { Calendar, TrendingUp, Smile } from 'lucide-react';

interface MoodTrackerProps {
  moodHistory: MoodEntry[];
  onAddMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
}

const moodEmojis = ['😢', '😞', '😐', '🙂', '😊', '😄', '😁', '🤩', '😇', '🥳'];
const moodLabels = ['Terrible', 'Bad', 'Poor', 'Okay', 'Fine', 'Good', 'Great', 'Amazing', 'Fantastic', 'Perfect'];

export function MoodTracker({ moodHistory, onAddMoodEntry }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const emotionOptions = ['stressed', 'anxious', 'sad', 'angry', 'happy', 'excited', 'calm', 'grateful', 'lonely', 'hopeful'];

  const handleSubmit = () => {
    if (selectedMood > 0) {
      onAddMoodEntry({
        date: new Date(),
        mood: selectedMood,
        emotions: selectedEmotions,
        notes: notes.trim() || undefined
      });
      
      // Reset form
      setSelectedMood(5);
      setSelectedEmotions([]);
      setNotes('');
    }
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  // Prepare chart data
  const chartData = moodHistory.slice(-7).map((entry, index) => ({
    day: entry.date.toLocaleDateString([], { weekday: 'short' }),
    mood: entry.mood,
    date: entry.date.toLocaleDateString()
  }));

  const averageMood = moodHistory.length > 0 
    ? (moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-blue-500" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Mood Tracking</h3>
      </div>

      {/* Current Mood Entry */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-700 mb-4">How are you feeling today?</h4>
        
        <div className="grid grid-cols-5 gap-2 mb-4">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => setSelectedMood(index + 1)}
              className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-105 ${
                selectedMood === index + 1
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={moodLabels[index]}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="text-center mb-4">
          <span className="text-lg font-medium text-gray-700">
            {moodLabels[selectedMood - 1]} ({selectedMood}/10)
          </span>
        </div>

        {/* Emotion Tags */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What emotions are you experiencing?
          </label>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map(emotion => (
              <button
                key={emotion}
                onClick={() => toggleEmotion(emotion)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedEmotions.includes(emotion)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's contributing to how you feel today?"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Log Mood
        </button>
      </div>

      {/* Mood History */}
      {moodHistory.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            Your Mood Trends
          </h4>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{averageMood}</div>
              <div className="text-sm text-blue-800">Average Mood</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{moodHistory.length}</div>
              <div className="text-sm text-green-800">Days Tracked</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Mood']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.date;
                      }
                      return label;
                    }}
                  />
                  <Bar dataKey="mood" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Entries */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Recent Entries</h5>
            {moodHistory.slice(-3).reverse().map(entry => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{moodEmojis[entry.mood - 1]}</span>
                    <span className="font-medium">{moodLabels[entry.mood - 1]}</span>
                    <span className="text-sm text-gray-500">({entry.mood}/10)</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {entry.date.toLocaleDateString()}
                  </span>
                </div>
                {entry.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.emotions.map((emotion, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {emotion}
                      </span>
                    ))}
                  </div>
                )}
                {entry.notes && (
                  <p className="text-sm text-gray-600">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}