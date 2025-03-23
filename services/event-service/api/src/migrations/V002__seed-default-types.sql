-- Insert default event types
INSERT INTO types (name)
VALUES 
  ('convention'),
  ('fair'),
  ('tournament'),
  ('meeting')
ON CONFLICT (name) DO NOTHING;