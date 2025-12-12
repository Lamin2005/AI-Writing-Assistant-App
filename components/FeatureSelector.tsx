import React from 'react';
import { FeatureId } from '../types';
import { 
  Languages, 
  SpellCheck, 
  Minimize2, 
  Maximize2, 
  SlidersHorizontal, 
  PenTool, 
  FileText 
} from 'lucide-react';

interface FeatureSelectorProps {
  selected: FeatureId;
  onSelect: (feature: FeatureId) => void;
}

export const FeatureSelector: React.FC<FeatureSelectorProps> = ({ selected, onSelect }) => {
  const features = [
    { id: FeatureId.TRANSLATE, label: 'Translate', icon: Languages, desc: 'Burmese ↔ English' },
    { id: FeatureId.GRAMMAR, label: 'Grammar', icon: SpellCheck, desc: 'Fix spelling & errors' },
    { id: FeatureId.SIMPLIFY, label: 'Simplify', icon: Minimize2, desc: 'Make text easier' },
    { id: FeatureId.EXPAND, label: 'Expand', icon: Maximize2, desc: 'Make text longer' },
    { id: FeatureId.TONE, label: 'Tone', icon: SlidersHorizontal, desc: 'Adjust writing style' },
    { id: FeatureId.GENERATE, label: 'Generate', icon: PenTool, desc: 'Create content' },
    { id: FeatureId.SUMMARY, label: 'Summary', icon: FileText, desc: 'Summarize text' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
      {features.map((feature) => {
        const Icon = feature.icon;
        const isSelected = selected === feature.id;
        return (
          <button
            key={feature.id}
            onClick={() => onSelect(feature.id)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 border
              ${isSelected 
                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-primary-300'
              }
            `}
          >
            <Icon size={24} className={`mb-2 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
            <span className="text-sm font-medium">{feature.label}</span>
            <span className="text-[10px] opacity-70 mt-1 text-center hidden sm:block">{feature.desc}</span>
          </button>
        );
      })}
    </div>
  );
};