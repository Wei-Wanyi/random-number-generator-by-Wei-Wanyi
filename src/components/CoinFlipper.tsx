/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { HelpCircle, RefreshCw, Award, PieChart } from 'lucide-react';
import { HistoryItem } from '../types';

interface CoinFlipperProps {
  onAddHistory: (item: HistoryItem) => void;
}

export default function CoinFlipper({ onAddHistory }: CoinFlipperProps) {
  const [side, setSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [stats, setStats] = useState({ total: 0, heads: 0, tails: 0 });
  
  const coinControls = useAnimation();

  const handleFlip = async () => {
    if (isFlipping) return;
    setIsFlipping(true);

    const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // Choose rotation degree. Standard flip is multiple full 360-degree spins plus a 180 spin if side changes.
    // Let's spin it 1080 degrees (3 full spins) or 1260 degrees if we end up on the other side.
    const currentIsHeads = side === 'heads';
    const nextIsHeads = outcome === 'heads';
    
    let rotateYTarget = 1440; // 4 full spins
    if (currentIsHeads !== nextIsHeads) {
      rotateYTarget = 1620; // 4.5 spins (reverses side)
    }

    // Trigger the animation sequence
    await coinControls.start({
      y: [-20, -100, -120, -80, 0],
      rotateY: [0, 360, 720, 1080, rotateYTarget],
      scale: [1, 1.2, 1.3, 1.1, 1],
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    });

    setSide(outcome);
    setIsFlipping(false);

    // Update stats
    const newStats = {
      total: stats.total + 1,
      heads: stats.heads + (outcome === 'heads' ? 1 : 0),
      tails: stats.tails + (outcome === 'tails' ? 1 : 0),
    };
    setStats(newStats);

    // Add to history
    onAddHistory({
      id: crypto.randomUUID(),
      type: 'coin',
      timestamp: new Date(),
      summary: `Flipped a Coin: ${outcome.toUpperCase()}`,
      detail: `Stats: Heads ${newStats.heads} (${Math.round((newStats.heads / newStats.total) * 100)}%) | Tails ${newStats.tails} (${Math.round((newStats.tails / newStats.total) * 100)}%)`,
    });

    // Reset rotation position silently to zero so we can trigger again next time
    coinControls.set({ rotateY: 0 });
  };

  const resetStats = () => {
    setStats({ total: 0, heads: 0, tails: 0 });
  };

  const headsPercentage = stats.total > 0 ? Math.round((stats.heads / stats.total) * 100) : 0;
  const tailsPercentage = stats.total > 0 ? Math.round((stats.tails / stats.total) * 100) : 0;

  return (
    <div id="coin-flipper-container" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 font-display">Coin Flipper</h2>
              <p className="text-xs text-slate-500">Interactive flipping animation</p>
            </div>
          </div>
          {stats.total > 0 && (
            <button
              onClick={resetStats}
              className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors"
            >
              Reset Stats
            </button>
          )}
        </div>

        {/* Flipping Arena */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/80 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden mb-6">
          <div style={{ perspective: 1000 }} className="relative w-28 h-28 flex items-center justify-center">
            <motion.div
              animate={coinControls}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-24 h-24 rounded-full relative cursor-pointer active:scale-95 transition-all"
              onClick={handleFlip}
            >
              {/* Heads Side */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className={`absolute inset-0 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition-all ${
                  side === 'heads'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-white'
                    : 'bg-gradient-to-br from-slate-300 to-slate-500 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-xl font-black tracking-wide font-display">H</span>
                <span className="text-[9px] uppercase font-bold tracking-widest mt-0.5 opacity-90">Heads</span>
              </div>

              {/* Tails Side - Rotated 180deg Y so it works during Y flip */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className={`absolute inset-0 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition-all ${
                  side === 'tails'
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 text-white'
                    : 'bg-gradient-to-br from-slate-300 to-slate-500 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-xl font-black tracking-wide font-display">T</span>
                <span className="text-[9px] uppercase font-bold tracking-widest mt-0.5 opacity-90">Tails</span>
              </div>
            </motion.div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Result:</span>
            <span className={`ml-1.5 font-bold text-sm uppercase ${side === 'heads' ? 'text-amber-600' : 'text-slate-600'}`}>
              {side}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/60">
          <div className="text-center p-1">
            <div className="text-xs text-slate-400 font-medium">Flips</div>
            <div className="text-lg font-bold text-slate-700 font-mono mt-0.5">{stats.total}</div>
          </div>
          <div className="text-center p-1 border-x border-slate-100">
            <div className="text-xs text-slate-400 font-medium">Heads</div>
            <div className="text-sm font-bold text-slate-700 font-mono mt-0.5">
              {stats.heads} <span className="text-[10px] text-slate-400 font-normal">({headsPercentage}%)</span>
            </div>
          </div>
          <div className="text-center p-1">
            <div className="text-xs text-slate-400 font-medium">Tails</div>
            <div className="text-sm font-bold text-slate-700 font-mono mt-0.5">
              {stats.tails} <span className="text-[10px] text-slate-400 font-normal">({tailsPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleFlip}
          disabled={isFlipping}
          className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/10 transition-all text-white relative active:scale-[0.98] ${
            isFlipping
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/20'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${isFlipping ? 'animate-spin' : ''}`} />
          <span className="font-display tracking-wide">{isFlipping ? 'Flipping...' : 'Flip Coin'}</span>
        </button>
      </div>
    </div>
  );
}
