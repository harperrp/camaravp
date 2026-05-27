const API_BASE = "../api/";

const state = {
  current: "dashboard",
  user: null,
  filters: {},
  lawArticles: [],
  lawPdfFileName: "",
  lawPdfFileSize: 0,
  data: {
    noticias: [],
    vereadores: [],
    diario: [],
    legislacao: [],
    concursos: [],
    esic: [],
    ouvidoria: [],
    usuarios: [],
    settings: {},
  },
};

const sections = {
  dashboard: "Dashboard",
  noticias: "Noticias e Eventos",
  vereadores: "Vereadores",
  diario: "Diario Oficial",
  legislacao: "Legislacao Municipal",
  concursos: "Concursos Publicos",
  esic: "e-SIC",
  ouvidoria: "Ouvidoria",
  config: "Configuracoes",
  usuarios: "Usuarios",
};

const crud = {
  noticias: {
    endpoint: "noticias.php",
    title: "Noticias e Eventos",
    subtitle: "Publicacoes do site, comunicados e eventos oficiais.",
    empty: "Nenhuma noticia cadastrada.",
    primary: "title",
    columns: [
      ["title", "Titulo"],
      ["category", "Categoria"],
      ["published_at", "Data", "date"],
      ["status", "Status", "status"],
    ],
    fields: [
      ["title", "Titulo da noticia", "text", "span2", "", true],
      ["category", "Categoria", "text"],
      ["published_at", "Data de publicacao", "date"],
      ["status", "Status", "select", "", [["published", "Publicada"], ["draft", "Rascunho"], ["archived", "Arquivada"]]],
      ["summary", "Resumo", "textarea", "span2"],
      ["content", "Conteudo completo", "textarea", "span2 tall"],
      ["image_url", "Imagem da noticia", "upload-image", "span2"],
    ],
  },
  vereadores: {
    endpoint: "vereadores.php?admin=1",
    saveEndpoint: "vereadores.php",
    title: "Gestao de Vereadores",
    subtitle: "Legislatura 2025-2028 e dados exibidos no site publico.",
    empty: "Nenhum vereador cadastrado.",
    primary: "name",
    columns: [
      ["name", "Nome"],
      ["role", "Cargo"],
      ["party", "Partido", "party"],
      ["legislature", "Mandato"],
      ["active", "Status", "active"],
    ],
    fields: [
      ["name", "Nome completo", "text", "span2", "", true],
      ["role", "Cargo", "select", "", [["Presidente", "Presidente"], ["Vice-Presidente", "Vice-Presidente"], ["1o Secretario", "1o Secretario"], ["2o Secretario", "2o Secretario"], ["Tesoureiro", "Tesoureiro"], ["Vereador", "Vereador"]]],
      ["party", "Partido", "select", "", [["AVANTE", "AVANTE"], ["MDB", "MDB"], ["PL", "PL"], ["PSD", "PSD"], ["REPUBLICANOS", "REPUBLICANOS"], ["UNIAO", "UNIAO"], ["OUTRO", "OUTRO"]]],
      ["legislature", "Mandato", "text"],
      ["display_order", "Ordem", "number"],
      ["phone", "Telefone", "text"],
      ["email", "E-mail", "text"],
      ["photo_url", "Foto", "upload-image", "span2"],
      ["biography", "Biografia", "textarea", "span2"],
      ["active", "Status", "select", "", [["1", "Ativo"], ["0", "Inativo"]]],
    ],
  },
  diario: {
    endpoint: "diario.php?admin=1",
    saveEndpoint: "diario.php",
    title: "Diario Oficial",
    subtitle: "Edicoes oficiais publicadas no portal.",
    empty: "Nenhuma edicao cadastrada.",
    primary: "title",
    columns: [
      ["edition_number", "Edicao"],
      ["title", "Titulo"],
      ["publication_date", "Data", "date"],
      ["status", "Status", "status"],
    ],
    fields: [
      ["title", "Titulo da edicao", "text", "span2", "", true],
      ["edition_number", "Numero da edicao", "text"],
      ["publication_date", "Data de publicacao", "date"],
      ["status", "Status", "select", "", [["published", "Publicado"], ["draft", "Rascunho"], ["archived", "Arquivado"]]],
      ["file_url", "Arquivo PDF", "upload-doc", "span2"],
      ["description", "Descricao", "textarea", "span2"],
    ],
  },
  legislacao: {
    endpoint: "legislacao.php?admin=1",
    saveEndpoint: "legislacao.php",
    title: "Legislacao Municipal",
    modalTitle: "Cadastrar Instrumento Normativo",
    subtitle: "Leis, decretos, resolucoes e atos normativos.",
    empty: "Nenhum ato cadastrado.",
    primary: "title",
    columns: [
      ["law_number", "Numero"],
      ["law_type", "Tipo"],
      ["publication_date", "Data", "date"],
      ["status", "Status", "status"],
    ],
    fields: [
      ["file_url", "Anexar PDF da Lei", "law-pdf", "span2"],
      ["law_type", "Tipo", "select", "", [["Lei Ordinaria", "Lei Ordinaria"], ["Lei Complementar", "Lei Complementar"], ["Decreto", "Decreto"], ["Decreto Legislativo", "Decreto Legislativo"], ["Resolucao", "Resolucao"], ["Portaria", "Portaria"], ["Emenda a Lei Organica", "Emenda a Lei Organica"]]],
      ["law_number", "Numero / Ano", "text", "", "", true],
      ["publication_date", "Data de publicacao", "date"],
      ["status", "Situacao", "select", "", [["published", "Vigente"], ["draft", "Rascunho"], ["archived", "Revogada / Arquivada"]]],
      ["summary", "Ementa", "text", "span2", "", true],
      ["related_laws", "Vinculacoes", "text", "span2"],
      ["content", "Artigos da Lei", "law-articles", "span2"],
    ],
  },
  concursos: {
    endpoint: "concursos.php?admin=1",
    saveEndpoint: "concursos.php",
    title: "Concursos Publicos",
    subtitle: "Processos seletivos, concursos e editais.",
    empty: "Nenhum concurso cadastrado.",
    primary: "title",
    columns: [
      ["title", "Titulo"],
      ["tender_number", "Numero"],
      ["opening_date", "Data", "date"],
      ["status", "Status", "plain"],
    ],
    fields: [
      ["title", "Titulo", "text", "span2", "", true],
      ["tender_number", "Numero", "text"],
      ["modality", "Modalidade", "select", "", [["Concurso Publico", "Concurso Publico"], ["Processo Seletivo", "Processo Seletivo"], ["Edital", "Edital"], ["Chamamento", "Chamamento"]]],
      ["opening_date", "Data de abertura", "date"],
      ["status", "Status", "select", "", [["publicado", "Publicado"], ["em_andamento", "Em andamento"], ["encerrado", "Encerrado"], ["suspenso", "Suspenso"], ["archived", "Arquivado"]]],
      ["file_url", "Arquivo PDF", "upload-doc", "span2"],
      ["description", "Descricao", "textarea", "span2"],
    ],
  },
  usuarios: {
    endpoint: "usuarios.php",
    saveEndpoint: "usuarios.php",
    title: "Usuarios e Permissoes",
    subtitle: "Acessos autorizados para o painel administrativo.",
    empty: "Nenhum usuario cadastrado.",
    primary: "name",
    columns: [
      ["name", "Nome"],
      ["email", "E-mail"],
      ["role", "Perfil"],
      ["active", "Status", "active"],
    ],
    fields: [
      ["name", "Nome", "text", "", "", true],
      ["email", "E-mail", "text", "", "", true],
      ["password", "Senha", "password"],
      ["role", "Perfil", "select", "", [["admin", "Admin"], ["editor", "Editor"]]],
      ["active", "Status", "select", "", [["1", "Ativo"], ["0", "Inativo"]]],
    ],
  },
};

