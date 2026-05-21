# RELATORIO_ADMIN

## Estrutura atual
- Pasta oficial do painel administrativo: `/admin`.
- Páginas existentes: `index.html`, `noticias.html`, `vereadores.html`, `legislacao.html`, `diario.html`, `esic.html`, `ouvidoria.html`, `concursos.html`, `usuarios.html`, `config.html`.
- Novas bases visuais preparadas: `transparencia.html`, `diarias.html`, `folha.html`, `login.html`.

## Ajustes realizados
1. Revisão dos arquivos HTML do painel na pasta `/admin`.
2. Atualização dos mapeamentos internos de navegação (`PAGE_MAP`) para incluir módulos adicionais e login.
3. Inclusão de aviso interno padrão:
   - “Área administrativa em preparação. Produção exige autenticação segura no backend.”
4. Remoção de texto de demonstração na Ouvidoria e substituição por texto neutro de implantação.
5. Criação de tela de login **somente visual**, sem senha fixa no frontend.
6. Separação preservada: nenhuma alteração em `index.html` público do site (fora da pasta `/admin`).

## Pendências de backend (não implementadas por escopo)
- Autenticação segura (sessão/JWT/cookies httpOnly).
- Controle de perfis e permissões por usuário.
- Persistência em banco de dados para todos os módulos.
- Upload seguro de arquivos e mídias.
- Auditoria, logs de ações e trilha de alterações.
- Proteção CSRF, rate-limit, validações e sanitização no servidor.

## Próximos passos recomendados
1. Definir arquitetura backend (API + banco).
2. Implementar autenticação e autorização por papéis.
3. Conectar CRUD dos módulos: Notícias, Vereadores, Legislação, Diário Oficial, e-SIC, Ouvidoria, Concursos, Usuários, Configurações, Transparência, Diárias, Folha.
4. Implementar pipeline de homologação e produção (ambientes separados).
5. Adicionar testes de integração e segurança.
