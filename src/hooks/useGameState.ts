import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, Player, Building, PlayerBuilding, Upgrade, PlayerUpgrade } from '../lib/supabase';

const DEMO_PLAYER_ID = '00000000-0000-0000-0000-000000000001';

export const useGameState = () => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [playerBuildings, setPlayerBuildings] = useState<PlayerBuilding[]>([]);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [playerUpgrades, setPlayerUpgrades] = useState<PlayerUpgrade[]>([]);
  const [loading, setLoading] = useState(true);

  const lastUpdateRef = useRef<number>(Date.now());

  const initPlayer = useCallback(async () => {
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('id', DEMO_PLAYER_ID)
      .maybeSingle();

    if (!existingPlayer) {
      const { data: newPlayer } = await supabase
        .from('players')
        .insert({
          id: DEMO_PLAYER_ID,
          username: 'Joueur Demo',
          clic_coins: 0,
          total_clicks: 0,
          coins_per_click: 1,
          coins_per_second: 0
        })
        .select()
        .single();

      setPlayer(newPlayer);
    } else {
      setPlayer(existingPlayer);
    }
  }, []);

  const loadBuildings = useCallback(async () => {
    const { data } = await supabase
      .from('buildings')
      .select('*')
      .order('unlock_order');

    if (data) setBuildings(data);
  }, []);

  const loadPlayerBuildings = useCallback(async () => {
    const { data } = await supabase
      .from('player_buildings')
      .select('*')
      .eq('player_id', DEMO_PLAYER_ID);

    if (data) setPlayerBuildings(data);
  }, []);

  const loadUpgrades = useCallback(async () => {
    const { data } = await supabase
      .from('upgrades')
      .select('*');

    if (data) setUpgrades(data);
  }, []);

  const loadPlayerUpgrades = useCallback(async () => {
    const { data } = await supabase
      .from('player_upgrades')
      .select('*')
      .eq('player_id', DEMO_PLAYER_ID);

    if (data) setPlayerUpgrades(data);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await initPlayer();
      await loadBuildings();
      await loadPlayerBuildings();
      await loadUpgrades();
      await loadPlayerUpgrades();
      setLoading(false);
    };

    initialize();
  }, [initPlayer, loadBuildings, loadPlayerBuildings, loadUpgrades, loadPlayerUpgrades]);

  useEffect(() => {
    if (!player || player.coins_per_second === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      const coinsToAdd = player.coins_per_second * deltaTime;

      setPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          clic_coins: prev.clic_coins + coinsToAdd
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [player?.coins_per_second]);

  const handleClick = useCallback(async () => {
    if (!player) return;

    const newCoins = player.clic_coins + player.coins_per_click;
    const newClicks = player.total_clicks + 1;

    setPlayer(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clic_coins: newCoins,
        total_clicks: newClicks
      };
    });

    if (newClicks % 10 === 0) {
      await supabase
        .from('players')
        .update({
          clic_coins: newCoins,
          total_clicks: newClicks,
          updated_at: new Date().toISOString()
        })
        .eq('id', DEMO_PLAYER_ID);
    }
  }, [player]);

  const calculateBuildingCost = useCallback((building: Building, currentQuantity: number) => {
    return Math.floor(building.base_cost * Math.pow(building.cost_multiplier, currentQuantity));
  }, []);

  const calculateCoinsPerSecond = useCallback(() => {
    let total = 0;

    playerBuildings.forEach(pb => {
      const building = buildings.find(b => b.id === pb.building_id);
      if (!building) return;

      let production = building.base_production * pb.quantity;

      const globalMultipliers = playerUpgrades
        .map(pu => upgrades.find(u => u.id === pu.upgrade_id && u.upgrade_type === 'global_boost'))
        .filter(Boolean)
        .reduce((acc, upgrade) => acc * (upgrade?.multiplier || 1), 1);

      production *= globalMultipliers;

      total += production;
    });

    return total;
  }, [playerBuildings, buildings, upgrades, playerUpgrades]);

  const purchaseBuilding = useCallback(async (building: Building) => {
    if (!player) return;

    const existingPB = playerBuildings.find(pb => pb.building_id === building.id);
    const currentQuantity = existingPB?.quantity || 0;
    const cost = calculateBuildingCost(building, currentQuantity);

    if (player.clic_coins < cost) return;

    const newCoins = player.clic_coins - cost;

    if (existingPB) {
      const { data } = await supabase
        .from('player_buildings')
        .update({
          quantity: currentQuantity + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPB.id)
        .select()
        .single();

      if (data) {
        setPlayerBuildings(prev =>
          prev.map(pb => pb.id === data.id ? data : pb)
        );
      }
    } else {
      const { data } = await supabase
        .from('player_buildings')
        .insert({
          player_id: DEMO_PLAYER_ID,
          building_id: building.id,
          quantity: 1,
          level: 1,
          total_production: 0
        })
        .select()
        .single();

      if (data) {
        setPlayerBuildings(prev => [...prev, data]);
      }
    }

    const newCoinsPerSecond = calculateCoinsPerSecond();

    await supabase
      .from('players')
      .update({
        clic_coins: newCoins,
        coins_per_second: newCoinsPerSecond,
        updated_at: new Date().toISOString()
      })
      .eq('id', DEMO_PLAYER_ID);

    setPlayer(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        clic_coins: newCoins,
        coins_per_second: newCoinsPerSecond
      };
    });
  }, [player, playerBuildings, calculateBuildingCost, calculateCoinsPerSecond]);

  const purchaseUpgrade = useCallback(async (upgrade: Upgrade) => {
    if (!player) return;
    if (player.clic_coins < upgrade.cost) return;
    if (playerUpgrades.find(pu => pu.upgrade_id === upgrade.id)) return;

    const newCoins = player.clic_coins - upgrade.cost;

    const { data } = await supabase
      .from('player_upgrades')
      .insert({
        player_id: DEMO_PLAYER_ID,
        upgrade_id: upgrade.id
      })
      .select()
      .single();

    if (data) {
      setPlayerUpgrades(prev => [...prev, data]);

      let newCoinsPerClick = player.coins_per_click;
      let newCoinsPerSecond = player.coins_per_second;

      if (upgrade.upgrade_type === 'click_power') {
        newCoinsPerClick *= upgrade.multiplier;
      } else if (upgrade.upgrade_type === 'global_boost') {
        newCoinsPerSecond = calculateCoinsPerSecond() * upgrade.multiplier;
      }

      await supabase
        .from('players')
        .update({
          clic_coins: newCoins,
          coins_per_click: newCoinsPerClick,
          coins_per_second: newCoinsPerSecond,
          updated_at: new Date().toISOString()
        })
        .eq('id', DEMO_PLAYER_ID);

      setPlayer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          clic_coins: newCoins,
          coins_per_click: newCoinsPerClick,
          coins_per_second: newCoinsPerSecond
        };
      });
    }
  }, [player, playerUpgrades, calculateCoinsPerSecond]);

  return {
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
  };
};
