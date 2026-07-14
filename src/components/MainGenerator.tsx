/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Check, Hash, Sliders, RefreshCw, Layers } from 'lucide-react';
import { HistoryItem } from '../types';

interface MainGeneratorProps {
  onAddHistory: (item: HistoryItem) => void;
}

export default function MainGenerator({ onAddHistory }: MainGeneratorProps) {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [isDecimal, setIsDecimal] = useState<boolean>(false);
  const [decimalPlaces, setDecimalPlaces] = useState<number>(2);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  
  const [results, setResults] = useState<number[]>([]);
  const [animatedSingleValue, setAnimatedSingleValue] = useState<string>('0');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Quick preset buttons
  const applyPreset = (presetMin: number, presetMax: number, isDec: boolean = false) => {
    setMin(presetMin);
    setMax(presetMax);
    setIsDecimal(isDec);
    if (isDec) {
      setDecimalPlaces(2);
    }
  };

  const handleGenerate = () => {
    if (min >= max) {
      alert('Minimum value must be strictly less than the maximum value.');
      return;
    }
    if (count < 1) {
      alert('Count must be at least 1.');
      return;
    }
    if (count > 500) {
      alert('You can generate a maximum of 500 numbers at once.');
      return;
    }

    setIsGenerating(true);
    setCopiedAll(false);
    setCopiedIndex(null);

    // Simulated roll/flicker animation for single number or fast flicker
    let rollTimer: NodeJS.Timeout;
    let elapsed = 0;
    const duration = 600; // ms
    const intervalTime = 40; // ms

    rollTimer = setInterval(() => {
      elapsed += intervalTime;
      if (isDecimal) {
        const rand = Math.random() * (max - min) + min;
        setAnimatedSingleValue(rand.toFixed(decimalPlaces));
      } else {
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        setAnimatedSingleValue(rand.toString());
      }

      if (elapsed >= duration) {
        clearInterval(rollTimer);
        finalizeGeneration();
      }
    }, intervalTime);
  };

  const finalizeGeneration = () => {
    const finalResults: number[] = [];

    if (isDecimal) {
      for (let i = 0; i < count; i++) {
        const val = Math.random() * (max - min) + min;
        finalResults.push(Number(val.toFixed(decimalPlaces)));
      }
    } else {
      const rangeSize = max - min + 1;
      
      if (!allowDuplicates && count > rangeSize) {
        // If duplicates are forbidden but count is greater than the available integers, we fallback or adjust
        alert(`Cannot generate ${count} unique integers in a range of size ${rangeSize}. Allowing duplicates instead.`);
        for (let i = 0; i < count; i++) {
          const val = Math.floor(Math.random() * rangeSize) + min;
          finalResults.push(val);
        }
      } else if (!allowDuplicates) {
        // Generate unique numbers
        const pool = new Set<number>();
        while (pool.size < count) {
          const val = Math.floor(Math.random() * rangeSize) + min;
          pool.add(val);
        }
        finalResults.push(...Array.from(pool));
      } else {
        for (let i = 0; i < count; i++) {
          const val = Math.floor(Math.random() * rangeSize) + min;
          finalResults.push(val);
        }
      }
    }

    // Sort if selected
    if (sortOrder === 'asc') {
      finalResults.sort((a, b) => a - b);
    } else if (sortOrder === 'desc') {
      finalResults.sort((a, b) => b - a);
    }

    setResults(finalResults);
    setIsGenerating(false);

    if (finalResults.length === 1) {
      setAnimatedSingleValue(finalResults[0].toString());
    }

    // Trigger history log
    const summary = finalResults.length === 1 
      ? `Generated: ${finalResults[0]}` 
      : `Generated ${finalResults.length} numbers`;
    
    const detail = `Range: [${min}, ${max}] | Count: ${count} | Type: ${isDecimal ? `Decimal (${decimalPlaces}pl)` : 'Integer'}`;

    onAddHistory({
      id: crypto.randomUUID(),
      type: 'number',
      timestamp: new Date(),
      summary,
      detail,
    });
  };

  const copyToClipboard = (text: string, index: number | null = null) => {
    navigator.clipboard.writeText(text);
    if (index !== null) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    }
  };

  return (
    <div id="main-generator-container" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 font-display">Classic Generator</h2>
              <p className="text-xs text-slate-500">Custom ranges & multiple numbers</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => applyPreset(1, 10)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              1-10
            </button>
            <button
              onClick={() => applyPreset(1, 100)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              1-100
            </button>
            <button
              onClick={() => applyPreset(0, 1, true)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              0.0-1.0
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Min Value</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-sm text-slate-800 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Max Value</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-sm text-slate-800 transition-all"
            />
          </div>
        </div>

        {/* Advanced Accordion/Controls */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/80 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Quantity To Draw</label>
              <input
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value))))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-sm text-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Sort Output</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-slate-700 font-medium transition-all h-[38px]"
              >
                <option value="none">Default (Random)</option>
                <option value="asc">Ascending (Low-High)</option>
                <option value="desc">Descending (High-Low)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDecimal}
                onChange={(e) => setIsDecimal(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs text-slate-600 font-medium">Decimals</span>
            </label>

            {isDecimal && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Places:</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={decimalPlaces}
                  onChange={(e) => setDecimalPlaces(Math.max(1, Math.min(5, Number(e.target.value))))}
                  className="w-12 px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-700 text-center"
                />
              </div>
            )}

            {!isDecimal && count > 1 && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!allowDuplicates}
                  onChange={(e) => setAllowDuplicates(!e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs text-slate-600 font-medium">Unique Only</span>
              </label>
            )}
          </div>
        </div>

        {/* Main Generator Visualizer Panel */}
        <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] text-center relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-900/40 to-slate-900 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {count === 1 ? (
              <motion.div
                key={isGenerating ? 'generating' : 'static-single'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center z-10"
              >
                <div className="text-emerald-400 font-mono text-5xl md:text-6xl font-bold tracking-tight select-all drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  {isGenerating ? animatedSingleValue : results[0] ?? '---'}
                </div>
                {!isGenerating && results.length > 0 && (
                  <button
                    onClick={() => copyToClipboard(results[0].toString())}
                    className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full text-xs font-medium transition-all"
                  >
                    {copiedIndex === 0 || copiedAll ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="multi-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full z-10 flex flex-col h-full justify-between"
              >
                {results.length === 0 ? (
                  <div className="text-slate-400 font-mono text-sm">
                    {isGenerating ? 'Rolling multiple numbers...' : 'Click Generate to draw numbers'}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-slate-400 font-mono">Count: {results.length}</span>
                      <button
                        onClick={() => copyToClipboard(results.join(', '))}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-md transition-colors"
                      >
                        {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedAll ? 'Copied List!' : 'Copy All'}</span>
                      </button>
                    </div>
                    
                    <div className="max-h-[120px] overflow-y-auto custom-scrollbar flex flex-wrap gap-2 justify-center py-1">
                      {results.map((val, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: Math.min(idx * 0.01, 0.3) }}
                          onClick={() => copyToClipboard(val.toString(), idx)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all flex items-center gap-1.5 ${
                            copiedIndex === idx
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-200 border border-slate-700/50 hover:border-slate-600'
                          }`}
                        >
                          {val}
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-40 hover:opacity-100" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/10 transition-all text-white relative overflow-hidden active:scale-[0.98] ${
            isGenerating
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="font-display tracking-wide">{isGenerating ? 'Rolling...' : 'Generate Number'}</span>
          <Sparkles className="w-4 h-4 absolute right-6 opacity-30" />
        </button>
      </div>
    </div>
  );
}
