# Relatório Banco de Dados
- Arquivo de estrutura: `database/schema.sql`.
- Seed inicial: `database/seed.sql`.
- Importação no Plesk/phpMyAdmin: selecionar banco `camaravp` > Importar > enviar `schema.sql` e depois `seed.sql`.
- Configuração segura: copiar `admin/api/config.example.php` para `admin/api/config.local.php` no servidor e definir `DB_PASS` em variável de ambiente.
- Nunca versionar senha real.
