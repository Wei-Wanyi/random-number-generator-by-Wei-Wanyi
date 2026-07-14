/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Clock, Hash, Dices, HelpCircle, List, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryLogProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export default function HistoryLog({ history, onClearHistory }: HistoryLogProps) {
  const getIcon = (type: HistoryItem['type']) => {
    switch (type) {
      case 'number':
        return (
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Hash className="w-4 h-4" />
          </div>
        );
      case 'dice':
        return (
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Dices className="w-4 h-4" />
          </div>
        );
      case 'coin':
        return (
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </div>
        );
      case 'list':
        return (
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <List className="w-4 h-4" />
          </div>
        );
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div id="history-log-container" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col h-full max-h-[500px] md:max-h-none">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700 font-display">Activity History</h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50/50 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2.5 min-h-[160px]">
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10">
              <Clock className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-xs font-medium">No activity yet</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Your rolls will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-start justify-between gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {getIcon(item.type)}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 font-display truncate">
                      {item.summary}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-relaxed truncate">
                      {item.detail}
                    </p>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 font-mono font-medium self-center whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-slate-100">
                  {formatTime(item.timestamp)}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
