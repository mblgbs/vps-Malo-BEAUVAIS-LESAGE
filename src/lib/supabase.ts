import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Player = {
  id: string;
  username: string;
  clic_coins: number;
  total_clicks: number;
  coins_per_click: number;
  coins_per_second: number;
  created_at: string;
  updated_at: string;
};

export type Building = {
  id: string;
  name: string;
  description: string;
  base_cost: number;
  base_production: number;
  cost_multiplier: number;
  unlock_order: number;
  category: string;
};

export type PlayerBuilding = {
  id: string;
  player_id: string;
  building_id: string;
  quantity: number;
  level: number;
  total_production: number;
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
  upgrade_type: 'click_power' | 'building_boost' | 'global_boost' | 'category_boost';
  target_building_id: string | null;
  multiplier: number;
  unlock_condition: any;
};

export type PlayerUpgrade = {
  id: string;
  player_id: string;
  upgrade_id: string;
  purchased_at: string;
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  base_cost: number;
  cost_multiplier: number;
  max_purchases: number;
  unlock_buildings_required: number;
};

export type PlayerShopPurchase = {
  id: string;
  player_id: string;
  shop_item_id: string;
  quantity: number;
  last_purchased_at: string;
};
