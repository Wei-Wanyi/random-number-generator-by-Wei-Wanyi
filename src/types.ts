/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HistoryItem {
  id: string;
  type: 'number' | 'dice' | 'coin' | 'list';
  timestamp: Date;
  summary: string;
  detail: string;
}

export interface DiceRollResult {
  value: number;
  type: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
}
