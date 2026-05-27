-- Schema MySQL/MariaDB para Câmara Municipal de Vargem Grande do Rio Pardo
-- Banco: camaravgp
-- Importar este arquivo no phpMyAdmin antes de usar o painel.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS councilors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  party VARCHAR(80) NULL,
  role VARCHAR(120) NULL,
  legislature VARCHAR(40) NULL,
  phone VARCHAR(40) NULL,
  email VARCHAR(190) NULL,
  photo_url VARCHAR(500) NULL,
  biography TEXT NULL,
  display_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_councilors_active_order (active, display_order, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NULL UNIQUE,
  summary TEXT NULL,
  content LONGTEXT NULL,
  image_url VARCHAR(500) NULL,
  category VARCHAR(120) NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_news_status_published (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS official_diary (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  edition_number VARCHAR(80) NULL,
  description TEXT NULL,
  file_url VARCHAR(500) NULL,
  publication_date DATE NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_diary_status_date (status, publication_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS laws (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(240) NOT NULL,
  law_number VARCHAR(80) NULL,
  law_type VARCHAR(80) NULL,
  summary TEXT NULL,
  content LONGTEXT NULL,
  related_laws TEXT NULL,
  file_url VARCHAR(500) NULL,
  publication_date DATE NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_laws_status_date (status, publication_date),
  INDEX idx_laws_number (law_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS public_tenders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(240) NOT NULL,
  tender_number VARCHAR(80) NULL,
  modality VARCHAR(120) NULL,
  description TEXT NULL,
  file_url VARCHAR(500) NULL,
  opening_date DATE NULL,
  status VARCHAR(80) NOT NULL DEFAULT 'publicado',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tenders_status_date (status, opening_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS esic_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  protocol VARCHAR(80) NULL UNIQUE,
  requester_name VARCHAR(180) NOT NULL,
  requester_email VARCHAR(190) NULL,
  requester_phone VARCHAR(40) NULL,
  subject VARCHAR(220) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('novo','em_andamento','respondido','arquivado') NOT NULL DEFAULT 'novo',
  response TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_esic_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ombudsman_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  protocol VARCHAR(80) NULL UNIQUE,
  requester_name VARCHAR(180) NULL,
  requester_email VARCHAR(190) NULL,
  requester_phone VARCHAR(40) NULL,
  type VARCHAR(80) NOT NULL DEFAULT 'manifestacao',
  subject VARCHAR(220) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('novo','em_andamento','respondido','arquivado') NOT NULL DEFAULT 'novo',
  response TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ombudsman_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transparency_links (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  url VARCHAR(500) NOT NULL,
  category VARCHAR(120) NULL,
  display_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_transparency_active_order (active, display_order, title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL UNIQUE,
  setting_value LONGTEXT NULL,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(120) NULL,
  entity_id BIGINT UNSIGNED NULL,
  payload JSON NULL,
  ip_address VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user_created (user_id, created_at),
  INDEX idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'Câmara Municipal de Vargem Grande do Rio Pardo'),
('city', 'Vargem Grande do Rio Pardo'),
('state', 'MG'),
('legislature', '2025-2028')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Senha inicial: Admin@123456
-- Trocar imediatamente após o primeiro acesso.
INSERT INTO users (name, email, password_hash, role, active) VALUES
('Administrador', 'admin@camaravp.mg.gov.br', '$2y$10$Lx8nOKlg/D.BKXeu8lS3d.VyZl.RvG429TDXov/Mu33Mh8aWxFjjG', 'admin', 1)
ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), role='admin', active=1;

SET FOREIGN_KEY_CHECKS = 1;
