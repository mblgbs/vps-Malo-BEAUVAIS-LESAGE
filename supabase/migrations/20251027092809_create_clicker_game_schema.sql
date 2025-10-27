/*
  # Create Clicker Game Schema

  ## Overview
  This migration sets up the complete database schema for the Clicker game inspired by Paladium's Le Clicker.

  ## New Tables

  ### 1. `players`
  - `id` (uuid, primary key) - Unique player identifier
  - `username` (text) - Player's username
  - `clic_coins` (numeric) - Current ClicCoins balance
  - `total_clicks` (bigint) - Total lifetime clicks
  - `coins_per_click` (numeric) - Coins earned per manual click
  - `coins_per_second` (numeric) - Passive income rate
  - `created_at` (timestamptz) - Account creation time
  - `updated_at` (timestamptz) - Last update time

  ### 2. `buildings`
  - `id` (uuid, primary key) - Building type identifier
  - `name` (text) - Building name
  - `description` (text) - Building description
  - `base_cost` (numeric) - Initial purchase cost
  - `base_production` (numeric) - Base coins per second
  - `cost_multiplier` (numeric) - Cost increase per purchase
  - `unlock_order` (integer) - Order in which buildings unlock
  - `category` (text) - Building category

  ### 3. `player_buildings`
  - `id` (uuid, primary key)
  - `player_id` (uuid, foreign key) - References players
  - `building_id` (uuid, foreign key) - References buildings
  - `quantity` (integer) - Number owned
  - `level` (integer) - Building level
  - `total_production` (numeric) - Total coins produced by this building

  ### 4. `upgrades`
  - `id` (uuid, primary key)
  - `name` (text) - Upgrade name
  - `description` (text) - Upgrade description
  - `cost` (numeric) - Purchase cost
  - `upgrade_type` (text) - Type: click_power, building_boost, global_boost
  - `target_building_id` (uuid, nullable) - Specific building affected
  - `multiplier` (numeric) - Boost multiplier
  - `unlock_condition` (jsonb) - Conditions to unlock

  ### 5. `player_upgrades`
  - `id` (uuid, primary key)
  - `player_id` (uuid, foreign key)
  - `upgrade_id` (uuid, foreign key)
  - `purchased_at` (timestamptz)

  ### 6. `shop_items`
  - `id` (uuid, primary key)
  - `name` (text) - Item name
  - `description` (text) - Item description
  - `base_cost` (numeric) - Base cost
  - `cost_multiplier` (numeric) - Price increase per purchase
  - `max_purchases` (integer) - Purchase limit
  - `unlock_buildings_required` (integer) - Buildings needed to unlock

  ### 7. `player_shop_purchases`
  - `id` (uuid, primary key)
  - `player_id` (uuid, foreign key)
  - `shop_item_id` (uuid, foreign key)
  - `quantity` (integer) - Times purchased
  - `last_purchased_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Players can only access and modify their own data
  - Building and upgrade definitions are readable by all authenticated users
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  clic_coins numeric DEFAULT 0 CHECK (clic_coins >= 0),
  total_clicks bigint DEFAULT 0,
  coins_per_click numeric DEFAULT 1,
  coins_per_second numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own data"
  ON players FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Players can update own data"
  ON players FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Players can insert own data"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Create buildings table (master data)
CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  base_cost numeric NOT NULL CHECK (base_cost > 0),
  base_production numeric NOT NULL CHECK (base_production >= 0),
  cost_multiplier numeric DEFAULT 1.15 CHECK (cost_multiplier > 1),
  unlock_order integer NOT NULL,
  category text DEFAULT 'standard',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buildings readable by authenticated users"
  ON buildings FOR SELECT
  TO authenticated
  USING (true);

-- Create player_buildings table
CREATE TABLE IF NOT EXISTS player_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  quantity integer DEFAULT 0 CHECK (quantity >= 0),
  level integer DEFAULT 1 CHECK (level > 0),
  total_production numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(player_id, building_id)
);

ALTER TABLE player_buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own buildings"
  ON player_buildings FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Players can insert own buildings"
  ON player_buildings FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Players can update own buildings"
  ON player_buildings FOR UPDATE
  TO authenticated
  USING (player_id = auth.uid())
  WITH CHECK (player_id = auth.uid());

-- Create upgrades table (master data)
CREATE TABLE IF NOT EXISTS upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  cost numeric NOT NULL CHECK (cost > 0),
  upgrade_type text NOT NULL CHECK (upgrade_type IN ('click_power', 'building_boost', 'global_boost', 'category_boost')),
  target_building_id uuid REFERENCES buildings(id) ON DELETE SET NULL,
  multiplier numeric NOT NULL CHECK (multiplier > 0),
  unlock_condition jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE upgrades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Upgrades readable by authenticated users"
  ON upgrades FOR SELECT
  TO authenticated
  USING (true);

-- Create player_upgrades table
CREATE TABLE IF NOT EXISTS player_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  upgrade_id uuid NOT NULL REFERENCES upgrades(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(player_id, upgrade_id)
);

ALTER TABLE player_upgrades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own upgrades"
  ON player_upgrades FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Players can insert own upgrades"
  ON player_upgrades FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

-- Create shop_items table (master data)
CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  base_cost numeric NOT NULL CHECK (base_cost > 0),
  cost_multiplier numeric DEFAULT 1.5 CHECK (cost_multiplier >= 1),
  max_purchases integer DEFAULT 10 CHECK (max_purchases > 0),
  unlock_buildings_required integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shop items readable by authenticated users"
  ON shop_items FOR SELECT
  TO authenticated
  USING (true);

-- Create player_shop_purchases table
CREATE TABLE IF NOT EXISTS player_shop_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  shop_item_id uuid NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  quantity integer DEFAULT 0 CHECK (quantity >= 0),
  last_purchased_at timestamptz DEFAULT now(),
  UNIQUE(player_id, shop_item_id)
);

ALTER TABLE player_shop_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own purchases"
  ON player_shop_purchases FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Players can insert own purchases"
  ON player_shop_purchases FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Players can update own purchases"
  ON player_shop_purchases FOR UPDATE
  TO authenticated
  USING (player_id = auth.uid())
  WITH CHECK (player_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_player_buildings_player_id ON player_buildings(player_id);
CREATE INDEX IF NOT EXISTS idx_player_upgrades_player_id ON player_upgrades(player_id);
CREATE INDEX IF NOT EXISTS idx_player_shop_purchases_player_id ON player_shop_purchases(player_id);
CREATE INDEX IF NOT EXISTS idx_buildings_unlock_order ON buildings(unlock_order);

-- Insert initial buildings data
INSERT INTO buildings (name, description, base_cost, base_production, unlock_order, category) VALUES
  ('Mine abandonnée', 'Une vieille mine où les namuus cherchent des ressources', 10, 0.1, 1, 'mining'),
  ('Caverne aux gros cailloux', 'Une caverne remplie de pierres précieuses', 100, 1, 2, 'mining'),
  ('Forêt mystique', 'Les namuus récoltent des ressources naturelles', 500, 5, 3, 'nature'),
  ('Ferme de namuus', 'Les namuus cultivent et produisent', 2000, 20, 4, 'farming'),
  ('Usine à ClicCoins', 'Production industrielle de ClicCoins', 10000, 100, 5, 'industrial'),
  ('Laboratoire secret', 'Recherches avancées pour plus de rendement', 50000, 500, 6, 'research'),
  ('Temple ancien', 'Pouvoir mystique des anciens', 250000, 2500, 7, 'mystical'),
  ('Portail dimensionnel', 'Accès à d''autres dimensions riches en ressources', 1000000, 10000, 8, 'dimensional');

-- Insert initial upgrades
INSERT INTO upgrades (name, description, cost, upgrade_type, multiplier, unlock_condition) VALUES
  ('Meilleurs outils', 'Les namuus travaillent plus efficacement', 50, 'click_power', 2, '{"min_clicks": 0}'),
  ('Nourriture de qualité', 'Améliore le rendement des clics', 250, 'click_power', 2, '{"min_clicks": 100}'),
  ('Formation avancée', 'Triple le pouvoir de vos clics', 1000, 'click_power', 3, '{"min_clicks": 500}'),
  ('Boost global I', 'Tous les bâtiments +10%', 5000, 'global_boost', 1.1, '{"min_buildings": 5}'),
  ('Boost global II', 'Tous les bâtiments +10%', 25000, 'global_boost', 1.1, '{"min_buildings": 10}'),
  ('Boost global III', 'Tous les bâtiments +10%', 100000, 'global_boost', 1.1, '{"min_buildings": 20}');

-- Insert initial shop items
INSERT INTO shop_items (name, description, base_cost, cost_multiplier, max_purchases, unlock_buildings_required) VALUES
  ('Multiplicateur x2', 'Double vos gains pendant 1 heure', 1000, 2, 5, 3),
  ('Coffre de ClicCoins', 'Reçois 10000 ClicCoins instantanément', 5000, 1.8, 10, 5),
  ('Boost de production', 'Augmente la production de 50% pendant 30 min', 2500, 2.5, 8, 4),
  ('Skin de namuu légendaire', 'Apparence exclusive pour votre namuu', 50000, 1, 1, 10);
