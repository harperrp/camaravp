const API_BASE = "../api/";

const state = {
  current: "dashboard",
  user: null,
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
  noticias: "Noticias",
  vereadores: "Vereadores",
  diario: "Diario Oficial",
  legislacao: "Legislacao",
  concursos: "Concursos",
  esic: "e-SIC",
  ouvidoria: "Ouvidoria",
  config: "Configuracoes",
  usuarios: "Usuarios",
};

const crud = {
  noticias: {
    endpoint: "noticias.php",
    title: "Noticias e Eventos",
    empty: "Nenhuma noticia cadastrada.",
    columns: [
      ["title", "Titulo"],
      ["category", "Categoria"],
      ["published_at", "Data", "date"],
      ["status", "Status", "status"],
    ],
    fields: [
      ["title", "Titulo", "text", "span2"],
      ["category", "Categoria", "text"],
      ["published_at", "Data", "date"],
      ["status", "Status", "select", "", [["published", "Publicada"], ["draft", "Rascunho"], ["archived", "Arquivada"]]],
      ["summary", "Resumo", "textarea", "span2"],
      ["content", "Conteudo", "textarea", "span2"],
      ["image_url", "Imagem URL", "text", "span2"],
    ],
  },
  vereadores: {
    endpoint: "vereadores.php?admin=1",
    saveEndpoint: "vereadores.php",
    title: "Vereadores",
    empty: "Nenhum vereador cadastrado.",
    columns: [
      ["name", "Nome"],
      ["role", "Cargo"],
      ["party", "Partido"],
      ["active", "Status", "active"],
    ],
    fields: [
      ["name", "Nome", "text", "span2"],
      ["role", "Cargo", "text"],
      ["party", "Partido", "text"],
      ["legislature", "Legislatura", "text"],
      ["display_order", "Ordem", "number"],
      ["phone", "Telefone", "text"],
      ["email", "E-mail", "text"],
      ["photo_url", "Foto URL", "text", "span2"],
      ["biography", "Biografia", "textarea", "span2"],
      ["active", "Status", "select", "", [["1", "Ativo"], ["0", "Inativo"]]],
    ],
  },
  diario: {
    endpoint: "diario.php?admin=1",
    saveEndpoint: "diario.php",
    title: "Diario Oficial",
    empty: "Nenhuma edicao cadastrada.",
    columns: [
      ["title", "Titulo"],
      ["edition_number", "Edicao"],
      ["publication_date", "Data", "date"],
      ["status", "Status", "status"],
    ],
    fields: [
      ["title", "Titulo", "text", "span2"],
      ["edition_number", "Edicao", "text"],
      ["publication_date", "Data", "date"],
      ["status", "Status", "select", "", [["published", "Publicado"], ["draft", "Rascunho"], ["archived", "Arquivado"]]],
      ["file_url", "PDF URL", "text", "span2"],
      ["description", "Descricao", "textarea", "span2"],
    ],
  },
  legislacao: {
    endpoint: "legislacao.php?admin=1",
    saveEndpoint: "legislacao.php",
    title: "Legislacao Municipal",
    empty: "Nenhum ato cadastrado.",
    columns: [
      ["law_number", "Numero"],
      ["law_type", "Tipo"],
      ["publication_date", "Data", "date"],
      ["status", "Status", "status"],
    ],
    fields: [
      ["title", "Titulo", "text", "span2"],
      ["law_number", "Numero", "text"],
      ["law_type", "Tipo", "text"],
      ["publication_date", "Data", "date"],
      ["status", "Status", "select", "", [["published", "Publicado"], ["draft", "Rascunho"], ["archived", "Arquivado"]]],
      ["file_url", "Arquivo URL", "text", "span2"],
      ["summary", "Ementa", "textarea", "span2"],
      ["content", "Texto", "textarea", "span2"],
    ],
  },
  concursos: {
    endpoint: "concursos.php?admin=1",
    saveEndpoint: "concursos.php",
    title: "Concursos Publicos",
    empty: "Nenhum concurso cadastrado.",
    columns: [
      ["title", "Titulo"],
      ["tender_number", "Numero"],
      ["opening_date", "Data", "date"],
      ["status", "Status", "plain"],
    ],
    fields: [
      ["title", "Titulo", "text", "span2"],
      ["tender_number", "Numero", "text"],
      ["modality", "Modalidade", "text"],
      ["opening_date", "Data", "date"],
      ["status", "Status", "text"],
      ["file_url", "Arquivo URL", "text", "span2"],
      ["description", "Descricao", "textarea", "span2"],
    ],
  },
  usuarios: {
    endpoint: "usuarios.php",
    saveEndpoint: "usuarios.php",
    title: "Usuarios do Painel",
    empty: "Nenhum usuario cadastrado.",
    columns: [
      ["name", "Nome"],
      ["email", "E-mail"],
      ["role", "Perfil"],
      ["active", "Status", "active"],
    ],
    fields: [
      ["name", "Nome", "text"],
      ["email", "E-mail", "text"],
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
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? esc(value) : date.toLocaleDateString("pt-BR");
}

function inputDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function endpointFor(key) {
  return crud[key].saveEndpoint || crud[key].endpoint;
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
  setTimeout(() => { el.classList.add("fo"); setTimeout(() => el.remove(), 320); }, 2800);
}

async function api(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (_) {
    throw new Error("Resposta invalida da API.");
  }
  if (!response.ok || (json && json.ok === false)) {
    throw new Error((json && json.error) || "Erro HTTP " + response.status);
  }
  return json;
}

async function checkAuth() {
  const json = await api("auth.php");
  state.user = json.authenticated ? json.user : null;
  return !!state.user;
}

function renderLogin(error = "") {
  document.body.innerHTML = `
    <main class="auth-page" style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at top,rgba(46,204,64,.12),transparent 34%),var(--bg)">
      <section class="auth-card" style="width:min(420px,100%);background:var(--bg2);border:1px solid var(--border2);border-radius:18px;padding:30px;box-shadow:var(--s1)">
        <div class="auth-mark" style="width:54px;height:54px;border-radius:16px;background:linear-gradient(135deg,#14831f,#20b932);display:flex;align-items:center;justify-content:center;font-weight:900;margin-bottom:18px">VP</div>
        <h1 style="margin:0 0 8px;font-size:28px;text-transform:uppercase">Painel Administrativo</h1>
        <p style="margin:0 0 22px;color:var(--txt2);line-height:1.5">Camara Municipal de Vargem Grande do Rio Pardo</p>
        ${error ? `<div class="alert">${esc(error)}</div>` : ""}
        <form id="login-form" class="auth-form" style="display:flex;flex-direction:column;gap:10px">
          <label>E-mail</label>
          <input class="fc" name="email" type="email" autocomplete="username" required>
          <label>Senha</label>
          <input class="fc" name="password" type="password" autocomplete="current-password" required>
          <button class="btn btn-p" type="submit" style="margin-top:8px;justify-content:center">Entrar</button>
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
          ${menuGroup("VISÃO GERAL", [["dashboard", "▦", "Dashboard"]])}
          ${menuGroup("GESTÃO DO SITE", [["noticias", "▣", "Noticias"], ["vereadores", "●", "Vereadores"], ["diario", "▤", "Diario Oficial"], ["legislacao", "§", "Legislacao"], ["concursos", "▥", "Concursos"]])}
          ${menuGroup("ATENDIMENTO", [["esic", "?", "e-SIC"], ["ouvidoria", "!", "Ouvidoria"]])}
          ${menuGroup("SISTEMA", [["config", "⚙", "Configuracoes"], ["usuarios", "◉", "Usuarios"]])}
        </nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <div class="tb-bc"><span>Painel</span><span>/</span><span class="cur" id="bc-cur">Dashboard</span></div>
          <div class="tb-acts">
            <button class="tb-ico" type="button" title="Atualizar" onclick="refreshCurrent()">↻</button>
            <button class="tb-ico" type="button" title="Abrir site" onclick="location.href='../'">↗</button>
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
  if (current) current.textContent = sections[page] || page;
  history.replaceState({ page }, "", "#" + page);
  await renderPage(page);
}

async function refreshCurrent() {
  await renderPage(state.current);
  toast("Atualizado", "success");
}

async function safeLoad(key, loader) {
  try {
    return await loader();
  } catch (error) {
    console.warn(key, error);
    toast("Nao foi possivel carregar " + (sections[key] || key) + ": " + error.message, "warning");
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
  const json = await api((key === "esic" ? "esic.php" : "ouvidoria.php"));
  state.data[key] = json.data || [];
  return state.data[key];
}

async function loadSettings() {
  const json = await api("settings.php");
  state.data.settings = json.data || {};
  return state.data.settings;
}

function stat(icon, value, label) {
  return `<div class="scard"><div class="sc-ico">${icon}</div><div class="sc-num">${esc(value)}</div><div class="sc-lbl">${esc(label)}</div></div>`;
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

  $("#view").innerHTML = `
    <div class="ph"><div><h1>Dashboard <em>Geral</em></h1><p>Resumo dos dados publicados no site e recebidos pelo atendimento.</p></div></div>
    <div class="stat-grid">
      ${stat("N", state.data.noticias.length, "Noticias")}
      ${stat("V", state.data.vereadores.length, "Vereadores")}
      ${stat("D", state.data.diario.length, "Diarios")}
      ${stat("L", state.data.legislacao.length, "Leis")}
      ${stat("C", state.data.concursos.length, "Concursos")}
      ${stat("S", state.data.esic.filter((item) => item.status !== "respondido").length, "e-SIC abertos")}
      ${stat("O", state.data.ouvidoria.filter((item) => item.status !== "respondido").length, "Ouvidoria aberta")}
    </div>
    <div class="tw">
      <div class="th"><div class="tt">Ultimas noticias</div><button class="btn btn-p" onclick="go('noticias')">Gerenciar</button></div>
      ${tableFor("noticias", state.data.noticias.slice(0, 5))}
    </div>
  `;
}

function cellValue(value, type) {
  if (type === "date") return dateBR(value);
  if (type === "status") return `<span class="sp ${value === "published" ? "sp-ok" : value === "draft" ? "sp-pend" : "sp-err"}">${value === "published" ? "Publicado" : value === "draft" ? "Rascunho" : esc(value || "-")}</span>`;
  if (type === "active") return `<span class="sp ${Number(value) !== 0 ? "sp-ok" : "sp-err"}">${Number(value) !== 0 ? "Ativo" : "Inativo"}</span>`;
  return esc(value || "-");
}

function tableFor(key, rows) {
  const cfg = crud[key];
  if (!rows.length) return `<div class="panel-note">${esc(cfg.empty)}</div>`;
  return `
    <table>
      <thead><tr>${cfg.columns.map((col) => `<th>${esc(col[1])}</th>`).join("")}<th>Acoes</th></tr></thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            ${cfg.columns.map((col) => `<td class="${col[0] === cfg.columns[0][0] ? "tc" : ""}">${cellValue(row[col[0]], col[2])}</td>`).join("")}
            <td>
              <button class="btn btn-s btn-sm" onclick="openCrudModal('${key}', ${Number(row.id)})">Editar</button>
              <button class="btn btn-d btn-sm" onclick="removeCrud('${key}', ${Number(row.id)})">Excluir</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function renderCrud(key) {
  const cfg = crud[key];
  const rows = await safeLoad(key, () => loadCrud(key));
  $("#view").innerHTML = `
    <div class="ph">
      <div><h1>${esc(cfg.title)} <em></em></h1><p>Dados salvos aqui aparecem no site publico.</p></div>
      <button class="btn btn-p" onclick="openCrudModal('${key}')">+ Novo registro</button>
    </div>
    <div class="tw"><div class="th"><div class="tt">Lista</div></div>${tableFor(key, rows)}</div>
    ${modalCrud(key)}
  `;
}

function modalCrud(key) {
  const cfg = crud[key];
  return `
    <div class="mo" id="mo-${key}">
      <div class="md">
        <div class="md-h"><h3>${esc(cfg.title)}</h3><button class="md-x" onclick="closeMo('mo-${key}')">×</button></div>
        <div class="md-b">
          <input type="hidden" id="${key}-id">
          <div class="fg">
            ${cfg.fields.map(([name, label, type, span, options]) => fieldHtml(key, name, label, type, span, options)).join("")}
          </div>
        </div>
        <div class="md-f">
          <button class="btn btn-s" onclick="closeMo('mo-${key}')">Cancelar</button>
          <button class="btn btn-p" onclick="submitCrud('${key}')">Salvar</button>
        </div>
      </div>
    </div>
  `;
}

function fieldHtml(key, name, label, type, span, options) {
  const id = `${key}-${name}`;
  if (type === "textarea") {
    return `<div class="fgrp ${span || ""}"><label>${esc(label)}</label><textarea class="fc" id="${id}"></textarea></div>`;
  }
  if (type === "select") {
    return `<div class="fgrp ${span || ""}"><label>${esc(label)}</label><select class="fc" id="${id}">${(options || []).map(([value, text]) => `<option value="${esc(value)}">${esc(text)}</option>`).join("")}</select></div>`;
  }
  return `<div class="fgrp ${span || ""}"><label>${esc(label)}</label><input class="fc" id="${id}" type="${esc(type || "text")}"></div>`;
}

function openCrudModal(key, id) {
  const row = id ? state.data[key].find((item) => Number(item.id) === Number(id)) || {} : {};
  $(`#${key}-id`).value = row.id || "";
  crud[key].fields.forEach(([name, , type]) => {
    const input = $(`#${key}-${name}`);
    if (!input) return;
    if (type === "date") input.value = inputDate(row[name]);
    else if (name === "password") input.value = "";
    else input.value = row[name] ?? (name === "status" ? "published" : name === "active" ? "1" : "");
  });
  openMo(`mo-${key}`);
}

async function submitCrud(key) {
  const cfg = crud[key];
  const id = $(`#${key}-id`).value;
  const payload = {};
  cfg.fields.forEach(([name]) => {
    const input = $(`#${key}-${name}`);
    if (input) payload[name] = input.value;
  });
  if (!payload.title && !payload.name) {
    toast("Preencha os campos principais antes de salvar.", "warning");
    return;
  }
  if (key === "usuarios" && !id && !payload.password) {
    toast("Senha obrigatoria para novo usuario.", "warning");
    return;
  }
  if (id && key === "usuarios" && !payload.password) delete payload.password;
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
            <td><span class="sp ${row.status === "respondido" ? "sp-ok" : row.status === "arquivado" ? "sp-err" : "sp-pend"}">${esc(row.status || "novo")}</span></td>
            <td>
              <button class="btn btn-s btn-sm" onclick="openRequestModal('${key}', ${Number(row.id)})">Responder</button>
              <button class="btn btn-d btn-sm" onclick="removeRequest('${key}', ${Number(row.id)})">Excluir</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

async function renderRequests(key) {
  const rows = await safeLoad(key, () => loadRequests(key));
  $("#view").innerHTML = `
    <div class="ph"><div><h1>${esc(sections[key])} <em></em></h1><p>Pedidos recebidos pelo site publico.</p></div></div>
    <div class="tw"><div class="th"><div class="tt">Solicitacoes</div></div>${requestTable(key, rows)}</div>
    <div class="mo" id="mo-request">
      <div class="md">
        <div class="md-h"><h3>Responder solicitacao</h3><button class="md-x" onclick="closeMo('mo-request')">×</button></div>
        <div class="md-b">
          <input type="hidden" id="request-key"><input type="hidden" id="request-id">
          <div class="panel-note" id="request-summary"></div>
          <div class="fg" style="margin-top:14px">
            <div class="fgrp"><label>Status</label><select class="fc" id="request-status"><option value="em_andamento">Em andamento</option><option value="respondido">Respondido</option><option value="arquivado">Arquivado</option></select></div>
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
    <strong>${esc(row.protocol || row.id)} - ${esc(row.subject || row.type || "")}</strong><br>
    ${esc(row.message || "")}<br>
    <small>${esc(row.requester_email || "")} ${esc(row.requester_phone || "")}</small>
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
  const defaults = {
    site_name: "Camara Municipal de Vargem Grande do Rio Pardo",
    city: "Vargem Grande do Rio Pardo",
    state: "MG",
    legislature: "2025-2028",
    phone: "",
    email: "",
    address: "",
    opening_hours: "",
  };
  const merged = { ...defaults, ...settings };
  $("#view").innerHTML = `
    <div class="ph"><div><h1>Configuracoes <em></em></h1><p>Dados institucionais usados pelo site.</p></div><button class="btn btn-p" onclick="saveSettings()">Salvar</button></div>
    <div class="card"><div class="fg">
      ${Object.entries(merged).map(([key, value]) => `<div class="fgrp ${key === "address" ? "span2" : ""}"><label>${esc(key)}</label><input class="fc setting-field" data-key="${esc(key)}" value="${esc(value)}"></div>`).join("")}
    </div></div>
  `;
}

async function saveSettings() {
  const settings = {};
  $all(".setting-field").forEach((field) => settings[field.dataset.key] = field.value);
  await api("settings.php", { method: "PUT", body: JSON.stringify({ settings }) });
  toast("Configuracoes salvas.", "success");
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdmin);
} else {
  initAdmin();
}
