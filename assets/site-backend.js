(function () {
  const API_BASE = "api/";
  const siteData = { news: [], councilors: [], diary: [], laws: [], tenders: [] };

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function slug(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function parseDate(value) {
    if (!value) return null;
    const date = new Date(String(value).replace(" ", "T"));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function dateBR(value, options) {
    const date = parseDate(value);
    if (!date) return value ? esc(value) : "-";
    return date.toLocaleDateString("pt-BR", options || {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function shortDateBR(value) {
    const date = parseDate(value);
    return date ? date.toLocaleDateString("pt-BR") : "";
  }

  function yearOf(value) {
    const date = parseDate(value);
    return date ? String(date.getFullYear()) : "";
  }

  async function api(path, options) {
    const response = await fetch(API_BASE + path, {
      headers: { "Content-Type": "application/json" },
      ...(options || {}),
    });
    const text = await response.text();
    const json = text ? JSON.parse(text) : null;
    if (!response.ok || (json && json.ok === false)) {
      throw new Error((json && json.error) || "Falha na API");
    }
    return json;
  }

  async function getList(path) {
    try {
      const json = await api(path);
      return Array.isArray(json.data) ? json.data : [];
    } catch (error) {
      console.warn("API indisponivel:", path, error);
      return [];
    }
  }

  function imageStyle(url, fallback) {
    if (!url) return fallback || "background:linear-gradient(135deg,var(--g700),var(--g900))";
    return `background:linear-gradient(135deg,rgba(26,71,49,.5),rgba(26,71,49,.85)),url('${esc(url)}') center/cover`;
  }

  function renderCouncilors(rows) {
    if (!rows.length) return;
    const fullGrid = document.getElementById("ver-grid");
    if (fullGrid) {
      fullGrid.innerHTML = rows.map((item) => `
        <div class="ver-pg-card">
          <div class="ver-pg-top">
            <div class="ver-pg-av">${item.photo_url ? `<img src="${esc(item.photo_url)}" alt="${esc(item.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : "&#128100;"}</div>
            <div class="ver-pg-nm">${esc(item.name)}</div>
            <div class="ver-pg-cg">${esc(item.role || "Vereador")}</div>
          </div>
          <div class="ver-pg-body">
            <div class="ver-pg-row"><span class="ver-pg-lbl">Partido</span><span class="ver-pg-val">${esc(item.party || "-")}</span></div>
            <div class="ver-pg-row"><span class="ver-pg-lbl">Mandato</span><span class="ver-pg-val">${esc(item.legislature || "2025 - 2028")}</span></div>
            <div class="ver-pg-row"><span class="ver-pg-lbl">Cargo</span><span class="ver-pg-val">${esc(item.role || "Vereador")}</span></div>
            <div class="ver-pg-row"><span class="ver-pg-lbl">Contato</span><span class="ver-pg-val">${esc(item.email || item.phone || "-")}</span></div>
          </div>
        </div>
      `).join("");
    }

    const homeGrid = document.querySelector(".verh-grid");
    if (homeGrid) {
      homeGrid.innerHTML = rows.slice(0, 5).map((item) => `
        <div class="verh-card rv">
          <div class="vhav">${item.photo_url ? `<img src="${esc(item.photo_url)}" alt="${esc(item.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : "&#128100;"}</div>
          <div class="vhnm">${esc(item.name)}</div>
          <div class="vhcg">${esc(item.role || "Vereador")}</div>
          <div class="vhpt">${esc(item.party || "Camara Municipal")}</div>
        </div>
      `).join("");
    }
  }

  function newsCard(item, featured) {
    const category = item.category || "Institucional";
    return `
      <div class="not-dest not-card ${featured ? "not-main" : ""} rv" data-cat="${esc(slug(category))}">
        <div class="not-img" style="${imageStyle(item.image_url)}">
          <span class="not-tag">${esc(category)}</span>
        </div>
        <div class="not-body">
          <div class="not-date">${dateBR(item.published_at || item.created_at)}</div>
          <div class="not-title">${esc(item.title)}</div>
          <div class="not-desc">${esc(item.summary || item.content || "")}</div>
          <button class="btn btn-outline" onclick="CamaraSite.openNews(${Number(item.id)})" style="margin-top:12px;padding:7px 16px;font-size:12px">Ler mais &#8594;</button>
        </div>
      </div>
    `;
  }

  function renderNews(rows) {
    if (!rows.length) return;
    const grid = document.getElementById("noticias-grid");
    if (grid) grid.innerHTML = rows.map((item, index) => newsCard(item, index === 0)).join("");

    const homeGrid = document.querySelector(".not-grid");
    if (homeGrid) {
      const [first, ...rest] = rows;
      homeGrid.innerHTML = `
        ${first ? newsCard(first, true) : ""}
        <div class="not-side">
          ${rest.slice(0, 4).map((item) => `
            <div class="not-mini rv" onclick="CamaraSite.openNews(${Number(item.id)})">
              <div class="not-date">${dateBR(item.published_at || item.created_at, { day: "2-digit", month: "short", year: "numeric" })}</div>
              <div class="not-title" style="font-size:.95rem;font-family:'Cormorant Garamond',serif;color:var(--g800)">${esc(item.title)}</div>
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  function renderDiary(rows) {
    if (!rows.length) return;
    const grid = document.getElementById("diario-grid");
    if (grid) {
      grid.innerHTML = rows.map((item) => `
        <div class="diario-card" data-ano="${esc(yearOf(item.publication_date))}">
          <div class="diario-edicao">Edicao n&ordm; ${esc(item.edition_number || item.id)}</div>
          <div class="diario-data">${dateBR(item.publication_date)}</div>
          <span class="diario-tag-pill">PDF disponivel</span>
          <div style="font-size:12.5px;color:var(--ink-l);line-height:1.6">${esc(item.description || item.title || "Publicacao oficial da Camara Municipal.")}</div>
          ${item.file_url ? `<a href="${esc(item.file_url)}" target="_blank" rel="noopener noreferrer" class="diario-btn">&#128196; Baixar PDF</a>` : `<a href="#" class="diario-btn" onclick="alertPDF();return false">&#128196; Solicitar PDF</a>`}
        </div>
      `).join("");
      const more = document.getElementById("diario-ver-mais");
      if (more) more.style.display = "none";
    }

    const diaryBox = Array.from(document.querySelectorAll(".lbox")).find((box) => {
      const title = box.querySelector(".lhtit");
      return title && title.textContent.toLowerCase().includes("diario");
    });
    if (diaryBox) {
      const footer = diaryBox.querySelector(".lft")?.outerHTML || "";
      diaryBox.innerHTML = `<div class="lhdr"><span class="lhico">&#128240;</span><span class="lhtit">Diario Oficial Eletronico</span></div>` +
        rows.slice(0, 4).map((item, index) => `
          <div class="lrow" onclick="nav('diario')">
            <span class="lrnum">Edicao ${esc(item.edition_number || item.id)} &mdash; ${dateBR(item.publication_date, { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
            <span class="lrtag ${index === 0 ? "hoje" : ""}">PDF</span>
          </div>
        `).join("") + footer;
    }
  }

  function mapLaw(item) {
    return {
      id: item.id,
      num: item.law_number || item.title || String(item.id),
      tipo: item.law_type || "Ato Normativo",
      data: shortDateBR(item.publication_date),
      sit: item.status === "published" ? "Publicado" : item.status === "archived" ? "Arquivado" : "Rascunho",
      ementa: item.summary || item.title || "",
      texto: item.content || "",
      file_url: item.file_url || "",
    };
  }

  function renderLaws(rows) {
    if (!rows.length) return;
    const mapped = rows.map(mapLaw);
    if (Array.isArray(window.CAM_LEIS)) {
      window.CAM_LEIS.length = 0;
      mapped.forEach((item) => window.CAM_LEIS.push(item));
      if (typeof window.camRenderLeis === "function") window.camRenderLeis();
    }

    const lawBox = Array.from(document.querySelectorAll(".lbox")).find((box) => {
      const title = box.querySelector(".lhtit");
      return title && title.textContent.toLowerCase().includes("legisla");
    });
    if (lawBox) {
      const footer = lawBox.querySelector(".lft")?.outerHTML || "";
      lawBox.innerHTML = `<div class="lhdr"><span class="lhico">&#128220;</span><span class="lhtit">Legislacao Municipal</span></div>` +
        mapped.slice(0, 4).map((item) => `
          <div class="lrow" onclick="nav('legislacao')">
            <span class="lrnum">${esc(item.tipo)} n&ordm; ${esc(item.num)}</span>
            <span class="lrtag">${esc(item.sit)}</span>
          </div>
        `).join("") + footer;
    }
  }

  function openNews(id) {
    const item = siteData.news.find((row) => Number(row.id) === Number(id));
    if (!item) return;
    const modal = document.createElement("div");
    modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px";
    modal.innerHTML = `
      <div style="max-width:720px;width:100%;max-height:88vh;overflow:auto;background:#fff;border-radius:8px;padding:26px;box-shadow:0 20px 80px rgba(0,0,0,.35);color:#1a2a1a">
        <button onclick="this.closest('[data-news-modal]').remove()" style="float:right;border:0;background:#eef6ef;border-radius:4px;padding:6px 10px;cursor:pointer">Fechar</button>
        <div style="font-size:12px;color:#557b60;margin-bottom:8px">${dateBR(item.published_at || item.created_at)}</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:30px;line-height:1.1;margin:0 0 14px">${esc(item.title)}</h2>
        <p style="font-size:15px;line-height:1.8;color:#4a5a4a;white-space:pre-wrap">${esc(item.content || item.summary || "")}</p>
      </div>
    `;
    modal.setAttribute("data-news-modal", "1");
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
  }

  function getFormValues(root) {
    return Array.from(root.querySelectorAll("input,textarea,select")).map((field) => field.value.trim());
  }

  async function submitESIC() {
    const form = document.querySelector("#page-esic .esic-form");
    if (!form) return;
    const values = getFormValues(form);
    const payload = {
      requester_name: values[0] || "",
      requester_email: values[2] || "",
      requester_phone: values[3] || "",
      subject: values[4] && values[4] !== "Selecione o tipo" ? values[4] : "Pedido de Acesso a Informacao",
      message: values[5] || "",
    };
    if (!payload.requester_name || !payload.requester_email || !payload.message) {
      alert("Preencha nome, e-mail e descricao da solicitacao.");
      return;
    }
    const json = await api("esic.php", { method: "POST", body: JSON.stringify(payload) });
    alert("Solicitacao registrada. Protocolo: " + json.protocol);
    form.querySelectorAll("input,textarea").forEach((field) => field.value = "");
  }

  async function submitOuvidoria() {
    const form = document.querySelector("#page-ouvidoria .esic-form");
    if (!form) return;
    const values = getFormValues(form);
    const type = document.querySelector("#page-ouvidoria .ouv-tipo.sel .ouv-tipo-t")?.textContent || "manifestacao";
    const payload = {
      requester_name: values[0] || "",
      requester_email: values[1] || "",
      type,
      subject: values[2] || "",
      message: values[3] || "",
    };
    if (!payload.subject || !payload.message) {
      alert("Preencha assunto e descricao da manifestacao.");
      return;
    }
    const json = await api("ouvidoria.php", { method: "POST", body: JSON.stringify(payload) });
    alert("Manifestacao registrada. Protocolo: " + json.protocol);
    form.querySelectorAll("input,textarea").forEach((field) => {
      if (field.type !== "checkbox") field.value = "";
      else field.checked = false;
    });
  }

  async function submitContato() {
    const form = document.querySelector("#page-contato .esic-form");
    if (!form) return;
    const values = getFormValues(form);
    const payload = {
      requester_name: values[0] || "",
      requester_email: values[1] || "",
      requester_phone: values[2] || "",
      type: "contato",
      subject: values[3] && values[3] !== "Selecione o assunto" ? values[3] : "Contato pelo site",
      message: values[4] || "",
    };
    if (!payload.requester_name || !payload.requester_email || !payload.message) {
      alert("Preencha nome, e-mail e mensagem.");
      return;
    }
    const json = await api("ouvidoria.php", { method: "POST", body: JSON.stringify(payload) });
    alert("Mensagem enviada. Protocolo: " + json.protocol);
    form.querySelectorAll("input,textarea").forEach((field) => field.value = "");
  }

  function bindForms() {
    const esicButton = document.querySelector("#page-esic .esic-form button");
    if (esicButton) esicButton.addEventListener("click", (event) => {
      event.preventDefault();
      submitESIC().catch((error) => alert("Erro ao enviar: " + error.message));
    });

    const ouvidoriaButton = document.querySelector("#page-ouvidoria .esic-form button");
    if (ouvidoriaButton) ouvidoriaButton.addEventListener("click", (event) => {
      event.preventDefault();
      submitOuvidoria().catch((error) => alert("Erro ao enviar: " + error.message));
    });

    window.submitContato = function () {
      submitContato().catch((error) => alert("Erro ao enviar: " + error.message));
    };
  }

  async function bootBackendContent() {
    const [news, councilors, diary, laws, tenders] = await Promise.all([
      getList("noticias.php?public=1"),
      getList("vereadores.php"),
      getList("diario.php"),
      getList("legislacao.php"),
      getList("concursos.php"),
    ]);

    siteData.news = news;
    siteData.councilors = councilors;
    siteData.diary = diary;
    siteData.laws = laws;
    siteData.tenders = tenders;

    renderCouncilors(councilors);
    renderNews(news);
    renderDiary(diary);
    renderLaws(laws);
    bindForms();
    if (typeof window.initRV === "function") window.initRV();
  }

  window.CamaraSite = { openNews, reload: bootBackendContent };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootBackendContent);
  } else {
    bootBackendContent();
  }
})();

