import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BreathingExercise({ isOpen, onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev === 1) {
            setPhase(current => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              setCycle(c => c + 1);
              return 'inhale';
            });
            return getPhaseCount(phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getPhaseCount = (phase: 'inhale' | 'hold' | 'exhale') => {
    switch (phase) {
      case 'inhale': return 4;
      case 'hold': return 7;
      case 'exhale': return 8;
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-green-400 to-blue-500';
      case 'hold': return 'from-yellow-400 to-orange-500';
      case 'exhale': return 'from-purple-400 to-pink-500';
    }
  };

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">4-7-8 Breathing</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className={`relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-lg transform transition-all duration-1000 ${
            isActive ? 'scale-110' : 'scale-100'
          }`}>
            <div className="text-white text-center">
              <div className="text-3xl font-bold">{count}</div>
              <div className="text-sm opacity-90">{getPhaseText()}</div>
            </div>
          </div>

          <div className="text-gray-600 mb-4">
            <div className="text-sm">Cycle {cycle + 1}</div>
            <div className="text-xs text-gray-500 mt-1">
              Inhale 4 • Hold 7 • Exhale 8
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            Focus on slow, deep breathing. This technique helps activate your body's relaxation response.
          </p>
        </div>
      </div>
    </div>
  );
}