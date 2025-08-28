-- Insert the Advice category
INSERT INTO categories (name, slug, description) 
VALUES (
  'Advice', 
  'advice', 
  'Expert advice and recommendations for making informed lifestyle decisions'
) ON CONFLICT (slug) DO NOTHING;