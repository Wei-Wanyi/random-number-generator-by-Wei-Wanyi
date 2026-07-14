/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Sparkles, Dices, Award, RefreshCcw } from 'lucide-react';
import { HistoryItem, DiceRollResult } from '../types';

interface DiceRollerProps {
  onAddHistory: (item: HistoryItem) => void;
}

const DICE_TYPES = [
  { label: 'D4', max: 4, shape: 'triangle' },
  { label: 'D6', max: 6, shape: 'cube' },
  { label: 'D8', max: 8, shape: 'diamond' },
  { label: 'D10', max: 10, shape: 'kite' },
  { label: 'D12', max: 12, shape: 'pentagon' },
  { label: 'D20', max: 20, shape: 'icosahedron' },
  { label: 'D100', max: 100, shape: 'circle' },
] as const;

export default function DiceRoller({ onAddHistory }: DiceRollerProps) {
  const [diceCount, setDiceCount] = useState<number>(2);
  const [selectedDiceType, setSelectedDiceType] = useState<typeof DICE_TYPES[number]>(DICE_TYPES[1]); // D6
  const [rolls, setRolls] = useState<number[]>([3, 4]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const controls = useAnimation();

  const handleRoll = async () => {
    setIsRolling(true);

    // Trigger physical shaking animation
    await controls.start({
      x: [0, -12, 12, -8, 8, -4, 4, 0],
      y: [0, 8, -8, 6, -6, 4, -4, 0],
      rotate: [0, -15, 15, -10, 10, -5, 5, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    });

    const newRolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      const val = Math.floor(Math.random() * selectedDiceType.max) + 1;
      newRolls.push(val);
    }

    setRolls(newRolls);
    setIsRolling(false);

    // Calculate sum for history
    const sum = newRolls.reduce((a, b) => a + b, 0);
    const summary = `Rolled ${diceCount}x ${selectedDiceType.label}: Total ${sum}`;
    const detail = `Values: [${newRolls.join(', ')}] | Avg: ${(sum / diceCount).toFixed(1)}`;

    onAddHistory({
      id: crypto.randomUUID(),
      type: 'dice',
      timestamp: new Date(),
      summary,
      detail,
    });
  };

  const getD6Dots = (value: number) => {
    const dotPositions: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    return dotPositions[value] || [];
  };

  const renderDiceFace = (value: number) => {
    if (selectedDiceType.label === 'D6') {
      const activeDots = getD6Dots(value);
      return (
        <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl shadow-md p-2.5 grid grid-cols-3 grid-rows-3 gap-1 relative">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {activeDots.includes(i) && (
                <div className="w-3 h-3 bg-slate-800 rounded-full" />
              )}
            </div>
          ))}
        </div>
      );
    }

    // Other shapes drawn with beautiful pure Tailwind SVG or background containers
    let clipPathClass = '';
    let bgGradient = '';

    switch (selectedDiceType.shape) {
      case 'triangle':
        clipPathClass = 'polygon-triangle';
        bgGradient = 'from-rose-500 to-orange-500';
        break;
      case 'diamond':
        clipPathClass = 'polygon-diamond';
        bgGradient = 'from-cyan-500 to-blue-600';
        break;
      case 'kite':
        clipPathClass = 'polygon-kite';
        bgGradient = 'from-violet-500 to-purple-600';
        break;
      case 'pentagon':
        clipPathClass = 'polygon-pentagon';
        bgGradient = 'from-amber-500 to-yellow-600';
        break;
      case 'icosahedron':
        clipPathClass = 'polygon-icosahedron';
        bgGradient = 'from-emerald-500 to-teal-600';
        break;
      case 'circle':
        clipPathClass = 'rounded-full';
        bgGradient = 'from-indigo-500 to-purple-600';
        break;
      default:
        clipPathClass = 'rounded-2xl';
        bgGradient = 'from-slate-600 to-slate-800';
    }

    return (
      <div className="w-16 h-16 relative flex items-center justify-center">
        {selectedDiceType.shape === 'triangle' ? (
          <svg className="w-16 h-16 drop-shadow-md text-slate-800" viewBox="0 0 100 100">
            <polygon points="50,10 90,85 10,85" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
            <text x="50" y="68" fill="#1e293b" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {value}
            </text>
          </svg>
        ) : selectedDiceType.shape === 'diamond' ? (
          <svg className="w-16 h-16 drop-shadow-md text-slate-800" viewBox="0 0 100 100">
            <polygon points="50,5 90,50 50,95 10,50" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
            <text x="50" y="58" fill="#1e293b" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {value}
            </text>
          </svg>
        ) : selectedDiceType.shape === 'kite' ? (
          <svg className="w-16 h-16 drop-shadow-md text-slate-800" viewBox="0 0 100 100">
            <polygon points="50,5 95,35 50,95 5,35" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
            <text x="50" y="55" fill="#1e293b" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {value}
            </text>
          </svg>
        ) : selectedDiceType.shape === 'pentagon' ? (
          <svg className="w-16 h-16 drop-shadow-md text-slate-800" viewBox="0 0 100 100">
            <polygon points="50,5 95,38 78,92 22,92 5,38" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
            <text x="50" y="58" fill="#1e293b" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {value}
            </text>
          </svg>
        ) : selectedDiceType.shape === 'icosahedron' ? (
          <svg className="w-16 h-16 drop-shadow-md text-slate-800" viewBox="0 0 100 100">
            <polygon points="50,5 92,27 92,73 50,95 8,73 8,27" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="3" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="8" y1="27" x2="92" y2="27" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="8" y1="73" x2="92" y2="73" stroke="#cbd5e1" strokeWidth="1" />
            <text x="50" y="58" fill="#1e293b" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {value}
            </text>
          </svg>
        ) : (
          <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-full shadow-md flex items-center justify-center">
            <span className="text-slate-800 font-bold font-mono text-lg">{value}</span>
          </div>
        )}
      </div>
    );
  };

  const totalSum = rolls.reduce((a, b) => a + b, 0);

  return (
    <div id="dice-roller-container" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Dices className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 font-display">Dice Roller</h2>
            <p className="text-xs text-slate-500">Roll single or multiple polyhedral dice</p>
          </div>
        </div>

        {/* Configurations */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Select Dice Type</label>
            <div className="grid grid-cols-4 gap-1.5 md:grid-cols-7">
              {DICE_TYPES.map((type) => (
                <button
                  key={type.label}
                  onClick={() => setSelectedDiceType(type)}
                  className={`py-2 text-xs font-semibold rounded-lg font-mono transition-all text-center ${
                    selectedDiceType.label === type.label
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Number of Dice</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setDiceCount(num)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    diceCount === num
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dice Visual Screen */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/80 min-h-[140px] flex flex-col justify-center items-center relative overflow-hidden">
          <motion.div
            animate={controls}
            className="flex flex-wrap gap-4 justify-center items-center"
          >
            {rolls.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="transform"
              >
                {renderDiceFace(val)}
              </motion.div>
            ))}
          </motion.div>

          {rolls.length > 0 && !isRolling && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sum: <strong className="text-slate-800 font-mono">{totalSum}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Avg: <strong className="text-slate-800 font-mono">{(totalSum / rolls.length).toFixed(1)}</strong></span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/10 transition-all text-white relative active:scale-[0.98] ${
            isRolling
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/20'
          }`}
        >
          <RefreshCcw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
          <span className="font-display tracking-wide">{isRolling ? 'Rolling Dice...' : 'Roll Dice'}</span>
          <Sparkles className="w-4 h-4 absolute right-6 opacity-30" />
        </button>
      </div>
    </div>
  );
}
