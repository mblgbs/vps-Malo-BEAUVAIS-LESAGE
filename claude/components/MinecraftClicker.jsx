import React, { useState, useEffect } from 'react';
import { Pickaxe, Coins, TrendingDown, Flame } from 'lucide-react';

export default function MinecraftClicker() {
  const [coins, setCoins] = useState(0);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0);
  const [reputation, setReputation] = useState(100);
  const [reputationPerSecond, setReputationPerSecond] = useState(0);
  const [climateImpact, setClimateImpact] = useState(0);
  const [climatePerSecond, setClimatePerSecond] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [particles, setParticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInput, setLoginInput] = useState('');

  // Bâtiments
  const [buildings, setBuildings] = useState([
    {
      id: 'google',
      name: 'Google',
      icon: '🔍',
      description: 'IA qui remplace les travailleurs humains. Développée par une grande entreprise de recherche.',
      owned: 0,
      price: 15,
      revenue: 0.3,
      reputationCost: -0.5,
      climateCost: 0.2
    },
    {
      id: 'amazon',
      name: 'Amazonia Corp',
      icon: '📦',
      description: 'Géant du e-commerce qui influence les politiques pour maximiser ses profits.',
      owned: 0,
      price: 100,
      revenue: 2,
      reputationCost: -2,
      climateCost: 0.5
    },
    {
      id: 'meta',
      name: 'Métaverse Inc.',
      icon: '👥',
      description: 'Réseau social qui collecte les données personnelles et manipule l\'opinion.',
      owned: 0,
      price: 300,
      revenue: 5,
      reputationCost: -1,
      climateCost: 1
    },
    {
      id: 'apple',
      name: 'Systèmes Appel',
      icon: '🍎',
      description: 'Géant de la tech expert en optimisation fiscale agressive.',
      owned: 0,
      price: 800,
      revenue: 12,
      reputationCost: -5,
      climateCost: 0
    },
    {
      id: 'tesla',
      name: 'Moteurs Teslactric',
      icon: '⚡',
      description: 'Constructeur automobile qui promet une révolution verte tout en exploitant ses travailleurs.',
      owned: 0,
      price: 1500,
      revenue: 15,
      reputationCost: -3,
      climateCost: 0.8
    },
    {
      id: 'openai',
      name: 'OpenMind Corp',
      icon: '🤖',
      description: 'Startup d\'IA qui prétend être éthique mais privilégie le profit à tout prix.',
      owned: 0,
      price: 3000,
      revenue: 20,
      reputationCost: -4,
      climateCost: 1.5
    }
  ]);

  // Améliorations
  const upgrades = [
    { id: 'u1', emoji: '🍉', name: 'Pastèque', price: 100 },
    { id: 'u2', emoji: '🥩', name: 'Steak', price: 200 },
    { id: 'u3', emoji: '🏹', name: 'Arc', price: 300 },
    { id: 'u4', emoji: '⚔️', name: 'Épée Or', price: 400 },
    { id: 'u5', emoji: '🔱', name: 'Trident', price: 500 },
    { id: 'u6', emoji: '🧨', name: 'TNT', price: 600 },
    { id: 'u7', emoji: '❓', name: '???', price: 999 },
    { id: 'u8', emoji: '🧪', name: 'Potion', price: 800 }
  ];

  const [purchasedUpgrades, setPurchasedUpgrades] = useState([]);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const loadGame = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const savedUsername = await window.storage.get('username');
        if (savedUsername) {
          setUsername(savedUsername.value);
          setIsLoggedIn(true);
          
          // Charger les données du jeu
          const savedData = await window.storage.get(`gameData_${savedUsername.value}`);
          if (savedData) {
            const data = JSON.parse(savedData.value);
            setCoins(data.coins || 0);
            setCoinsPerSecond(data.coinsPerSecond || 0);
            setClickPower(data.clickPower || 1);
            setBuildings(data.buildings || buildings);
            setPurchasedUpgrades(data.purchasedUpgrades || []);
            setReputationPerSecond(data.reputationPerSecond || 0);
            setClimatePerSecond(data.climatePerSecond || 0);
          }
        }
      } catch (error) {
        console.log('Aucune sauvegarde trouvée');
      }
      setIsLoading(false);
    };
    loadGame();
  }, []);

  // Sauvegarder automatiquement toutes les 5 secondes
  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    
    const saveInterval = setInterval(async () => {
      try {
        const gameData = {
          coins,
          coinsPerSecond,
          clickPower,
          buildings,
          purchasedUpgrades,
          reputationPerSecond,
          climatePerSecond,
          lastSaved: Date.now()
        };
        await window.storage.set(`gameData_${username}`, JSON.stringify(gameData));
      } catch (error) {
        console.error('Erreur de sauvegarde:', error);
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [coins, coinsPerSecond, clickPower, buildings, purchasedUpgrades, reputationPerSecond, climatePerSecond, isLoading, isLoggedIn, username]);

  // Mise à jour des ressources
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + coinsPerSecond / 10);
      setReputation(prev => Math.max(0, Math.min(100, prev + reputationPerSecond / 10)));
      setClimateImpact(prev => Math.min(100, prev + climatePerSecond / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [coinsPerSecond, reputationPerSecond, climatePerSecond]);

  const handleClick = (e) => {
    setCoins(prev => prev + clickPower);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      value: clickPower
    };
    
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  const buyBuilding = (building) => {
    if (coins >= building.price) {
      setCoins(prev => prev - building.price);
      
      setBuildings(prev => prev.map(b => 
        b.id === building.id 
          ? { ...b, owned: b.owned + 1, price: Math.floor(b.price * 1.15) }
          : b
      ));
      
      setCoinsPerSecond(prev => prev + building.revenue);
      setReputationPerSecond(prev => prev + building.reputationCost);
      setClimatePerSecond(prev => prev + building.climateCost);
    }
  };

  const buyUpgrade = (upgrade) => {
    if (coins >= upgrade.price && !purchasedUpgrades.includes(upgrade.id)) {
      setCoins(prev => prev - upgrade.price);
      setPurchasedUpgrades(prev => [...prev, upgrade.id]);
      setClickPower(prev => prev + 1);
    }
  };

  const resetGame = async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser votre partie ?')) {
      try {
        await window.storage.delete(`gameData_${username}`);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
      }
    }
  };

  const handleLogin = async () => {
    if (loginInput.trim()) {
      try {
        await window.storage.set('username', loginInput.trim());
        setUsername(loginInput.trim());
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginInput('');
      } catch (error) {
        console.error('Erreur de connexion:', error);
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        await window.storage.delete('username');
        window.location.reload();
      } catch (error) {
        console.error('Erreur de déconnexion:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-2xl">Chargement...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
          <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center" style={{textShadow: '2px 2px 0 #000'}}>
            CLICKER GAME
          </h1>
          <p className="text-gray-300 mb-6 text-center">
            Connectez-vous pour commencer à jouer et sauvegarder votre progression
          </p>
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Entrez votre pseudo"
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleLogin}
            disabled={!loginInput.trim()}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CONNEXION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white font-mono overflow-hidden">
      {/* Panneau gauche - Clicker */}
      <div className="w-96 bg-gradient-to-b from-red-900 to-red-950 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-5xl font-bold text-yellow-400" style={{textShadow: '3px 3px 0 #000'}}>
            CLICKER
          </h1>
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded"
          >
            Reset
          </button>
        </div>
        
        {/* Info utilisateur */}
        <div className="bg-black/30 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Connecté en tant que</div>
            <div className="text-sm font-bold text-yellow-400">{username}</div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
          >
            Déconnexion
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Zone de clic avec pomme */}
          <button
            onClick={handleClick}
            className="relative w-64 h-64 hover:scale-105 transition-transform cursor-pointer mb-6"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute top-8 left-12 w-12 h-12 bg-red-400 rounded-full opacity-60"></div>
                <div className="absolute inset-0 bg-red-600 rounded-full shadow-2xl"></div>
                <div className="absolute top-6 left-10 w-16 h-16 bg-gradient-to-br from-red-300 to-transparent rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-3 h-8 bg-amber-800 rounded"></div>
                <div className="absolute top-0 left-1/2 translate-x-2 -translate-y-2 w-8 h-6 bg-green-600 rounded-full transform rotate-45"></div>
                <div className="absolute -bottom-8 -right-8 bg-white rounded p-2">
                  <Pickaxe className="w-8 h-8 text-gray-800" />
                </div>
              </div>
            </div>
            
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute text-yellow-400 font-bold text-2xl pointer-events-none animate-ping"
                style={{
                  left: particle.x,
                  top: particle.y,
                  animation: 'float 1s ease-out'
                }}
              >
                +{particle.value}
              </div>
            ))}
          </button>

          {/* Compteur */}
          <div className="w-full bg-black/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl">🪙</span>
              <span className="text-5xl font-bold text-yellow-400">{Math.floor(coins)}</span>
            </div>
            <div className="text-yellow-600 text-sm text-center">
              Par seconde: <span className="text-2xl font-bold">{coinsPerSecond.toFixed(2)}</span>
            </div>
          </div>

          {/* Particules décoratives */}
          <div className="absolute top-20 left-10 w-12 h-12 bg-red-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-16 h-16 bg-red-600 rounded-full blur-xl opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>

      {/* Panneau central - Shop */}
      <div className="flex-1 bg-gradient-to-b from-blue-900 to-blue-950 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-yellow-400 mb-8" style={{textShadow: '3px 3px 0 #000'}}>
            SHOP
          </h2>

          {/* Améliorations */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">AMÉLIORATIONS</h3>
            <div className="bg-blue-800 p-6 rounded-lg">
              <div className="grid grid-cols-8 gap-3">
                {upgrades.map(upgrade => (
                  <button
                    key={upgrade.id}
                    onClick={() => buyUpgrade(upgrade)}
                    disabled={coins < upgrade.price || purchasedUpgrades.includes(upgrade.id)}
                    className={`bg-gray-700 hover:bg-gray-600 rounded p-3 text-center transition-all ${
                      purchasedUpgrades.includes(upgrade.id) ? 'opacity-30' : ''
                    } ${coins < upgrade.price ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-4xl mb-1">{upgrade.emoji}</div>
                    <div className="text-xs text-yellow-400">{upgrade.price}🪙</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau droit - Bâtiments */}
      <div className="w-96 bg-gradient-to-b from-red-900 to-red-950 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4" style={{textShadow: '2px 2px 0 #000'}}>
          BÂTIMENTS
        </h2>

        <div className="space-y-3">
          {buildings.map(building => (
            <div
              key={building.id}
              className={`bg-gray-800 rounded-lg p-3 ${
                coins >= building.price ? 'hover:bg-gray-700 cursor-pointer' : 'opacity-50'
              }`}
              onClick={() => buyBuilding(building)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-3xl">{building.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm">{building.name}</div>
                  <div className="bg-white text-black px-2 py-0.5 rounded text-xs font-bold inline-block">
                    Possédé: {building.owned}
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-300 mb-2 leading-tight">
                {building.description}
              </p>
              
              <div className="text-xs space-y-1 mb-2">
                <div className="text-green-400">Revenus: +{building.revenue} $/s</div>
              </div>
              
              <button
                disabled={coins < building.price}
                className={`w-full py-1.5 rounded text-sm font-bold ${
                  coins >= building.price
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Acheter ({building.price.toFixed(2)} $)
              </button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}