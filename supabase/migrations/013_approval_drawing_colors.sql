ALTER TABLE approval_drawings
  ADD COLUMN IF NOT EXISTS frame_color TEXT DEFAULT 'Black',
  ADD COLUMN IF NOT EXISTS hardware_color TEXT DEFAULT 'Black';
