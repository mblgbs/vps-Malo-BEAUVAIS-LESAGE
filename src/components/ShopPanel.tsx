import React from 'react';

export const ShopPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-6 text-center border-2 border-dashed border-slate-700">
        <span className="text-6xl mb-4 block">🛒</span>
        <h3 className="text-xl font-bold text-white mb-2">Clic Shop</h3>
        <p className="text-slate-400 text-sm">
          Le magasin avec des objets spéciaux sera bientôt disponible!
        </p>
        <p className="text-slate-500 text-xs mt-3">
          Continuez à améliorer vos bâtiments pour débloquer des articles exclusifs
        </p>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h4 className="font-bold text-amber-400 mb-2 text-sm">Aperçu des articles à venir:</h4>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex items-center gap-2">
            <span>✨</span>
            <span>Multiplicateur x2 temporaire</span>
          </li>
          <li className="flex items-center gap-2">
            <span>💰</span>
            <span>Coffres de ClicCoins</span>
          </li>
          <li className="flex items-center gap-2">
            <span>🚀</span>
            <span>Boost de production</span>
          </li>
          <li className="flex items-center gap-2">
            <span>🎨</span>
            <span>Skins exclusifs pour les namuus</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