function $(selector, root = document) { return root.querySelector(selector); }
function $all(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function dateBR(value) {
  if (!value) return "-";
  const raw = String(value).trim();
  const parts = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (parts) {
    return `${parts[3]}/${parts[2]}/${parts[1]}`;
  }
  const date = new Date(raw.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? esc(value) : date.toLocaleDateString("pt-BR");
}

function inputDate(value) {
  return value ? String(value).slice(0, 10) : "";
}

function endpointFor(key) {
  return crud[key].saveEndpoint || crud[key].endpoint;
}

function pageTitle(page) {
  return sections[page] || page;
}

function normalizeSearch(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function assetUrl(value) {
  const path = String(value || "").trim();
  if (!path) return "";
  if (/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(path)) return path;
  if (path.startsWith("/")) return path;
  return "../" + path.replace(/^\.\.\//, "").replace(/^\.\//, "");
}

function toast(message, type = "info") {
  let wrap = $("#toast-w");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toast-w";
    wrap.className = "toast-w";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast t-" + ({ success: "success", error: "error", warning: "warning", info: "info", s: "success", e: "error", w: "warning" }[type] || type);
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add("fo"); setTimeout(() => el.remove(), 320); }, 3000);
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const response = await fetch(API_BASE + path, {
    credentials: "include",
    ...options,
    headers,
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    throw new Error("A API retornou uma resposta invalida.");
  }
  if (!response.ok || (json && json.ok === false)) {
    throw new Error((json && json.error) || "Erro HTTP " + response.status);
  }
  return json;
}

async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  return api("upload.php", { method: "POST", body: form });
}

async function checkAuth() {
  const json = await api("auth.php");
  state.user = json.authenticated ? json.user : null;
  return !!state.user;
}

function renderLogin(error = "") {
  document.body.innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <div class="auth-mark">VP</div>
        <h1>Painel Administrativo</h1>
        <p>Camara Municipal de Vargem Grande do Rio Pardo</p>
        ${error ? `<div class="alert">${esc(error)}</div>` : ""}
        <form id="login-form" class="auth-form">
          <label>E-mail</label>
          <input class="fc" name="email" type="email" autocomplete="username" required>
          <label>Senha</label>
          <input class="fc" name="password" type="password" autocomplete="current-password" required>
          <button class="btn btn-p btn-full" type="submit">Entrar</button>
        </form>
      </section>
    </main>
    <div class="toast-w" id="toast-w"></div>
  `;

  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const json = await api("auth.php", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      state.user = json.user;
      renderShell();
      bindNav();
      go("dashboard");
    } catch (err) {
      renderLogin(err.message);
    }
  });
}

function menuGroup(title, items) {
  return `<div class="grp-lbl">${title}</div>` + items.map((item) => `
    <button class="ni" type="button" data-page="${item[0]}">
      <span class="ni-ico">${item[1]}</span>
      <span class="ni-lbl">${item[2]}</span>
      ${item[3] ? `<span class="nbdg" id="${item[3]}">0</span>` : ""}
    </button>
  `).join("");
}

function renderShell() {
  const initials = (state.user?.name || state.user?.email || "AD").slice(0, 2).toUpperCase();
  document.body.innerHTML = `
    <div id="app">
      <aside class="sb" id="sb">
        <div class="sb-head">
          <div class="sb-logo-wrap">VP</div>
          <div class="sb-ttl"><div class="t1">Vargem Grande</div><div class="t2">Painel Administrativo</div></div>
        </div>
        <div class="sb-usr">
          <div class="av">${esc(initials)}</div>
          <div class="usr-info"><div class="usr-name">${esc(state.user?.name || "Administrador")}</div><div class="usr-role">${esc(state.user?.role || "gestao")}</div></div>
          <div class="usr-dot"></div>
        </div>
        <nav class="sb-nav">
          ${menuGroup("Visao geral", [["dashboard", "D", "Dashboard"]])}
          ${menuGroup("Gestao do site", [["noticias", "N", "Noticias", "bdg-noticias"], ["vereadores", "V", "Vereadores"], ["diario", "DO", "Diario Oficial"], ["legislacao", "L", "Legislacao"], ["concursos", "C", "Concursos"]])}
          ${menuGroup("Atendimento", [["esic", "?", "e-SIC", "bdg-esic"], ["ouvidoria", "!", "Ouvidoria", "bdg-ouvidoria"]])}
          ${menuGroup("Sistema", [["config", "*", "Configuracoes"], ["usuarios", "U", "Usuarios"]])}
        </nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <div class="tb-bc"><span>Painel</span><span>/</span><span class="cur" id="bc-cur">Dashboard</span></div>
          <div class="tb-acts">
            <button class="tb-ico" type="button" title="Atualizar" onclick="refreshCurrent()">↻</button>
            <button class="tb-ico" type="button" title="Abrir site" onclick="window.open('../', '_blank')">↗</button>
            <button class="tb-ico" type="button" title="Sair" onclick="logout()">×</button>
          </div>
        </header>
        <section class="content" id="view"></section>
      </main>
    </div>
    <div class="toast-w" id="toast-w"></div>
  `;
}

function bindNav() {
  $all(".ni").forEach((button) => button.addEventListener("click", () => go(button.dataset.page)));
}

async function logout() {
  await api("auth.php", { method: "DELETE" });
  state.user = null;
  renderLogin();
}

async function go(page) {
  state.current = page;
  $all(".ni").forEach((item) => item.classList.toggle("act", item.dataset.page === page));
  const current = $("#bc-cur");
  if (current) current.textContent = pageTitle(page);
  history.replaceState({ page }, "", "#" + page);
  await renderPage(page);
}

async function refreshCurrent() {
  await renderPage(state.current);
  toast("Atualizado.", "success");
}

async function safeLoad(key, loader) {
  try {
    return await loader();
  } catch (error) {
    console.warn(key, error);
    toast("Nao foi possivel carregar " + pageTitle(key) + ": " + error.message, "warning");
    state.data[key] = key === "settings" ? {} : [];
    return state.data[key];
  }
}

async function loadCrud(key) {
  const json = await api(crud[key].endpoint);
  state.data[key] = json.data || [];
  return state.data[key];
}

async function loadRequests(key) {
  const json = await api(key === "esic" ? "esic.php" : "ouvidoria.php");
  state.data[key] = json.data || [];
  return state.data[key];
}

async function loadSettings() {
  const json = await api("settings.php");
  state.data.settings = json.data || {};
  return state.data.settings;
}

function updateBadges() {
  const news = $("#bdg-noticias");
  const esic = $("#bdg-esic");
  const ouv = $("#bdg-ouvidoria");
  if (news) news.textContent = state.data.noticias.filter((item) => item.status === "draft").length || "";
  if (esic) esic.textContent = state.data.esic.filter((item) => item.status !== "respondido" && item.status !== "arquivado").length || "";
  if (ouv) ouv.textContent = state.data.ouvidoria.filter((item) => item.status !== "respondido" && item.status !== "arquivado").length || "";
}

function stat(icon, value, label, page) {
  return `<button class="scard" type="button" onclick="go('${page}')"><div class="sc-ico">${esc(icon)}</div><div class="sc-num">${esc(value)}</div><div class="sc-lbl">${esc(label)}</div></button>`;
}

function quickButton(label, page, modalKey = "") {
  const action = modalKey ? `go('${page}').then(()=>openCrudModal('${modalKey}'))` : `go('${page}')`;
  return `<button class="btn btn-s btn-full" type="button" onclick="${action}">${esc(label)}</button>`;
}

async function renderDashboard() {
  await Promise.allSettled([
    safeLoad("noticias", () => loadCrud("noticias")),
    safeLoad("vereadores", () => loadCrud("vereadores")),
    safeLoad("diario", () => loadCrud("diario")),
    safeLoad("legislacao", () => loadCrud("legislacao")),
    safeLoad("concursos", () => loadCrud("concursos")),
    safeLoad("esic", () => loadRequests("esic")),
    safeLoad("ouvidoria", () => loadRequests("ouvidoria")),
  ]);
  updateBadges();

  const openEsic = state.data.esic.filter((item) => item.status !== "respondido" && item.status !== "arquivado").length;
  const openOuv = state.data.ouvidoria.filter((item) => item.status !== "respondido" && item.status !== "arquivado").length;
  const lastNews = state.data.noticias.slice(0, 5);

  $("#view").innerHTML = `
    <div class="ph">
      <div><h1>Bem-vindo ao <em>Painel</em></h1><p>Resumo dos dados publicados no site e recebidos pelo atendimento.</p></div>
      <div class="ph-acts">
        <button class="btn btn-s" onclick="go('diario').then(()=>openCrudModal('diario'))">Nova edicao DO</button>
        <button class="btn btn-p" onclick="go('noticias').then(()=>openCrudModal('noticias'))">Nova noticia</button>
      </div>
    </div>
    <div class="notice ok"><strong>Sistema operacional.</strong><span> O painel esta ligado ao backend. Cadastre os dados reais e eles aparecem no site publico.</span></div>
    <div class="stat-grid">
      ${stat("V", state.data.vereadores.length, "Vereadores", "vereadores")}
      ${stat("N", state.data.noticias.length, "Noticias", "noticias")}
      ${stat("D", state.data.diario.length, "Edicoes DO", "diario")}
      ${stat("L", state.data.legislacao.length, "Leis e atos", "legislacao")}
      ${stat("C", state.data.concursos.length, "Concursos", "concursos")}
      ${stat("S", openEsic, "e-SIC abertos", "esic")}
      ${stat("O", openOuv, "Ouvidoria aberta", "ouvidoria")}
    </div>
    <div class="dash-grid">
      <div class="tw">
        <div class="th"><div class="tt">Acoes rapidas</div></div>
        <div class="action-list">
          ${quickButton("Gerenciar vereadores", "vereadores")}
          ${quickButton("Publicar noticia", "noticias", "noticias")}
          ${quickButton("Nova edicao do Diario Oficial", "diario", "diario")}
          ${quickButton("Cadastrar lei ou decreto", "legislacao", "legislacao")}
          ${quickButton("Responder e-SIC", "esic")}
          ${quickButton("Configuracoes da Camara", "config")}
        </div>
      </div>
      <div class="tw">
        <div class="th"><div class="tt">Checklist TAC / MP</div></div>
        <div class="check-list">
          ${checkItem("ok", "Acesso publico e menu de transparencia")}
          ${checkItem("ok", "LAI, Diario Oficial, legislacao e atendimento")}
          ${checkItem(state.data.settings.phone && state.data.settings.email && state.data.settings.address ? "ok" : "warn", "Contato institucional preenchido")}
          ${checkItem(state.data.vereadores.length ? "ok" : "warn", "Vereadores cadastrados")}
          ${checkItem(state.data.legislacao.length ? "ok" : "warn", "Leis reais cadastradas")}
          ${checkItem("ok", "Receitas, despesas e RH vinculados ao portal oficial")}
        </div>
      </div>
    </div>
    <div class="tw">
      <div class="th"><div class="tt">Ultimas noticias</div><button class="btn btn-p" onclick="go('noticias')">Gerenciar</button></div>
      ${tableFor("noticias", lastNews, true)}
    </div>
  `;
}

function checkItem(type, text) {
  return `<div class="check ${type}"><span>${type === "ok" ? "OK" : "!"}</span><strong>${esc(text)}</strong></div>`;
}

function statusBadge(value) {
  const status = String(value || "").toLowerCase();
  const ok = ["published", "publicado", "respondido", "ativo", "em_andamento"].includes(status);
  const warn = ["draft", "rascunho", "novo", "suspenso"].includes(status);
  const label = {
    published: "Publicado",
    draft: "Rascunho",
    archived: "Arquivado",
    public: "Publicado",
    novo: "Novo",
    em_andamento: "Em andamento",
    respondido: "Respondido",
    arquivado: "Arquivado",
  }[status] || value || "-";
  return `<span class="sp ${ok ? "sp-ok" : warn ? "sp-pend" : "sp-err"}">${esc(label)}</span>`;
}

function partyBadge(value) {
  if (!value) return "-";
  return `<span class="sp sp-party">${esc(value)}</span>`;
}

function cellValue(value, type) {
  if (type === "date") return dateBR(value);
  if (type === "status") return statusBadge(value);
  if (type === "party") return partyBadge(value);
  if (type === "active") return `<span class="sp ${Number(value) !== 0 ? "sp-ok" : "sp-err"}">${Number(value) !== 0 ? "Ativo" : "Inativo"}</span>`;
  return esc(value || "-");
}

function rowAvatar(row, key) {
  const value = key === "vereadores" ? row.photo_url : row.image_url;
  const name = row.name || row.title || "?";
  if (value) return `<img class="av-sm-img" src="${esc(assetUrl(value))}" alt="" style="width:42px;height:42px;max-width:42px;max-height:42px;object-fit:cover;border-radius:12px;display:block">`;
  return `<div class="av-sm">${esc(name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?")}</div>`;
}

function filteredRows(key, rows) {
  const query = normalizeSearch(state.filters[key] || "");
  if (!query) return rows;
  return rows.filter((row) => normalizeSearch(Object.values(row).join(" ")).includes(query));
}

function tableFor(key, rows, compact = false) {
  const cfg = crud[key];
  const filtered = filteredRows(key, rows);
  if (!filtered.length) return `<div class="panel-note">${esc(cfg.empty)}</div>`;
  return `
    <table>
      <thead><tr>${key === "vereadores" ? "<th>Foto</th>" : ""}${cfg.columns.map((col) => `<th>${esc(col[1])}</th>`).join("")}<th>Acoes</th></tr></thead>
      <tbody>
        ${filtered.map((row) => `
          <tr>
            ${key === "vereadores" ? `<td class="photo-cell">${rowAvatar(row, key)}</td>` : ""}
            ${cfg.columns.map((col) => `<td class="${col[0] === cfg.primary ? "tc" : ""}">${cellValue(row[col[0]], col[2])}</td>`).join("")}
            <td>
              <div class="row-actions">
                ${row.file_url ? `<button class="btn btn-s btn-sm" onclick="openAsset('${esc(assetUrl(row.file_url))}')">Abrir</button>` : ""}
                ${!compact ? `<button class="btn btn-s btn-sm" onclick="openCrudModal('${key}', ${Number(row.id)})">Editar</button>
                <button class="btn btn-d btn-sm" onclick="removeCrud('${key}', ${Number(row.id)})">Excluir</button>` : `<button class="btn btn-s btn-sm" onclick="go('${key}')">Ver</button>`}
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function moduleStats(key, rows) {
  const published = rows.filter((row) => ["published", "publicado"].includes(String(row.status || "").toLowerCase()) || Number(row.active) === 1).length;
  const draft = rows.filter((row) => ["draft", "rascunho", "novo"].includes(String(row.status || "").toLowerCase())).length;
  return `
    <div class="mini-stats">
      <div><strong>${rows.length}</strong><span>Total</span></div>
      <div><strong>${published}</strong><span>Publicado/ativo</span></div>
      <div><strong>${draft}</strong><span>Pendente</span></div>
    </div>
  `;
}

async function renderCrud(key) {
  const cfg = crud[key];
  const rows = await safeLoad(key, () => loadCrud(key));
  updateBadges();
  $("#view").innerHTML = `
    <div class="ph">
      <div><h1>${esc(cfg.title)} <em></em></h1><p>${esc(cfg.subtitle)}</p></div>
      <button class="btn btn-p" onclick="openCrudModal('${key}')">Novo registro</button>
    </div>
    ${moduleStats(key, rows)}
    <div class="tw">
      <div class="th">
        <div class="tt">Lista</div>
        <div class="tf"><input class="fc search" value="${esc(state.filters[key] || "")}" placeholder="Buscar..." oninput="setFilter('${key}', this.value)"></div>
      </div>
      ${tableFor(key, rows)}
    </div>
    ${modalCrud(key)}
  `;
}

function modalCrud(key) {
  const cfg = crud[key];
  return `
    <div class="mo" id="mo-${key}">
      <div class="md md-wide ${key === "legislacao" ? "law-md" : ""}">
        <div class="md-h"><h3>${esc(cfg.modalTitle || cfg.title)}</h3><button class="md-x" onclick="closeMo('mo-${key}')">×</button></div>
        <div class="md-b">
          <input type="hidden" id="${key}-id">
          <div class="fg">
            ${cfg.fields.map(([name, label, type, span, options, required]) => fieldHtml(key, name, label, type, span, options, required)).join("")}
          </div>
        </div>
        <div class="md-f">
          ${key === "legislacao" ? `<button class="btn btn-s" onclick="previewLaw()">Preview</button>` : ""}
          <button class="btn btn-s" onclick="closeMo('mo-${key}')">Cancelar</button>
          <button class="btn btn-p" onclick="submitCrud('${key}')">Salvar</button>
        </div>
      </div>
    </div>
  `;
}

function fieldHtml(key, name, label, type, span, options, required) {
  const id = `${key}-${name}`;
  const req = required ? " required" : "";
  if (type === "law-pdf") {
    return `
      <div class="fgrp ${span || ""}">
        <label>${esc(label)}</label>
        <div class="law-upload" onclick="document.getElementById('${id}-file').click()" ondragover="event.preventDefault();this.classList.add('drag')" ondragleave="this.classList.remove('drag')" ondrop="handleLawPdfDrop(event)">
          <div class="law-upload-ico">PDF</div>
          <strong>Anexar PDF original</strong>
          <span>O painel salva o arquivo intacto e tenta separar o texto em artigos editaveis.</span>
          <div class="law-upload-status" id="${id}-status"></div>
        </div>
        <div class="upload-row">
          <input class="fc" id="${id}" type="text" placeholder="URL do PDF ou arquivo enviado" oninput="updateUploadPreview('${key}', '${name}')">
          <input id="${id}-file" type="file" accept="application/pdf,.pdf" hidden onchange="handleLawPdfUpload(this.files[0])">
          <button class="btn btn-s" type="button" onclick="document.getElementById('${id}-file').click()">Upload</button>
        </div>
        <div class="upload-preview" id="${id}-preview"></div>
      </div>
    `;
  }
  if (type === "law-articles") {
    return `
      <div class="fgrp ${span || ""}">
        <div class="law-articles-head">
          <label>${esc(label)}</label>
          <div class="law-article-actions">
            <span class="law-article-count" id="${id}-count">0 artigos</span>
            <button class="btn btn-s btn-sm" type="button" onclick="addLawArticle()">+ Artigo</button>
          </div>
        </div>
        <textarea class="fc law-content-hidden" id="${id}" aria-hidden="true" tabindex="-1"></textarea>
        <div class="law-articles" id="${id}-cards"></div>
      </div>
    `;
  }
  if (type === "textarea") {
    return `<div class="fgrp ${span || ""}"><label>${esc(label)}${required ? " *" : ""}</label><textarea class="fc" id="${id}"${req}></textarea></div>`;
  }
  if (type === "select") {
    return `<div class="fgrp ${span || ""}"><label>${esc(label)}${required ? " *" : ""}</label><select class="fc" id="${id}"${req}>${(options || []).map(([value, text]) => `<option value="${esc(value)}">${esc(text)}</option>`).join("")}</select></div>`;
  }
  if (type === "upload-image" || type === "upload-doc") {
    const accept = type === "upload-image" ? "image/png,image/jpeg,image/webp,image/gif" : "application/pdf,.pdf,.doc,.docx";
    const hint = type === "upload-image" ? "Enviar imagem ou colar URL" : "Enviar PDF/documento ou colar URL";
    return `
      <div class="fgrp ${span || ""}">
        <label>${esc(label)}</label>
        <div class="upload-row">
          <input class="fc" id="${id}" type="text" placeholder="${hint}" oninput="updateUploadPreview('${key}', '${name}')">
          <input id="${id}-file" type="file" accept="${accept}" hidden onchange="handleUpload('${key}', '${name}', this.files[0])">
          <button class="btn btn-s" type="button" onclick="document.getElementById('${id}-file').click()">Upload</button>
        </div>
        <div class="upload-preview" id="${id}-preview"></div>
      </div>
    `;
  }
  return `<div class="fgrp ${span || ""}"><label>${esc(label)}${required ? " *" : ""}</label><input class="fc" id="${id}" type="${esc(type || "text")}"${req}></div>`;
}

function defaultFor(name) {
  if (name === "status") return "published";
  if (name === "law_type") return "Lei Ordinaria";
  if (name === "active") return "1";
  if (name === "legislature") return "2025-2028";
  if (name === "display_order") return "0";
  return "";
}

function openCrudModal(key, id) {
  const row = id ? state.data[key].find((item) => Number(item.id) === Number(id)) || {} : {};
  $(`#${key}-id`).value = row.id || "";
  crud[key].fields.forEach(([name, , type]) => {
    const input = $(`#${key}-${name}`);
    if (!input) return;
    if (type === "date") input.value = inputDate(row[name]);
    else if (name === "password") input.value = "";
    else input.value = row[name] ?? defaultFor(name);
    if (type === "upload-image" || type === "upload-doc" || type === "law-pdf") updateUploadPreview(key, name);
  });
  if (key === "legislacao") hydrateLawEditor(row);
  openMo(`mo-${key}`);
}

async function handleUpload(key, name, file) {
  if (!file) return;
  const button = document.activeElement;
  if (button) button.disabled = true;
  try {
    toast("Enviando arquivo...", "info");
    const json = await uploadFile(file);
    $(`#${key}-${name}`).value = json.url;
    updateUploadPreview(key, name);
    toast("Arquivo enviado com sucesso.", "success");
  } catch (error) {
    toast(error.message, "error");
  } finally {
    if (button) button.disabled = false;
  }
}

function updateUploadPreview(key, name) {
  const input = $(`#${key}-${name}`);
  const target = $(`#${key}-${name}-preview`);
  if (!input || !target) return;
  const value = input.value.trim();
  if (!value) {
    target.innerHTML = "";
    return;
  }
  const url = assetUrl(value);
  if (/\.(png|jpe?g|webp|gif)$/i.test(value) || value.startsWith("data:image")) {
    target.innerHTML = `<img src="${esc(url)}" alt="">`;
  } else {
    target.innerHTML = `<button class="btn btn-s btn-sm" type="button" onclick="openAsset('${esc(url)}')">Abrir arquivo</button><small>${esc(value)}</small>`;
  }
}

function setLawUploadStatus(message, type = "info") {
  const target = $("#legislacao-file_url-status");
  if (!target) return;
  target.textContent = message || "";
  target.className = "law-upload-status " + type;
}

function lawArticleHeading(index) {
  return "Art. " + (index + 1);
}

function normalizeLawArticleHeading(value, index) {
  const clean = String(value || "").trim();
  return clean || lawArticleHeading(index);
}

function composeLawContent(articles = state.lawArticles) {
  return (articles || []).map((article, index) => {
    const heading = normalizeLawArticleHeading(article.heading, index);
    const text = String(article.text || "").trim();
    return text ? heading + "\n" + text : heading;
  }).join("\n\n").trim();
}

function updateLawContentField() {
  const input = $("#legislacao-content");
  if (input) input.value = composeLawContent();
  const count = $("#legislacao-content-count");
  if (count) {
    const total = state.lawArticles.length;
    count.textContent = total + " artigo" + (total === 1 ? "" : "s");
  }
}

function collectLawArticles() {
  const cards = $all("#legislacao-content-cards .law-article-card");
  state.lawArticles = cards.map((card, index) => ({
    heading: normalizeLawArticleHeading($("[data-law-heading]", card)?.value, index),
    text: String($("[data-law-text]", card)?.value || "").trim(),
  }));
  updateLawContentField();
  return state.lawArticles;
}

function renderLawArticles(articles = []) {
  state.lawArticles = articles.map((article, index) => ({
    heading: normalizeLawArticleHeading(article.heading || article.art, index),
    text: String(article.text || article.texto || "").trim(),
  }));
  const target = $("#legislacao-content-cards");
  if (!target) return;
  if (!state.lawArticles.length) {
    target.innerHTML = `
      <div class="law-empty">
        <strong>Nenhum artigo cadastrado ainda.</strong>
        <span>Use o PDF para tentar separar automaticamente ou adicione os artigos manualmente.</span>
      </div>
    `;
    updateLawContentField();
    return;
  }
  target.innerHTML = state.lawArticles.map((article, index) => `
    <article class="law-article-card" data-index="${index}">
      <div class="law-article-top">
        <input class="fc law-article-title" data-law-heading value="${esc(normalizeLawArticleHeading(article.heading, index))}" oninput="syncLawArticles()">
        <div class="law-article-tools">
          <button class="btn btn-s btn-sm" type="button" onclick="moveLawArticle(${index}, -1)">Subir</button>
          <button class="btn btn-s btn-sm" type="button" onclick="moveLawArticle(${index}, 1)">Descer</button>
          <button class="btn btn-d btn-sm" type="button" onclick="removeLawArticle(${index})">Excluir</button>
        </div>
      </div>
      <textarea class="fc law-article-text" data-law-text oninput="syncLawArticles()" placeholder="Texto deste artigo...">${esc(article.text)}</textarea>
    </article>
  `).join("");
  updateLawContentField();
}

function syncLawArticles() {
  collectLawArticles();
}

function addLawArticle() {
  collectLawArticles();
  state.lawArticles.push({ heading: lawArticleHeading(state.lawArticles.length), text: "" });
  renderLawArticles(state.lawArticles);
  const cards = $all("#legislacao-content-cards .law-article-card");
  const last = cards[cards.length - 1];
  if (last) {
    last.scrollIntoView({ block: "nearest" });
    const textarea = $("[data-law-text]", last);
    if (textarea) textarea.focus();
  }
}

function removeLawArticle(index) {
  if (!confirm("Excluir este artigo?")) return;
  collectLawArticles();
  state.lawArticles.splice(index, 1);
  renderLawArticles(state.lawArticles);
}

function moveLawArticle(index, dir) {
  collectLawArticles();
  const next = index + dir;
  if (next < 0 || next >= state.lawArticles.length) return;
  const current = state.lawArticles[index];
  state.lawArticles[index] = state.lawArticles[next];
  state.lawArticles[next] = current;
  renderLawArticles(state.lawArticles);
}

function parseLawArticlesFromText(text) {
  const source = String(text || "").replace(/\r/g, "").trim();
  if (!source) return [];
  const pattern = /(^|\n)\s*((?:Art\.?|Artigo)\s*\d+[A-Za-z\u00ba\u00b0]*(?:-[A-Za-z])?\.?)/gi;
  const matches = Array.from(source.matchAll(pattern));
  if (!matches.length) return [];
  return matches.map((match, index) => {
    const next = matches[index + 1];
    const start = match.index + match[0].length;
    const end = next ? next.index : source.length;
    const heading = match[2]
      .replace(/^Artigo\s+/i, "Art. ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.\s]+$/, "");
    return {
      heading,
      text: source.slice(start, end).trim(),
    };
  }).filter((article) => article.heading);
}

function cleanExtractedLawText(raw) {
  const lines = String(raw || "").replace(/\r/g, "").split("\n");
  const cleaned = [];
  let previousBlank = false;
  const isNoise = (line) => {
    const normalized = normalizeSearch(line).replace(/\s+/g, " ").trim();
    if (!normalized) return false;
    if (normalized.length <= 2) return true;
    if (/^\d{1,3}$/.test(normalized)) return true;
    if (/^pagina\s+\d+/.test(normalized) || /^\d+\s*(\/|de)\s*\d+$/.test(normalized)) return true;
    if (/^(cep|cnpj|telefone|fone|email|e-mail)\b/.test(normalized)) return true;
    if (/^(www\.|https?:\/\/)/.test(normalized)) return true;
    if (/^(rua|avenida|av\.|praca|travessa)\s+/.test(normalized) && normalized.length < 90) return true;
    if (/^(camara|prefeitura|municipio)\s+(municipal\s+)?/.test(normalized) && normalized.length < 90) return true;
    if (/^(documento|sistema)\s+(assinado|gerado|de gestao|de transparencia)/.test(normalized)) return true;
    if (/^[-_=*]{3,}$/.test(normalized)) return true;
    return false;
  };
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (isNoise(trimmed)) return;
    if (!trimmed) {
      if (!previousBlank) cleaned.push("");
      previousBlank = true;
      return;
    }
    previousBlank = false;
    cleaned.push(trimmed);
  });
  return cleaned.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function formatDateInput(day, month, year) {
  return String(year).padStart(4, "0") + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function applyLawMetadata(text) {
  const normalized = normalizeSearch(text);
  const typeInput = $("#legislacao-law_type");
  const numberInput = $("#legislacao-law_number");
  const dateInputEl = $("#legislacao-publication_date");
  const summaryInput = $("#legislacao-summary");

  if (typeInput) {
    let detected = "Lei Ordinaria";
    if (normalized.includes("lei complementar")) detected = "Lei Complementar";
    else if (normalized.includes("decreto legislativo")) detected = "Decreto Legislativo";
    else if (normalized.includes("decreto")) detected = "Decreto";
    else if (normalized.includes("resolucao")) detected = "Resolucao";
    else if (normalized.includes("portaria")) detected = "Portaria";
    const option = Array.from(typeInput.options).find((item) => normalizeSearch(item.value) === normalizeSearch(detected));
    if (option) typeInput.value = option.value;
  }

  if (numberInput && !numberInput.value.trim()) {
    const numberMatch = text.match(/(?:lei|decreto|resolu[cç][aã]o|portaria|emenda)[^\n]{0,90}?n[\u00ba\u00b0o.]?\s*([0-9.]+(?:\s*[\/.-]\s*\d{4})?)/i)
      || text.match(/\bn[\u00ba\u00b0o.]?\s*([0-9.]+\s*\/\s*\d{4})/i);
    if (numberMatch) numberInput.value = numberMatch[1].replace(/\s+/g, "").replace(".", "");
  }

  if (dateInputEl && !dateInputEl.value) {
    const slashDate = text.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
    const monthNames = { janeiro: 1, fevereiro: 2, marco: 3, abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12 };
    const writtenDate = normalized.match(/\b(\d{1,2})\s+de\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})\b/);
    if (slashDate) dateInputEl.value = formatDateInput(slashDate[1], slashDate[2], slashDate[3]);
    else if (writtenDate) dateInputEl.value = formatDateInput(writtenDate[1], monthNames[writtenDate[2]], writtenDate[3]);
  }

  if (summaryInput && !summaryInput.value.trim()) {
    const firstArticle = text.search(/(^|\n)\s*(Art\.?|Artigo)\s*\d+/i);
    const head = firstArticle > -1 ? text.slice(0, firstArticle) : text.slice(0, 900);
    const summaryMatch = head.match(/ementa[:\s-]*([\s\S]{20,500})/i)
      || head.match(/\b(disp[oõ]e|institui|autoriza|regulamenta|estabelece|altera)[\s\S]{20,420}/i);
    if (summaryMatch) {
      const summary = (summaryMatch[1] || summaryMatch[0]).replace(/\s+/g, " ").trim();
      summaryInput.value = summary.slice(0, 500);
    }
  }
}

async function loadPdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib;
  await new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-pdfjs]");
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.dataset.pdfjs = "1";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return window.pdfjsLib;
}

async function extractTextFromPdf(file) {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    setLawUploadStatus("Lendo pagina " + pageNumber + " de " + pdf.numPages + "...", "info");
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent({ includeMarkedContent: false });
    const rows = [];
    content.items.forEach((item) => {
      const value = String(item.str || "").trim();
      if (!value) return;
      const transform = item.transform || [0, 0, 0, 0, 0, 0];
      const x = transform[4] || 0;
      const y = transform[5] || 0;
      let row = rows.find((entry) => Math.abs(entry.y - y) < 3);
      if (!row) {
        row = { y, parts: [] };
        rows.push(row);
      }
      row.parts.push({ x, value });
    });
    pages.push(rows
      .sort((a, b) => b.y - a.y)
      .map((row) => row.parts.sort((a, b) => a.x - b.x).map((part) => part.value).join(" "))
      .join("\n"));
  }
  return cleanExtractedLawText(pages.join("\n\n"));
}

function applyExtractedLawText(text) {
  const clean = cleanExtractedLawText(text);
  applyLawMetadata(clean);
  const articles = parseLawArticlesFromText(clean);
  if (articles.length) {
    renderLawArticles(articles);
    toast(articles.length + " artigos extraidos para revisao.", "success");
  } else {
    renderLawArticles(clean ? [{ heading: "Texto extraido", text: clean }] : []);
    toast("Texto extraido, mas os artigos nao foram identificados. Use + Artigo para cadastrar manualmente.", "warning");
  }
}

async function handleLawPdfUpload(file) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name || "") && file.type !== "application/pdf") {
    toast("Envie um arquivo PDF.", "warning");
    return;
  }
  state.lawPdfFileName = file.name || "";
  state.lawPdfFileSize = file.size || 0;
  setLawUploadStatus("Salvando PDF original...", "info");
  try {
    const uploaded = await uploadFile(file);
    const input = $("#legislacao-file_url");
    if (input) input.value = uploaded.url || "";
    updateUploadPreview("legislacao", "file_url");
    setLawUploadStatus("PDF original preservado. Extraindo texto...", "success");
  } catch (error) {
    setLawUploadStatus("Falha ao salvar PDF original.", "error");
    toast(error.message, "error");
    return;
  }

  try {
    const text = await extractTextFromPdf(file);
    applyExtractedLawText(text);
    setLawUploadStatus("PDF original salvo e artigos prontos para revisao.", "success");
  } catch (error) {
    console.warn(error);
    setLawUploadStatus("PDF salvo. Extracao indisponivel; cadastre manualmente.", "warning");
    toast("PDF salvo. A leitura automatica falhou, mas voce pode adicionar os artigos manualmente.", "warning");
  }
}

