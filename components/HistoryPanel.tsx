import React from 'react';
import { HistoryItem, FeatureId } from '../types';
import { X, Clock, Trash2, ArrowRight } from 'lucide-react';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold">History</h2>
          </div>
          <div className="flex gap-2">
            {history.length > 0 && (
              <button 
                onClick={onClear}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Clear History"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
              <p>No history yet.</p>
              <p className="text-sm mt-1">Generate some content to see it here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-800 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 uppercase">
                    {item.feature}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 font-medium mb-1">
                  {item.input}
                </p>
                <div className="flex items-center text-xs text-gray-400 group-hover:text-primary-500 transition-colors">
                  View Result <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};