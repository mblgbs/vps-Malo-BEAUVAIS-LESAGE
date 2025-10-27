import React from 'react';
import { Upgrade, PlayerUpgrade } from '../lib/supabase';
import { UpgradeCard } from './UpgradeCard';

interface UpgradesListProps {
  upgrades: Upgrade[];
  playerUpgrades: PlayerUpgrade[];
  currentCoins: number;
  onPurchase: (upgrade: Upgrade) => void;
}

export const UpgradesList: React.FC<UpgradesListProps> = ({
  upgrades,
  playerUpgrades,
  currentCoins,
  onPurchase
}) => {
  const isPurchased = (upgradeId: string) => {
    return playerUpgrades.some(pu => pu.upgrade_id === upgradeId);
  };

  const availableUpgrades = upgrades.filter(u => !isPurchased(u.id));
  const purchasedUpgrades = upgrades.filter(u => isPurchased(u.id));

  return (
    <div className="space-y-6">
      {availableUpgrades.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Améliorations disponibles</h3>
          <div className="space-y-3">
            {availableUpgrades.map(upgrade => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                isPurchased={false}
                canAfford={currentCoins >= upgrade.cost}
                onPurchase={() => onPurchase(upgrade)}
              />
            ))}
          </div>
        </div>
      )}

      {purchasedUpgrades.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-green-400 mb-3">Améliorations achetées</h3>
          <div className="space-y-3">
            {purchasedUpgrades.map(upgrade => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                isPurchased={true}
                canAfford={false}
                onPurchase={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