function handleLawPdfDrop(event) {
  event.preventDefault();
  const zone = event.currentTarget;
  if (zone) zone.classList.remove("drag");
  const file = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files[0] : null;
  handleLawPdfUpload(file);
}

function hydrateLawEditor(row = {}) {
  state.lawPdfFileName = "";
  state.lawPdfFileSize = 0;
  setLawUploadStatus(row.file_url ? "PDF original ja vinculado a este cadastro." : "", row.file_url ? "success" : "info");
  const parsed = parseLawArticlesFromText(row.content || "");
  if (parsed.length) {
    renderLawArticles(parsed);
  } else if (String(row.content || "").trim()) {
    renderLawArticles([{ heading: "Texto da lei", text: String(row.content || "").trim() }]);
  } else {
    renderLawArticles([]);
  }
}

async function submitCrud(key) {
  const cfg = crud[key];
  const id = $(`#${key}-id`).value;
  const payload = {};
  cfg.fields.forEach(([name]) => {
    const input = $(`#${key}-${name}`);
    if (input) payload[name] = input.value;
  });
  const missing = cfg.fields.find(([name, label, , , , required]) => required && !String(payload[name] || "").trim());
  if (missing) {
    toast("Preencha: " + missing[1], "warning");
    return;
  }
  if (key === "usuarios" && !id && !payload.password) {
    toast("Senha obrigatoria para novo usuario.", "warning");
    return;
  }
  if (id && key === "usuarios" && !payload.password) delete payload.password;
  if (key === "legislacao") {
    payload.content = composeLawContent(collectLawArticles());
    payload.title = `${payload.law_type || "Ato Normativo"} No. ${payload.law_number || ""}`.trim();
  }
  await api(endpointFor(key) + (id ? "?id=" + encodeURIComponent(id) : ""), {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  closeMo(`mo-${key}`);
  toast("Salvo com sucesso.", "success");
  await renderCrud(key);
}

async function removeCrud(key, id) {
  if (!confirm("Excluir este registro?")) return;
  await api(endpointFor(key) + "?id=" + encodeURIComponent(id), { method: "DELETE" });
  toast("Excluido com sucesso.", "success");
  await renderCrud(key);
}

function setFilter(key, value) {
  state.filters[key] = value;
  const wrap = $(".tw");
  if (!wrap) return;
  const cfg = crud[key];
  const tableArea = wrap.lastElementChild;
  if (tableArea) {
    const html = tableFor(key, state.data[key]);
    if (html.startsWith("<table")) tableArea.outerHTML = html;
    else tableArea.outerHTML = html;
  }
}

function requestTable(key, rows) {
  if (!rows.length) return `<div class="panel-note">Nenhum pedido recebido.</div>`;
  return `
    <table>
      <thead><tr><th>Protocolo</th><th>Data</th><th>Solicitante</th><th>Assunto</th><th>Status</th><th>Acoes</th></tr></thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td class="tc">${esc(row.protocol || row.id)}</td>
            <td>${dateBR(row.created_at)}</td>
            <td>${esc(row.requester_name || "-")}</td>
            <td>${esc(row.subject || row.type || "-")}</td>
            <td>${statusBadge(row.status || "novo")}</td>
            <td>
              <div class="row-actions">
                <button class="btn btn-s btn-sm" onclick="openRequestModal('${key}', ${Number(row.id)})">Responder</button>
                <button class="btn btn-d btn-sm" onclick="removeRequest('${key}', ${Number(row.id)})">Excluir</button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function renderRequests(key) {
  const rows = await safeLoad(key, () => loadRequests(key));
  updateBadges();
  const open = rows.filter((row) => row.status !== "respondido" && row.status !== "arquivado").length;
  $("#view").innerHTML = `
    <div class="ph"><div><h1>${esc(pageTitle(key))} <em></em></h1><p>Solicitacoes recebidas pelo site publico.</p></div></div>
    <div class="mini-stats"><div><strong>${rows.length}</strong><span>Total</span></div><div><strong>${open}</strong><span>Abertos</span></div><div><strong>${rows.length - open}</strong><span>Finalizados</span></div></div>
    <div class="notice ${open ? "warn" : "ok"}"><strong>${open ? "Atencao." : "Tudo em dia."}</strong><span> ${open ? "Existem pedidos aguardando andamento ou resposta." : "Nao ha pedidos pendentes neste modulo."}</span></div>
    <div class="tw"><div class="th"><div class="tt">Solicitacoes</div></div>${requestTable(key, rows)}</div>
    <div class="mo" id="mo-request">
      <div class="md">
        <div class="md-h"><h3>Responder solicitacao</h3><button class="md-x" onclick="closeMo('mo-request')">×</button></div>
        <div class="md-b">
          <input type="hidden" id="request-key"><input type="hidden" id="request-id">
          <div class="request-summary" id="request-summary"></div>
          <div class="fg request-form">
            <div class="fgrp"><label>Status</label><select class="fc" id="request-status"><option value="novo">Novo</option><option value="em_andamento">Em andamento</option><option value="respondido">Respondido</option><option value="arquivado">Arquivado</option></select></div>
            <div class="fgrp span2"><label>Resposta</label><textarea class="fc" id="request-response"></textarea></div>
          </div>
        </div>
        <div class="md-f"><button class="btn btn-s" onclick="closeMo('mo-request')">Cancelar</button><button class="btn btn-p" onclick="submitRequest()">Salvar resposta</button></div>
      </div>
    </div>
  `;
}

function openRequestModal(key, id) {
  const row = state.data[key].find((item) => Number(item.id) === Number(id));
  if (!row) return;
  $("#request-key").value = key;
  $("#request-id").value = row.id;
  $("#request-status").value = row.status || "em_andamento";
  $("#request-response").value = row.response || "";
  $("#request-summary").innerHTML = `
    <strong>${esc(row.protocol || row.id)} - ${esc(row.subject || row.type || "")}</strong>
    <p>${esc(row.message || "")}</p>
    <small>${esc(row.requester_name || "")} ${esc(row.requester_email || "")} ${esc(row.requester_phone || "")}</small>
  `;
  openMo("mo-request");
}

async function submitRequest() {
  const key = $("#request-key").value;
  const id = $("#request-id").value;
  await api((key === "esic" ? "esic.php" : "ouvidoria.php") + "?id=" + encodeURIComponent(id), {
    method: "PUT",
    body: JSON.stringify({
      status: $("#request-status").value,
      response: $("#request-response").value,
    }),
  });
  closeMo("mo-request");
  toast("Resposta salva.", "success");
  await renderRequests(key);
}

async function removeRequest(key, id) {
  if (!confirm("Excluir esta solicitacao?")) return;
  await api((key === "esic" ? "esic.php" : "ouvidoria.php") + "?id=" + encodeURIComponent(id), { method: "DELETE" });
  toast("Solicitacao excluida.", "success");
  await renderRequests(key);
}

async function renderSettings() {
  const settings = await safeLoad("settings", loadSettings);
  const fields = [
    ["site_name", "Nome da Camara", "Camara Municipal de Vargem Grande do Rio Pardo"],
    ["city", "Municipio", "Vargem Grande do Rio Pardo"],
    ["state", "UF", "MG"],
    ["legislature", "Legislatura", "2025-2028"],
    ["cnpj", "CNPJ", ""],
    ["phone", "Telefone", ""],
    ["email", "E-mail institucional", ""],
    ["opening_hours", "Horario de atendimento", ""],
    ["address", "Endereco completo", ""],
    ["ordinary_sessions", "Sessoes ordinarias", ""],
  ];
  $("#view").innerHTML = `
    <div class="ph"><div><h1>Configuracoes <em></em></h1><p>Dados institucionais usados pelo site e pelo painel.</p></div><button class="btn btn-p" onclick="saveSettings()">Salvar</button></div>
    <div class="notice warn"><strong>Obrigatorio.</strong><span> Preencha endereco, telefone, e-mail e horario real antes de publicar oficialmente.</span></div>
    <div class="card"><div class="fg">
      ${fields.map(([key, label, fallback]) => `<div class="fgrp ${key === "address" || key === "ordinary_sessions" ? "span2" : ""}"><label>${esc(label)}</label><input class="fc setting-field" data-key="${esc(key)}" value="${esc(settings[key] ?? fallback)}"></div>`).join("")}
    </div></div>
  `;
}

async function saveSettings() {
  const settings = {};
  $all(".setting-field").forEach((field) => settings[field.dataset.key] = field.value);
  await api("settings.php", { method: "PUT", body: JSON.stringify({ settings }) });
  toast("Configuracoes salvas.", "success");
}

function previewLaw() {
  const number = $("#legislacao-law_number")?.value || "";
  const type = $("#legislacao-law_type")?.value || "";
  const summary = $("#legislacao-summary")?.value || "";
  const related = $("#legislacao-related_laws")?.value || "";
  const content = composeLawContent(collectLawArticles()) || $("#legislacao-content")?.value || "";
  const fileUrl = $("#legislacao-file_url")?.value || "";
  const text = `${type} No. ${number}\n\nEMENTA: ${summary}\n\nVINCULACOES: ${related || "-"}\n\nPDF ORIGINAL: ${fileUrl || "Nao anexado"}\n\n${content}`.trim();
  const win = window.open("", "_blank");
  if (!win) return toast("Permita pop-ups para abrir o preview.", "warning");
  win.document.write(`<pre style="font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.6;padding:28px">${esc(text)}</pre>`);
  win.document.close();
}

function openAsset(url) {
  window.open(url, "_blank");
}

async function renderPage(page) {
  const view = $("#view");
  view.innerHTML = `<div class="panel-note">Carregando...</div>`;
  try {
    if (page === "dashboard") return renderDashboard();
    if (crud[page]) return renderCrud(page);
    if (page === "esic" || page === "ouvidoria") return renderRequests(page);
    if (page === "config") return renderSettings();
    view.innerHTML = `<div class="panel-note">Modulo nao encontrado.</div>`;
  } catch (error) {
    console.error(error);
    view.innerHTML = `<div class="alert">Erro: ${esc(error.message)}</div>`;
  }
}

function openMo(id) {
  const modal = $("#" + id);
  if (modal) modal.classList.add("open");
}

function closeMo(id) {
  const modal = $("#" + id);
  if (modal) modal.classList.remove("open");
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("mo")) event.target.classList.remove("open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") $all(".mo.open").forEach((modal) => modal.classList.remove("open"));
});

async function initAdmin() {
  try {
    if (!(await checkAuth())) {
      renderLogin();
      return;
    }
    renderShell();
    bindNav();
    const initial = (location.hash || "#dashboard").replace("#", "");
    await go(sections[initial] ? initial : "dashboard");
  } catch (error) {
    renderLogin(error.message);
  }
}

window.go = go;
window.logout = logout;
window.refreshCurrent = refreshCurrent;
window.openCrudModal = openCrudModal;
window.submitCrud = submitCrud;
window.removeCrud = removeCrud;
window.openRequestModal = openRequestModal;
window.submitRequest = submitRequest;
window.removeRequest = removeRequest;
window.openMo = openMo;
window.closeMo = closeMo;
window.saveSettings = saveSettings;
window.handleUpload = handleUpload;
window.handleLawPdfUpload = handleLawPdfUpload;
window.handleLawPdfDrop = handleLawPdfDrop;
window.addLawArticle = addLawArticle;
window.removeLawArticle = removeLawArticle;
window.moveLawArticle = moveLawArticle;
window.syncLawArticles = syncLawArticles;
window.updateUploadPreview = updateUploadPreview;
window.setFilter = setFilter;
window.previewLaw = previewLaw;
window.openAsset = openAsset;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdmin);
} else {
  initAdmin();
}
