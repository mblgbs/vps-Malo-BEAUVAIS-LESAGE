import React from 'react';
import { Building, PlayerBuilding } from '../lib/supabase';
import { BuildingCard } from './BuildingCard';

interface BuildingsListProps {
  buildings: Building[];
  playerBuildings: PlayerBuilding[];
  currentCoins: number;
  onPurchase: (building: Building) => void;
  calculateBuildingCost: (building: Building, quantity: number) => number;
}

export const BuildingsList: React.FC<BuildingsListProps> = ({
  buildings,
  playerBuildings,
  currentCoins,
  onPurchase,
  calculateBuildingCost
}) => {
  const getPlayerBuilding = (buildingId: string) => {
    return playerBuildings.find(pb => pb.building_id === buildingId);
  };

  const isUnlocked = (building: Building) => {
    if (building.unlock_order === 1) return true;

    const previousBuilding = buildings.find(b => b.unlock_order === building.unlock_order - 1);
    if (!previousBuilding) return false;

    const playerHasPrevious = playerBuildings.some(pb => pb.building_id === previousBuilding.id);
    return playerHasPrevious;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">Bâtiments</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {buildings.map(building => {
          const playerBuilding = getPlayerBuilding(building.id);
          const cost = calculateBuildingCost(building, playerBuilding?.quantity || 0);
          const canAfford = currentCoins >= cost;
          const unlocked = isUnlocked(building);

          return (
            <BuildingCard
              key={building.id}
              building={building}
              playerBuilding={playerBuilding}
              cost={cost}
              canAfford={canAfford}
              onPurchase={() => onPurchase(building)}
              isUnlocked={unlocked}
            />
          );
        })}
      </div>
    </div>
  );
};
