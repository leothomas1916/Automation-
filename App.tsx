import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { PostForm } from './components/PostForm.tsx';
import { PostResult } from './components/PostResult.tsx';
import { generatePostContent } from './services/geminiService.ts';
import { PostOptions, GeneratedContent } from './types.ts';
import { Loader2, AlertCircle, Sparkles, CalendarDays, Link as LinkIcon, Settings2, Copy, CheckCircle2, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (options: PostOptions) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const content = await generatePostContent(options);
      setResult({ ...content, location: options.location });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
                <Settings2 className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Post Configuration</h2>
              </div>
              <PostForm onGenerate={handleGenerate} isLoading={loading} />
              
              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2 text-slate-600 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pro Tip</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Include specific details like "10% discount for students" or "Diwali special" in the offer details for better conversion.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-bold uppercase text-xs tracking-widest">Generation Error</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/20"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center animate-bounce shadow-xl mb-8">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <p className="text-slate-900 font-black uppercase tracking-widest text-xl text-center px-4">Crafting Your GMB Post...</p>
                  <div className="mt-4 flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            ) : result ? (
              <PostResult content={result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 min-h-[600px]">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-slate-900 font-black text-2xl uppercase tracking-tighter text-center">GMB Content Studio</h3>
                <p className="text-slate-400 mt-4 max-w-sm text-center text-sm font-medium leading-relaxed">
                  Select your service strategy and location to generate high-converting Google Business Profile content.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">iRepair2k Content Engine v1.0</span>
          </div>
          <div className="flex items-center space-x-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Best Practices</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;