import React from 'react';
import { Building, PlayerBuilding } from '../lib/supabase';

interface BuildingCardProps {
  building: Building;
  playerBuilding?: PlayerBuilding;
  cost: number;
  canAfford: boolean;
  onPurchase: () => void;
  isUnlocked: boolean;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  playerBuilding,
  cost,
  canAfford,
  onPurchase,
  isUnlocked
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(0);
  };

  const quantity = playerBuilding?.quantity || 0;
  const production = building.base_production * quantity;

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'mining': return '⛏️';
      case 'nature': return '🌳';
      case 'farming': return '🌾';
      case 'industrial': return '🏭';
      case 'research': return '🔬';
      case 'mystical': return '🔮';
      case 'dimensional': return '🌀';
      default: return '🏢';
    }
  };

  if (!isUnlocked) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 opacity-50">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔒</span>
          <div>
            <h3 className="font-bold text-slate-500">Bâtiment verrouillé</h3>
            <p className="text-xs text-slate-600">Acheter le précédent pour débloquer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-lg p-4 border border-slate-700 transition-all ${
      canAfford ? 'hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">{getCategoryEmoji(building.category)}</span>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm">{building.name}</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{building.description}</p>
          </div>
        </div>
        {quantity > 0 && (
          <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs font-bold">
            x{quantity}
          </span>
        )}
      </div>

      {quantity > 0 && (
        <div className="mb-3 py-2 px-3 bg-slate-900/50 rounded">
          <p className="text-xs text-slate-300">
            Production: <span className="text-green-400 font-semibold">+{formatNumber(production)}/s</span>
          </p>
        </div>
      )}

      <button
        onClick={onPurchase}
        disabled={!canAfford}
        className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
          canAfford
            ? 'bg-amber-500 hover:bg-amber-600 text-white'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        Acheter: {formatNumber(cost)} 🪙
      </button>
    </div>
  );
};
