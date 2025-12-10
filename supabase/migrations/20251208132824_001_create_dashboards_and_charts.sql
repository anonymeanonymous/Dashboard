/*
  # Create Dashboards and Charts Tables

  1. New Tables
    - `dashboards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `charts`
      - `id` (uuid, primary key)
      - `dashboard_id` (uuid, foreign key)
      - `title` (text)
      - `type` (text enum)
      - `x_axis` (text, optional)
      - `y_axis` (jsonb array)
      - `aggregation` (text)
      - `colors` (jsonb array)
      - `position` (jsonb - for grid layout)
      - `filters` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `datasets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `data` (jsonb)
      - `columns` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data only
    - Restrict dashboard deletion cascade to prevent data loss
*/

CREATE TABLE IF NOT EXISTS dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Dashboard',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  x_axis TEXT,
  y_axis JSONB DEFAULT '[]'::jsonb,
  aggregation TEXT DEFAULT 'sum',
  colors JSONB DEFAULT '[]'::jsonb,
  position JSONB DEFAULT '{}'::jsonb,
  filters JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dashboards"
  ON dashboards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create dashboards"
  ON dashboards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboards"
  ON dashboards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dashboards"
  ON dashboards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view charts in own dashboards"
  ON charts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create charts in own dashboards"
  ON charts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update charts in own dashboards"
  ON charts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete charts in own dashboards"
  ON charts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own datasets"
  ON datasets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create datasets"
  ON datasets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own datasets"
  ON datasets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own datasets"
  ON datasets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX idx_charts_dashboard_id ON charts(dashboard_id);
CREATE INDEX idx_datasets_user_id ON datasets(user_id);
