-- Usuário inicial:
-- Email: admin@camaravp.mg.gov.br
-- Senha provisória: trocar-apos-primeiro-login
-- Importante: trocar a senha após o primeiro login.
INSERT INTO users (name,email,password_hash,role,active,created_at,updated_at) VALUES
('Administrador','admin@camaravp.mg.gov.br','$2y$12$bXeTY7DF1oBuB0GXEyRdSuDSh/HoBGG017JsFo1bpN68rYGpFgCn.','admin',1,NOW(),NOW());
