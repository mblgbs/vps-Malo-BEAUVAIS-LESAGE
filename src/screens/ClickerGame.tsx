import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { PlayerStats } from '../components/PlayerStats';
import { ClickButton } from '../components/ClickButton';
import { BuildingsList } from '../components/BuildingsList';
import { UpgradesList } from '../components/UpgradesList';
import { TabNavigation } from '../components/TabNavigation';
import { ShopPanel } from '../components/ShopPanel';

type Tab = 'upgrades' | 'shop';

export const ClickerGame: React.FC = () => {
  const {
    player,
    buildings,
    playerBuildings,
    upgrades,
    playerUpgrades,
    loading,
    handleClick,
    purchaseBuilding,
    purchaseUpgrade,
    calculateBuildingCost
  } = useGameState();

  const [activeTab, setActiveTab] = useState<Tab>('upgrades');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-white text-xl font-semibold">Chargement du Clicker...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Erreur de chargement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Le Clicker
          </h1>
          <p className="text-slate-400 text-sm">Nourrissez les namuus et récoltez des ClicCoins!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <PlayerStats player={player} />
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 flex flex-col items-center">
              <ClickButton
                onClick={handleClick}
                coinsPerClick={player.coins_per_click}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="max-h-[600px] overflow-y-auto pr-2">
                {activeTab === 'upgrades' && (
                  <UpgradesList
                    upgrades={upgrades}
                    playerUpgrades={playerUpgrades}
                    currentCoins={player.clic_coins}
                    onPurchase={purchaseUpgrade}
                  />
                )}

                {activeTab === 'shop' && (
                  <ShopPanel />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <BuildingsList
              buildings={buildings}
              playerBuildings={playerBuildings}
              currentCoins={player.clic_coins}
              onPurchase={purchaseBuilding}
              calculateBuildingCost={calculateBuildingCost}
            />
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>Inspiré par le Clicker de Paladium</p>
          <p className="mt-1">Géré par les namuus - Merci à Arty! 🐾</p>
        </footer>
      </div>
    </div>
  );
};
