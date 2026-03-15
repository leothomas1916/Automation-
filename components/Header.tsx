import React from 'react';
import { Smartphone, Zap, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                iRepair<span className="text-blue-600">2k</span>
              </h1>
              <div className="ml-3 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md flex items-center">
                <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">Genuine Parts Only</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">GBP Content Generator</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
            <Zap className="w-3 h-3 mr-1 text-purple-500" />
            Gemini 3 Pro Image (4K)
          </div>
        </div>
      </div>
    </header>
  );
};