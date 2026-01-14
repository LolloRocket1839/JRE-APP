-- Jungle Rent Seed Data
-- Turin-only for beta UI

-- ===========================================
-- SEED CITIES
-- ===========================================
INSERT INTO cities (id, name_it, name_en, country, is_default) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Torino', 'Turin', 'Italia', true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Milano', 'Milan', 'Italia', false)
ON CONFLICT DO NOTHING;

-- ===========================================
-- SEED PROPERTIES (Investment objects)
-- ===========================================
INSERT INTO properties (id, city_id, name, address_area, description_it, description_en, min_ticket_eur, target_raise_eur, status, cover_image_url) VALUES
  (
    'p1a2b3c4-d5e6-7890-abcd-111111111111',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Residenza San Salvario',
    'San Salvario, Torino',
    'Palazzina ristrutturata nel cuore di San Salvario, a 10 minuti dal Politecnico. 8 unità abitative pensate per studenti universitari con spazi comuni moderni.',
    'Renovated building in the heart of San Salvario, 10 minutes from Politecnico. 8 housing units designed for university students with modern common spaces.',
    100,
    150000,
    'live',
    '/images/properties/san-salvario.jpg'
  ),
  (
    'p2a2b3c4-d5e6-7890-abcd-222222222222',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Campus Living Aurora',
    'Aurora, Torino',
    'Nuovo sviluppo nel quartiere Aurora, zona in forte riqualificazione. 12 monolocali arredati con servizi inclusi, ideali per studenti e giovani professionisti.',
    'New development in the Aurora district, an area undergoing significant regeneration. 12 furnished studios with services included, ideal for students and young professionals.',
    100,
    200000,
    'live',
    '/images/properties/aurora.jpg'
  ),
  (
    'p3a2b3c4-d5e6-7890-abcd-333333333333',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Vanchiglia Student House',
    'Vanchiglia, Torino',
    'Casa indipendente nel vivace quartiere di Vanchiglia. 6 stanze singole con bagno privato, cucina condivisa e giardino. A 5 minuti dall''Università.',
    'Independent house in the lively Vanchiglia district. 6 single rooms with private bathroom, shared kitchen and garden. 5 minutes from the University.',
    100,
    120000,
    'live',
    '/images/properties/vanchiglia.jpg'
  )
ON CONFLICT DO NOTHING;

-- ===========================================
-- SEED LISTINGS (Student-focused)
-- ===========================================
INSERT INTO listings (id, city_id, property_id, title_it, title_en, type, area, price_monthly, price_nightly, bills_included, deposit, contract_type, distance_category, verified_listing, short_stay_eligible, description_it, description_en, amenities, photos, availability_note) VALUES
  (
    'l1a2b3c4-d5e6-7890-abcd-111111111111',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'p1a2b3c4-d5e6-7890-abcd-111111111111',
    'Stanza Singola - San Salvario Centro',
    'Single Room - San Salvario Center',
    'room',
    16,
    450,
    NULL,
    true,
    900,
    'Contratto transitorio 12 mesi',
    '10 min Politecnico',
    true,
    false,
    'Luminosa stanza singola in appartamento condiviso con altri 3 studenti. Bagno in comune, cucina attrezzata. Zona centralissima con tutti i servizi.',
    'Bright single room in shared apartment with 3 other students. Shared bathroom, equipped kitchen. Very central area with all amenities.',
    '["WiFi", "Lavatrice", "Riscaldamento incluso", "Cucina attrezzata"]',
    '["/images/listings/san-salvario-1.jpg", "/images/listings/san-salvario-2.jpg"]',
    'Disponibile da Settembre 2024'
  ),
  (
    'l2a2b3c4-d5e6-7890-abcd-222222222222',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'p1a2b3c4-d5e6-7890-abcd-111111111111',
    'Stanza Doppia - San Salvario',
    'Double Room - San Salvario',
    'room',
    22,
    350,
    NULL,
    true,
    700,
    'Contratto transitorio 12 mesi',
    '10 min Politecnico',
    true,
    false,
    'Stanza doppia ideale per due amici. Ampia e luminosa con balcone. Appartamento appena ristrutturato.',
    'Double room ideal for two friends. Spacious and bright with balcony. Freshly renovated apartment.',
    '["WiFi", "Lavatrice", "Balcone", "Aria condizionata"]',
    '["/images/listings/san-salvario-double-1.jpg"]',
    'Disponibile da Ottobre 2024'
  ),
  (
    'l3a2b3c4-d5e6-7890-abcd-333333333333',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'p2a2b3c4-d5e6-7890-abcd-222222222222',
    'Monolocale Arredato - Aurora',
    'Furnished Studio - Aurora',
    'apartment',
    28,
    550,
    NULL,
    true,
    1100,
    'Contratto 4+4',
    '15 min Università',
    true,
    false,
    'Monolocale completamente arredato con angolo cottura. Edificio con portineria e ascensore. Perfetto per chi cerca indipendenza.',
    'Fully furnished studio with kitchenette. Building with concierge and elevator. Perfect for those seeking independence.',
    '["WiFi", "Portineria", "Ascensore", "Angolo cottura"]',
    '["/images/listings/aurora-studio-1.jpg", "/images/listings/aurora-studio-2.jpg"]',
    'Disponibile subito'
  ),
  (
    'l4a2b3c4-d5e6-7890-abcd-444444444444',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'p3a2b3c4-d5e6-7890-abcd-333333333333',
    'Stanza con Bagno Privato - Vanchiglia',
    'Room with Private Bathroom - Vanchiglia',
    'room',
    18,
    520,
    NULL,
    false,
    1040,
    'Contratto transitorio 12 mesi',
    '5 min Università',
    true,
    false,
    'Stanza singola con bagno privato in casa indipendente. Giardino comune, cucina condivisa con altri 5 studenti. Quartiere vivace e universitario.',
    'Single room with private bathroom in independent house. Shared garden, kitchen shared with 5 other students. Lively university district.',
    '["Bagno privato", "Giardino", "WiFi", "Biciclette disponibili"]',
    '["/images/listings/vanchiglia-1.jpg"]',
    'Disponibile da Settembre 2024'
  ),
  (
    'l5a2b3c4-d5e6-7890-abcd-555555555555',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Bilocale Centro Storico',
    'One-Bedroom Apartment Historic Center',
    'apartment',
    45,
    750,
    NULL,
    false,
    1500,
    'Contratto 4+4',
    '8 min Università',
    true,
    false,
    'Elegante bilocale nel centro storico di Torino. Soffitti alti, parquet originale. Ideale per coppie o studenti che cercano più spazio.',
    'Elegant one-bedroom apartment in Turin historic center. High ceilings, original parquet. Ideal for couples or students looking for more space.',
    '["Parquet", "Soffitti alti", "Ascensore", "Cantina"]',
    '["/images/listings/centro-bilocale-1.jpg", "/images/listings/centro-bilocale-2.jpg"]',
    'Disponibile da Novembre 2024'
  )
