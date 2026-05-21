INSERT INTO users (name,email,password_hash,role,active,created_at,updated_at) VALUES
('Administrador','admin@camaravp.mg.gov.br','$2y$10$V1MPSRkKTc5OlP4hS1fYpOl8vQw77XO.5MNDoAuCEi0aKBslZx2nS','admin',1,NOW(),NOW());
INSERT INTO site_settings (setting_key,setting_value,created_at,updated_at) VALUES
('camara_nome','Câmara Municipal de Vargem Grande do Rio Pardo',NOW(),NOW()),
('email_institucional','contato@camaravp.mg.gov.br',NOW(),NOW());
