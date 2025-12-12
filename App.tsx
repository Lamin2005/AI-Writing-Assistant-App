import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Eraser,
  Check
} from 'lucide-react';

// Components
import { Header } from './components/Header';
import { FeatureSelector } from './components/FeatureSelector';
import { Button } from './components/Button';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsModal } from './components/SettingsModal';

// Logic
import { generateContent } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FeatureId, ToneType, HistoryItem } from './types';

// Constants
const DEFAULT_API_KEY = process.env.VITE_GEMINI_API_KEY || ''; // Fallback to env

function App() {
  // --- State ---
  // Theme state
  const [isDark, setIsDark] = useLocalStorage<boolean>('lumina-theme-dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
  // Settings state
  const [apiKey, setApiKey] = useLocalStorage<string>('lumina-api-key', DEFAULT_API_KEY);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // App Logic State
  const [selectedFeature, setSelectedFeature] = useState<FeatureId>(FeatureId.GENERATE);
  const [selectedTone, setSelectedTone] = useState<ToneType>(ToneType.PROFESSIONAL);
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('lumina-history', []);
  const [copySuccess, setCopySuccess] = useState(false);

  // --- Effects ---
  // Apply theme class to body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // If no API key is present on mount, open settings
  useEffect(() => {
    if (!apiKey && !process.env.VITE_GEMINI_API_KEY) {
      // Small delay to allow render
      setTimeout(() => {
        toast('Please set your API Key to start', { icon: '🔑' });
        setIsSettingsOpen(true);
      }, 1000);
    }
  }, [apiKey]);

  // --- Handlers ---
  
  const handleProcess = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text');
      return;
    }

    if (!apiKey) {
      setIsSettingsOpen(true);
      toast.error('API Key is required');
      return;
    }

    setIsLoading(true);
    setResultText(''); // Clear previous result

    try {
      const generatedText = await generateContent(apiKey, {
        feature: selectedFeature,
        text: inputText,
        tone: selectedFeature === FeatureId.TONE ? selectedTone : undefined
      });

      setResultText(generatedText);
      
      // Save to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        feature: selectedFeature,
        input: inputText,
        output: generatedText,
        timestamp: Date.now()
      };
      
      setHistory([newHistoryItem, ...history.slice(0, 49)]); // Keep last 50
      toast.success('Generated successfully!');

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResultText('');
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopySuccess(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSpeak = () => {
    if (!resultText) return;
    const utterance = new SpeechSynthesisUtterance(resultText);
    // Attempt to detect language broadly
    if (selectedFeature === FeatureId.TRANSLATE && /[\u1000-\u109F]/.test(resultText)) {
       // Burmese range
       utterance.lang = 'my-MM';
    } else {
       utterance.lang = 'en-US';
    }
    window.speechSynthesis.speak(utterance);
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setSelectedFeature(item.feature);
    setInputText(item.input);
    setResultText(item.output);
    setIsHistoryOpen(false);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-200">
      <Toaster position="bottom-right" />
      
      <Header 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Inputs */}
        <div className="flex-1 flex flex-col space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select Feature</h2>
            <FeatureSelector 
              selected={selectedFeature} 
              onSelect={setSelectedFeature} 
            />
          </section>

          {/* Tone Selector (Conditional) */}
          {selectedFeature === FeatureId.TONE && (
             <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Target Tone</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(ToneType).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedTone === tone 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-500' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
             </div>
          )}

          <section className="flex-1 flex flex-col min-h-[300px]">
             <div className="flex justify-between items-center mb-2">
               <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Input Text</h2>
               <div className="flex gap-2">
                  {inputText && (
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-gray-500 hover:text-red-500 h-7">
                      <Eraser size={14} className="mr-1" /> Clear
                    </Button>
                  )}
               </div>
             </div>
             
             <div className="relative flex-1 group">
               <textarea
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder={
                    selectedFeature === FeatureId.GENERATE 
                    ? "Enter topic or keywords (e.g., 'The benefits of meditation for programmers')..." 
                    : "Enter or paste your text here..."
                 }
                 className="w-full h-full min-h-[250px] p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none shadow-sm transition-all text-base leading-relaxed"
                 spellCheck="false"
               />
               <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded-md backdrop-blur-sm">
                 {wordCount} words | {charCount} chars
               </div>
             </div>

             <div className="mt-4 flex gap-3">
               <Button 
                 onClick={handleProcess} 
                 disabled={!inputText.trim()} 
                 isLoading={isLoading}
                 className="flex-1 shadow-lg shadow-primary-500/20"
               >
                 <Sparkles className="mr-2 h-5 w-5" />
                 {selectedFeature === FeatureId.GENERATE ? 'Generate Content' : 'Process Text'}
               </Button>
             </div>
          </section>
        </div>

        {/* Right Column: Output */}
        <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0">
          <div className="flex justify-between items-center mb-3 h-6">
             <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</h2>
             {resultText && (
               <div className="flex gap-1">
                 <button 
                   onClick={handleSpeak}
                   className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                   title="Read aloud"
                 >
                   <Volume2 size={18} />
                 </button>
                 <button 
                   onClick={handleCopy}
                   className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center"
                   title="Copy to clipboard"
                 >
                   {copySuccess ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                 </button>
               </div>
             )}
          </div>

          <div className={`
            flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6 overflow-y-auto relative transition-all duration-300
            ${!resultText && !isLoading ? 'flex items-center justify-center' : ''}
          `}>
             {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full space-y-4">
                 <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-700 opacity-20"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary-500 animate-spin"></div>
                 </div>
                 <p className="text-gray-500 dark:text-gray-400 animate-pulse">Consulting Gemini AI...</p>
               </div>
             ) : resultText ? (
               <div className="prose prose-slate dark:prose-invert max-w-none">
                 <ReactMarkdown>{resultText}</ReactMarkdown>
               </div>
             ) : (
               <div className="text-center text-gray-400 dark:text-gray-600">
                 <Sparkles className="mx-auto h-12 w-12 mb-3 opacity-20" />
                 <p>AI output will appear here</p>
               </div>
             )}
          </div>
        </div>

      </main>

      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onSelect={handleRestoreHistory}
        onClear={() => {
          if(confirm('Are you sure you want to clear history?')) setHistory([]);
        }}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSave={setApiKey}
      />
    </div>
  );
}

export default App;