/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, List, RefreshCw, Trophy, Shuffle, Plus, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';

interface ListPickerProps {
  onAddHistory: (item: HistoryItem) => void;
}

const PRESETS = [
  { name: 'Decision (Yes/No)', items: 'Yes\nNo\nMaybe\nAsk Again Later' },
  { name: 'Lunch Picker', items: 'Pizza 🍕\nSushi 🍣\nBurgers 🍔\nSalad 🥗\nTacos 🌮\nPasta 🍝' },
  { name: 'Chore Assigner', items: 'Wash Dishes 🍽️\nVacuum Floor 🧹\nTake out Trash 🗑️\nLaundry 🧺\nWater Plants 🪴' },
];

export default function ListPicker({ onAddHistory }: ListPickerProps) {
  const [inputText, setInputText] = useState<string>(PRESETS[0].items);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  // Parse list options from lines or commas
  const getOptions = (): string[] => {
    return inputText
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const handleShuffle = () => {
    const options = getOptions();
    if (options.length <= 1) return;

    // Fisher-Yates shuffle
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setInputText(shuffled.join('\n'));
    setWinner(null);
  };

  const handlePick = () => {
    const options = getOptions();
    if (options.length === 0) {
      alert('Please enter at least one item to pick from.');
      return;
    }
    if (options.length === 1) {
      setWinner(options[0]);
      return;
    }

    setIsPicking(true);
    setWinner(null);
    setHighlightedIndex(0);

    // Dynamic roulette cycle
    let currentIndex = 0;
    let speed = 40; // starting speed in ms
    const maxSpeed = 400; // decelerate target
    const totalDuration = 1800; // total animation time ms
    let elapsed = 0;

    const runCycle = () => {
      setHighlightedIndex(currentIndex);
      currentIndex = (currentIndex + 1) % options.length;
      elapsed += speed;

      if (elapsed >= totalDuration) {
        // pick winner randomly
        const finalWinnerIdx = Math.floor(Math.random() * options.length);
        setHighlightedIndex(finalWinnerIdx);
        setWinner(options[finalWinnerIdx]);
        setIsPicking(false);

        // Add history log
        onAddHistory({
          id: crypto.randomUUID(),
          type: 'list',
          timestamp: new Date(),
          summary: `Picked from List: "${options[finalWinnerIdx]}"`,
          detail: `Selected from ${options.length} options: [${options.slice(0, 5).join(', ')}${options.length > 5 ? '...' : ''}]`,
        });
      } else {
        // Slow down the cycles gradually (ease-out deceleration curve)
        speed = 40 + Math.pow(elapsed / totalDuration, 2.5) * 350;
        setTimeout(runCycle, speed);
      }
    };

    setTimeout(runCycle, speed);
  };

  const handleClear = () => {
    setInputText('');
    setWinner(null);
    setHighlightedIndex(null);
  };

  const loadPreset = (presetText: string) => {
    setInputText(presetText);
    setWinner(null);
    setHighlightedIndex(null);
  };

  const options = getOptions();

  return (
    <div id="list-picker-container" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <List className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 font-display">List Picker</h2>
              <p className="text-xs text-slate-500">Pick items or shuffle lists</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-50 rounded-lg transition-colors"
              title="Shuffle items"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-lg transition-colors"
              title="Clear items"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset selections */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider self-center mr-1">Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset.items)}
              className="px-2 py-1 text-[10px] font-semibold text-purple-600 bg-purple-50/60 hover:bg-purple-100/80 rounded-md transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Text Input Arena */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Enter options (one per line)</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type items here...&#10;Pizza&#10;Burger&#10;Sushi"
            rows={4}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-sans text-sm text-slate-800 transition-all resize-none"
          />
        </div>

        {/* Display / Animation Roulette Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/80 min-h-[140px] flex flex-col justify-center items-center relative overflow-hidden">
          {isPicking ? (
            <div className="w-full flex flex-col items-center justify-center">
              <div className="text-xs text-purple-500 animate-pulse font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Cycling Choices
              </div>
              <div className="px-5 py-2.5 bg-white border border-purple-100 shadow-sm rounded-xl text-slate-800 font-bold font-display text-lg text-center truncate max-w-full">
                {options[highlightedIndex ?? 0] || '---'}
              </div>
            </div>
          ) : winner ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center z-10"
            >
              <div className="p-2 bg-purple-100 text-purple-600 rounded-full mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Selected Winner</span>
              <div className="text-xl md:text-2xl font-black text-slate-800 font-display mt-1 drop-shadow-sm truncate max-w-full px-4">
                {winner}
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-slate-400 font-medium text-xs">
              {options.length > 0 
                ? `Loaded ${options.length} options. Click Pick Winner to start.`
                : 'Add some options above to spin the wheel!'}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handlePick}
          disabled={isPicking || options.length === 0}
          className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-purple-500/10 transition-all text-white relative active:scale-[0.98] ${
            isPicking
              ? 'bg-slate-700 cursor-not-allowed'
              : options.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-100'
              : 'bg-purple-600 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/20'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${isPicking ? 'animate-pulse' : ''}`} />
          <span className="font-display tracking-wide">{isPicking ? 'Selecting...' : 'Pick Winner'}</span>
        </button>
      </div>
    </div>
  );
}
