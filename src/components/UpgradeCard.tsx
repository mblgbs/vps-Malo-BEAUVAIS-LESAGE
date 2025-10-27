import React from 'react';
import { Upgrade, PlayerUpgrade } from '../lib/supabase';

interface UpgradeCardProps {
  upgrade: Upgrade;
  isPurchased: boolean;
  canAfford: boolean;
  onPurchase: () => void;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  upgrade,
  isPurchased,
  canAfford,
  onPurchase
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(0);
  };

  const getUpgradeIcon = (type: string) => {
    switch (type) {
      case 'click_power': return '👆';
      case 'building_boost': return '🏗️';
      case 'global_boost': return '🌟';
      case 'category_boost': return '📊';
      default: return '⚡';
    }
  };

  const getMultiplierText = (multiplier: number) => {
    if (multiplier >= 2) {
      return `x${multiplier}`;
    }
    return `+${((multiplier - 1) * 100).toFixed(0)}%`;
  };

  if (isPurchased) {
    return (
      <div className="bg-green-900/20 rounded-lg p-4 border-2 border-green-500/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getUpgradeIcon(upgrade.upgrade_type)}</span>
          <div className="flex-1">
            <h3 className="font-bold text-green-400 text-sm">{upgrade.name}</h3>
            <p className="text-xs text-slate-400">{upgrade.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
              {getMultiplierText(upgrade.multiplier)}
            </span>
            <span className="text-green-500 text-xl">✓</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-lg p-4 border border-slate-700 transition-all ${
      canAfford ? 'hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20' : ''
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{getUpgradeIcon(upgrade.upgrade_type)}</span>
        <div className="flex-1">
          <h3 className="font-bold text-white text-sm">{upgrade.name}</h3>
          <p className="text-xs text-slate-400 mb-2">{upgrade.description}</p>
          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold">
            {getMultiplierText(upgrade.multiplier)}
          </span>
        </div>
      </div>

      <button
        onClick={onPurchase}
        disabled={!canAfford}
        className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
          canAfford
            ? 'bg-purple-500 hover:bg-purple-600 text-white'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        Acheter: {formatNumber(upgrade.cost)} 🪙
      </button>
    </div>
  );
};
