# Relatório Backend
- API administrativa criada em `admin/api` com PDO, sessão segura e JSON padronizado.
- Endpoints CRUD: news, councilors, laws, official_diary, esic, ouvidoria, concursos, settings, transparency, documents, users.
- Login/Logout: `admin/api/auth.php` usando `password_hash/password_verify`.
- Middleware: `require_auth()` bloqueia APIs sem sessão.
- Upload seguro: `admin/api/upload.php` (pdf/jpg/jpeg/png/webp, valida tamanho, bloqueia tipos perigosos).
- Logs: `audit_logs` para login, create, update, delete e upload.
- Endpoints públicos preparados em `api/public/*` retornando apenas ativos/publicados.
