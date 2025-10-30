-- Seed sample projects for testing
-- This adds a few example virtual tourism destinations

INSERT INTO projects (
  title, description, location, address, category,
  latitude, longitude, rating, review_count,
  online_visitors, total_visitors, virtual_tours,
  highlights, visitor_tips, badges, is_published
) VALUES 
(
  'Taj Mahal',
  'An ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh, India. One of the Seven Wonders of the World.',
  'Agra, India',
  'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001',
  'Historical',
  27.1751448,
  78.0421422,
  4.8,
  15234,
  1250,
  2500000,
  45678,
  '["UNESCO World Heritage Site", "Mughal Architecture", "Symbol of Love"]'::jsonb,
  '["Visit early morning for best light", "Book tickets online to avoid queues", "Photography allowed but no tripods"]'::jsonb,
  '["World Heritage", "Top Rated", "Most Visited"]'::jsonb,
  true
),
(
  'Eiffel Tower',
  'A wrought-iron lattice tower on the Champ de Mars in Paris, France. Named after engineer Gustave Eiffel, it is one of the most recognizable structures in the world.',
  'Paris, France',
  'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
  'Landmark',
  48.8583701,
  2.2944813,
  4.7,
  28456,
  2100,
  7000000,
  89234,
  '["Iconic Iron Structure", "Panoramic City Views", "Evening Light Show"]'::jsonb,
  '["Book summit tickets in advance", "Visit at sunset for amazing views", "Restaurants on 1st and 2nd floors"]'::jsonb,
  '["Iconic", "Top Rated", "Must Visit"]'::jsonb,
  true
),
(
  'Great Wall of China',
  'An ancient series of walls and fortifications stretching over 13,000 miles across northern China. Built over centuries to protect against invasions.',
  'Beijing, China',
  'Huairou District, Beijing, China',
  'Historical',
  40.4319077,
  116.5703749,
  4.9,
  42189,
  3400,
  10000000,
  123456,
  '["Ancient Wonder", "Breathtaking Views", "Historical Significance"]'::jsonb,
  '["Wear comfortable shoes", "Mutianyu section less crowded", "Cable car available"]'::jsonb,
  '["World Heritage", "Ancient Wonder", "Most Visited"]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;
