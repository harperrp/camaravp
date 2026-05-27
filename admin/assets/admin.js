const API_BASE = "../api/";

const state = {
  current: "dashboard",
  user: null,
  filters: {},
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
      ["law_type", "Tipo", "select", "", [["Lei Ordinaria", "Lei Ordinaria"], ["Lei Complementar", "Lei Complementar"], ["Decreto Legislativo", "Decreto Legislativo"], ["Resolucao", "Resolucao"], ["Portaria", "Portaria"], ["Emenda a Lei Organica", "Emenda a Lei Organica"]]],
      ["law_number", "Numero / Ano", "text", "", "", true],
      ["publication_date", "Data de publicacao", "date"],
      ["status", "Situacao", "select", "", [["published", "Vigente"], ["draft", "Rascunho"], ["archived", "Revogada / Arquivada"]]],
      ["summary", "Ementa", "text", "span2", "", true],
      ["related_laws", "Vinculacoes", "text", "span2"],
      ["content", "Artigos da Lei", "textarea", "span2 tall"],
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
      <div class="md md-wide">
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
        <div class="law-upload" onclick="document.getElementById('${id}-file').click()" style="border:2px dashed var(--border2);border-radius:14px;padding:28px 18px;text-align:center;cursor:pointer;background:rgba(46,204,64,.035);display:flex;flex-direction:column;align-items:center;gap:8px">
          <div class="law-upload-ico" style="width:42px;height:42px;border-radius:12px;background:rgba(46,204,64,.12);display:flex;align-items:center;justify-content:center;color:var(--g5);font-weight:900">PDF</div>
          <strong style="text-transform:uppercase">Anexar PDF da Lei</strong>
          <span style="max-width:460px;color:var(--txt3);font-size:13px;line-height:1.4">Arraste o PDF aqui ou clique para selecionar. O arquivo fica disponivel para baixar no site.</span>
        </div>
        <div class="upload-row">
          <input class="fc" id="${id}" type="text" placeholder="URL do PDF ou arquivo enviado" oninput="updateUploadPreview('${key}', '${name}')">
          <input id="${id}-file" type="file" accept="application/pdf,.pdf" hidden onchange="handleUpload('${key}', '${name}', this.files[0])">
          <button class="btn btn-s" type="button" onclick="document.getElementById('${id}-file').click()">Upload</button>
        </div>
        <div class="upload-preview" id="${id}-preview"></div>
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
    payload.title = `${payload.law_type || "Ato Normativo"} Nº ${payload.law_number || ""}`.trim();
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
  const content = $("#legislacao-content")?.value || "";
  const text = `${type} Nº ${number}\n\nEMENTA: ${summary}\n\nVINCULACOES: ${related || "-"}\n\n${content}`.trim();
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
window.updateUploadPreview = updateUploadPreview;
window.setFilter = setFilter;
window.previewLaw = previewLaw;
window.openAsset = openAsset;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdmin);
} else {
  initAdmin();
}
