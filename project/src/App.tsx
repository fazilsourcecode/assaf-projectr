import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Activity, BarChart3, Wind, Heart, Shield, Menu, X } from 'lucide-react';
import { Message, MoodEntry, WellnessActivity as ActivityType, UserSession } from './types';
import { analyzeEmotion } from './utils/emotionAnalysis';
import { generateResponse, detectCrisisLanguage, getCrisisResponse } from './utils/chatResponses';
import { getActivityRecommendations } from './utils/wellnessActivities';
import { ChatMessage } from './components/ChatMessage';
import { BreathingExercise } from './components/BreathingExercise';
import { WellnessActivity } from './components/WellnessActivity';
import { MoodTracker } from './components/MoodTracker';
import { VoiceInput } from './components/VoiceInput';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm MindBot, your AI mental health companion. I'm here to listen, understand, and support you through whatever you're experiencing. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'mood' | 'activities'>('chat');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('mindbot-messages');
    const savedMoodHistory = localStorage.getItem('mindbot-mood-history');
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
    
    if (savedMoodHistory) {
      try {
        const parsed = JSON.parse(savedMoodHistory);
        setMoodHistory(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      } catch (error) {
        console.error('Error loading mood history:', error);
      }
    }
  }, []);

  // Save data to localStorage when updated
  useEffect(() => {
    localStorage.setItem('mindbot-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('mindbot-mood-history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    // Check for crisis language
    if (detectCrisisLanguage(text)) {
      const crisisMessage: Message = {
        id: Date.now().toString(),
        text: getCrisisResponse(),
        sender: 'bot',
        timestamp: new Date()
      };
      
      const userMessage: Message = {
        id: (Date.now() - 1).toString(),
        text,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage, crisisMessage]);
      setInputText('');
      return;
    }

    // Analyze emotion
    const emotion = analyzeEmotion(text);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      emotion
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(text, emotion);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setMoodHistory(prev => [...prev, newEntry]);
  };

  const startActivity = (activity: ActivityType) => {
    if (activity.type === 'breathing') {
      setShowBreathing(true);
    } else {
      // For other activities, add a helpful message to chat
      const message: Message = {
        id: Date.now().toString(),
        text: `Great choice! I've prepared the "${activity.title}" activity for you. Here are the instructions:\n\n${activity.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}\n\nTake your time and remember, I'm here if you need any support. How do you feel after completing this activity?`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, message]);
      setActiveTab('chat');
    }
  };

  const getRecommendedActivities = () => {
    const recentUserMessages = messages.filter(msg => msg.sender === 'user' && msg.emotion).slice(-3);
    if (recentUserMessages.length === 0) return [];

    const latestEmotion = recentUserMessages[recentUserMessages.length - 1].emotion;
    if (!latestEmotion) return [];

    return getActivityRecommendations(latestEmotion.primary, latestEmotion.emotions);
  };

  const NavButton = ({ icon: Icon, label, tab, count }: { icon: any, label: string, tab: string, count?: number }) => (
    <button
      onClick={() => {
        setActiveTab(tab as any);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        activeTab === tab
          ? 'bg-blue-500 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MindBot
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex h-screen lg:h-screen">
        {/* Sidebar */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MindBot
                </h1>
                <p className="text-sm text-gray-500">Your AI Mental Health Companion</p>
              </div>
            </div>

            <div className="space-y-2">
              <NavButton icon={MessageCircle} label="Chat" tab="chat" />
              <NavButton icon={BarChart3} label="Mood Tracker" tab="mood" count={moodHistory.length} />
              <NavButton icon={Activity} label="Wellness Activities" tab="activities" />
            </div>
          </div>

          <div className="p-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-green-600" size={16} />
                <h3 className="font-semibold text-green-800">Privacy First</h3>
              </div>
              <p className="text-sm text-green-700">
                Your conversations are stored locally on your device for privacy and security.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="text-purple-600" size={16} />
                <h3 className="font-semibold text-purple-800">Quick Calm</h3>
              </div>
              <button
                onClick={() => setShowBreathing(true)}
                className="text-sm text-purple-700 hover:text-purple-800 font-medium"
              >
                Start breathing exercise →
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {activeTab === 'chat' && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <MessageCircle className="text-white" size={16} />
                      </div>
                      <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Recommended Activities */}
                {getRecommendedActivities().length > 0 && (
                  <div className="max-w-4xl mx-auto mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended for You</h3>
                    <div className="grid gap-4">
                      {getRecommendedActivities().slice(0, 2).map(activity => (
                        <WellnessActivity
                          key={activity.id}
                          activity={activity}
                          onStart={startActivity}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t bg-white p-4 lg:p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isVoiceActive ? "Listening..." : "Share what's on your mind..."}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={isVoiceActive}
                      />
                      
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <VoiceInput
                          onTranscript={(text) => {
                            setInputText(text);
                            setTimeout(() => handleSendMessage(text), 100);
                          }}
                          onSpeechStart={() => setIsVoiceActive(true)}
                          onSpeechEnd={() => setIsVoiceActive(false)}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim() || isTyping}
                      className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'mood' && (
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="max-w-4xl mx-auto">
                <MoodTracker
                  moodHistory={moodHistory}
                  onAddMoodEntry={addMoodEntry}
                />
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Wellness Activities</h2>
                  <p className="text-gray-600">Explore personalized activities to support your mental well-being</p>
                </div>

                <div className="grid gap-6">
                  {getRecommendedActivities().map(activity => (
                    <WellnessActivity
                      key={activity.id}
                      activity={activity}
                      onStart={startActivity}
                    />
                  ))}
                </div>

                {/* Emergency Resources */}
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Crisis Support</h3>
                  <div className="space-y-2 text-sm text-red-700">
                    <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
                    <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                    <p><strong>International:</strong> Visit iasp.info for local resources</p>
                  </div>
                  <p className="text-sm text-red-600 mt-3">
                    If you're in immediate danger, please call emergency services (911) or go to your nearest emergency room.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breathing Exercise Modal */}
      <BreathingExercise
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
      />
    </div>
  );
}

export default App;