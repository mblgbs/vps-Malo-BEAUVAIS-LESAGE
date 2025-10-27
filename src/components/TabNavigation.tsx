import React from 'react';

type Tab = 'upgrades' | 'shop';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onTabChange('upgrades')}
        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
          activeTab === 'upgrades'
            ? 'bg-purple-500 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        ⚡ Améliorations
      </button>
      <button
        onClick={() => onTabChange('shop')}
        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
          activeTab === 'shop'
            ? 'bg-blue-500 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        🛒 Clic Shop
      </button>
    </div>
  );
};
