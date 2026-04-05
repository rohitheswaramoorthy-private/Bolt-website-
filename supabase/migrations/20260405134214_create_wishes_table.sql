/*
  # Create wishes table for marriage invitation

  1. New Tables
    - `wishes`
      - `id` (uuid, primary key) - Unique identifier for each wish
      - `name` (text) - Name of the person sending the wish
      - `message` (text) - The wish message content
      - `created_at` (timestamptz) - Timestamp when the wish was created
      - `ip_address` (text, optional) - IP address for spam prevention
  
  2. Security
    - Enable RLS on `wishes` table
    - Add policy for anyone to insert wishes (public form)
    - Add policy for authenticated users to read all wishes (admin access)
  
  3. Notes
    - This table stores wedding wishes from guests
    - Public can submit wishes but cannot read others' wishes
    - Only authenticated users (admin) can view all wishes
*/

CREATE TABLE IF NOT EXISTS wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  ip_address text
);

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit wishes"
  ON wishes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all wishes"
  ON wishes
  FOR SELECT
  TO authenticated
  USING (true);
