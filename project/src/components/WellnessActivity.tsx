import React, { useState } from 'react';
import { WellnessActivity as ActivityType } from '../types';
import { Play, Clock, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface WellnessActivityProps {
  activity: ActivityType;
  onStart: (activity: ActivityType) => void;
}

export function WellnessActivity({ activity, onStart }: WellnessActivityProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'bg-blue-100 text-blue-800';
      case 'meditation': return 'bg-purple-100 text-purple-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      case 'journaling': return 'bg-yellow-100 text-yellow-800';
      case 'affirmation': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">{activity.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{activity.duration} min</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
              {activity.type}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onStart(activity)}
          className="ml-3 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Play size={16} />
        </button>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
      >
        <span>Instructions</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isExpanded && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <ol className="text-sm text-gray-700 space-y-1">
            {activity.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 font-medium min-w-[20px]">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
          
          {activity.tags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Tag size={12} className="text-gray-400" />
                <div className="flex gap-1 flex-wrap">
                  {activity.tags.map((tag, index) => (
                    <span key={index} className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}