ON CONFLICT DO NOTHING;

-- ===========================================
-- SEED LISTINGS (Tourist-eligible)
-- ===========================================
INSERT INTO listings (id, city_id, property_id, title_it, title_en, type, area, price_monthly, price_nightly, bills_included, deposit, contract_type, distance_category, verified_listing, short_stay_eligible, description_it, description_en, amenities, photos, availability_note) VALUES
  (
    'l6a2b3c4-d5e6-7890-abcd-666666666666',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Appartamento Piazza Vittorio',
    'Apartment Piazza Vittorio',
    'apartment',
    55,
    NULL,
    85,
    true,
    0,
    'Affitto breve',
    'Centro',
    true,
    true,
    'Splendido appartamento con vista su Piazza Vittorio, la più grande piazza d''Europa. Due camere, soggiorno luminoso, cucina completa. Check-in flessibile.',
    'Stunning apartment overlooking Piazza Vittorio, Europe''s largest square. Two bedrooms, bright living room, full kitchen. Flexible check-in.',
    '["Vista panoramica", "WiFi veloce", "Smart TV", "Lavatrice", "Aria condizionata"]',
    '["/images/listings/piazza-vittorio-1.jpg", "/images/listings/piazza-vittorio-2.jpg", "/images/listings/piazza-vittorio-3.jpg"]',
    'Disponibile per soggiorni brevi'
  ),
  (
    'l7a2b3c4-d5e6-7890-abcd-777777777777',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Loft Design Quadrilatero Romano',
    'Design Loft Quadrilatero Romano',
    'apartment',
    40,
    NULL,
    95,
    true,
    0,
    'Affitto breve',
    'Centro Storico',
    true,
    true,
    'Loft di design nel cuore del Quadrilatero Romano. Spazi aperti, arredo contemporaneo, a due passi dai migliori ristoranti e locali di Torino.',
    'Design loft in the heart of the Quadrilatero Romano. Open spaces, contemporary furniture, steps away from Turin''s best restaurants and bars.',
    '["Design contemporaneo", "WiFi veloce", "Nespresso", "Smart home", "Aria condizionata"]',
    '["/images/listings/quadrilatero-1.jpg", "/images/listings/quadrilatero-2.jpg"]',
    'Minimo 2 notti'
  ),
  (
    'l8a2b3c4-d5e6-7890-abcd-888888888888',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    NULL,
    'Suite Romantica San Carlo',
    'Romantic Suite San Carlo',
    'apartment',
    35,
    NULL,
    120,
    true,
    0,
    'Affitto breve',
    'Centro',
    true,
    true,
    'Suite elegante affacciata su Via Roma. Perfetta per coppie, con vasca idromassaggio e vista sui portici. Colazione inclusa in bar convenzionato.',
    'Elegant suite overlooking Via Roma. Perfect for couples, with jacuzzi and view of the arcades. Breakfast included at partner café.',
    '["Vasca idromassaggio", "Colazione inclusa", "WiFi", "Smart TV", "Vista sui portici"]',
    '["/images/listings/san-carlo-1.jpg", "/images/listings/san-carlo-2.jpg"]',
    'Ideale per weekend romantici'
  )
ON CONFLICT DO NOTHING;
