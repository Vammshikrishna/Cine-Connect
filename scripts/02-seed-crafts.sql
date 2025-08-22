-- Seed the 24 film industry crafts
INSERT INTO crafts (name, description, category, icon_name) VALUES
-- Pre-Production
('Director', 'Oversees the creative vision and guides the overall production', 'pre-production', 'megaphone'),
('Producer', 'Manages the business and logistical aspects of film production', 'pre-production', 'briefcase'),
('Screenwriter', 'Creates and develops scripts and screenplays', 'pre-production', 'pen-tool'),
('Casting Director', 'Selects actors and manages the casting process', 'pre-production', 'users'),
('Location Scout', 'Finds and secures filming locations', 'pre-production', 'map-pin'),

-- Production
('Cinematographer', 'Director of Photography, manages camera and lighting', 'production', 'camera'),
('Camera Operator', 'Operates cameras during filming', 'production', 'video'),
('Gaffer', 'Head of electrical department, manages lighting', 'production', 'zap'),
('Sound Engineer', 'Records and manages audio during production', 'production', 'mic'),
('Production Designer', 'Creates the visual concept and oversees art department', 'production', 'palette'),
('Costume Designer', 'Designs and manages wardrobe for characters', 'production', 'shirt'),
('Makeup Artist', 'Creates character looks through makeup and prosthetics', 'production', 'brush'),
('Script Supervisor', 'Maintains continuity and script accuracy', 'production', 'clipboard'),
('Assistant Director', 'Supports director and manages on-set logistics', 'production', 'users-2'),

-- Post-Production
('Editor', 'Assembles and cuts footage into final product', 'post-production', 'scissors'),
('Colorist', 'Enhances and corrects color in post-production', 'post-production', 'droplet'),
('Sound Designer', 'Creates and implements audio elements', 'post-production', 'volume-2'),
('Composer', 'Creates original music and scores', 'post-production', 'music'),
('VFX Artist', 'Creates visual effects and CGI elements', 'post-production', 'sparkles'),
('Motion Graphics', 'Creates animated graphics and titles', 'post-production', 'move'),

-- Specialized
('Stunt Coordinator', 'Designs and supervises action sequences', 'specialized', 'shield'),
('Drone Operator', 'Operates drones for aerial cinematography', 'specialized', 'plane'),
('Photographer', 'Captures still images for promotion and documentation', 'specialized', 'camera'),
('Social Media Manager', 'Manages online presence and marketing', 'specialized', 'share-2')

ON CONFLICT (name) DO NOTHING;
