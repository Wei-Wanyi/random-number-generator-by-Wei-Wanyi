/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, Dices, HelpCircle, List, Sparkles, RefreshCw, Layers } from 'lucide-react';
import MainGenerator from './components/MainGenerator';
import DiceRoller from './components/DiceRoller';
import CoinFlipper from './components/CoinFlipper';
import ListPicker from './components/ListPicker';
import HistoryLog from './components/HistoryLog';
import { HistoryItem } from './types';

type ActiveTool = 'number' | 'dice' | 'coin' | 'list';

export default function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('number');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleAddHistory = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, 100)); // Keep last 100 items
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Switch tools helper
  const tools = [
    {
      id: 'number' as ActiveTool,
      name: 'Classic Range',
      desc: 'Single/multiple range generator',
      icon: Hash,
      colorClass: 'text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/40',
      activeColorClass: 'border-emerald-500 ring-2 ring-emerald-500/10 text-emerald-600 bg-emerald-50/60',
    },
    {
      id: 'dice' as ActiveTool,
      name: 'Dice Roller',
      desc: 'Roll customized polyhedral dice',
      icon: Dices,
      colorClass: 'text-indigo-500 bg-indigo-50 border-indigo-100 hover:bg-indigo-100/40',
      activeColorClass: 'border-indigo-500 ring-2 ring-indigo-500/10 text-indigo-600 bg-indigo-50/60',
    },
    {
      id: 'coin' as ActiveTool,
      name: 'Coin Flipper',
      desc: 'Flip visual coins with stats tracker',
      icon: HelpCircle,
      colorClass: 'text-amber-500 bg-amber-50 border-amber-100 hover:bg-amber-100/40',
      activeColorClass: 'border-amber-500 ring-2 ring-amber-500/10 text-amber-600 bg-amber-50/60',
    },
    {
      id: 'list' as ActiveTool,
      name: 'List Picker',
      desc: 'Draw custom items or raffle lists',
      icon: List,
      colorClass: 'text-purple-500 bg-purple-50 border-purple-100 hover:bg-purple-100/40',
      activeColorClass: 'border-purple-500 ring-2 ring-purple-500/10 text-purple-600 bg-purple-50/60',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-100/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 z-10 flex-1 flex flex-col justify-center">
        
        {/* Header Block */}
        <header className="mb-8 md:mb-10 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm text-slate-500 text-xs font-semibold mb-3.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>100% Client-Side randomness</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display"
          >
            Random Number <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Generator</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base text-slate-500 mt-2.5 font-medium leading-relaxed"
          >
            An elegant, hyper-responsive suite of chance and decision utilities, designed with premium physics and real-time activity logs.
          </motion.p>
        </header>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: Quick Switcher Bar (On mobile shows top, on desktop shows as side control) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-xl shadow-slate-100/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Choose Utility</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                {tools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? tool.activeColorClass
                          : `bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-800`
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white shadow-sm' : tool.colorClass.split(' ')[1]}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-display">{tool.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5 hidden lg:block">
                          {tool.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Informative Panel */}
            <div className="hidden lg:block bg-slate-50 border border-slate-100/80 rounded-3xl p-5">
              <div className="flex gap-2.5 text-slate-500">
                <Layers className="w-4.5 h-4.5 shrink-0 mt-0.5 text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-600 font-display">Seed Information</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">
                    Generates cryptographic pseudo-random floats and integers. Secured locally by your browser's native API.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE: Active Tool Visual workspace */}
          <main className="lg:col-span-6 min-h-[460px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex-1 h-full"
              >
                {activeTool === 'number' && <MainGenerator onAddHistory={handleAddHistory} />}
                {activeTool === 'dice' && <DiceRoller onAddHistory={handleAddHistory} />}
                {activeTool === 'coin' && <CoinFlipper onAddHistory={handleAddHistory} />}
                {activeTool === 'list' && <ListPicker onAddHistory={handleAddHistory} />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* RIGHT: Combined History Feed & Logs */}
          <div className="lg:col-span-3">
            <HistoryLog history={history} onClearHistory={handleClearHistory} />
          </div>

        </div>

      </div>

      {/* Mini Simple Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-100 bg-white/60 text-[11px] text-slate-400 font-medium mt-8">
        Random Number Generator &bull; Secure, private, offline-first &bull; {new Date().getFullYear()}
      </footer>

    </div>
  );
}
