import React, { useState } from 'react';

interface ClickButtonProps {
  onClick: () => void;
  coinsPerClick: number;
}

export const ClickButton: React.FC<ClickButtonProps> = ({ onClick, coinsPerClick }) => {
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = () => {
    setIsClicking(true);
    onClick();
    setTimeout(() => setIsClicking(false), 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        className={`relative w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl transform transition-all duration-100 hover:scale-105 active:scale-95 ${
          isClicking ? 'scale-95' : ''
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
        <div className="relative flex items-center justify-center h-full">
          <span className="text-5xl">🍖</span>
        </div>
      </button>
      <div className="text-center">
        <p className="text-sm text-slate-400">+{coinsPerClick.toFixed(1)} par clic</p>
      </div>
    </div>
  );
};
