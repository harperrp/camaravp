SET NAMES utf8mb4;

INSERT INTO users (name, email, password_hash, role, active)
VALUES (
  'Administrador',
  'admin@camaravp.mg.gov.br',
  '$2y$10$Lx8nOKlg/D.BKXeu8lS3d.VyZl.RvG429TDXov/Mu33Mh8aWxFjjG',
  'admin',
  1
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  role = 'admin',
  active = 1;
