import React from 'react';
import { Player } from '../lib/supabase';

interface PlayerStatsProps {
  player: Player;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(0);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-400 mb-1">{player.username}</h2>
          <p className="text-slate-400 text-sm">Niveau {Math.floor(player.total_clicks / 100) + 1}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
            <span className="text-slate-300">ClicCoins</span>
            <span className="text-2xl font-bold text-amber-400">
              {formatNumber(player.clic_coins)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
            <span className="text-slate-300">Par seconde</span>
            <span className="text-lg font-semibold text-green-400">
              +{formatNumber(player.coins_per_second)}/s
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
            <span className="text-slate-300">Clics totaux</span>
            <span className="text-lg font-semibold text-blue-400">
              {formatNumber(player.total_clicks)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
