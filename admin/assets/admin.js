const API_BASE = '../api/';

var PAGE_MAP = {
  dashboard:'index.html', vereadores:'vereadores.html', noticias:'noticias.html', diario:'diario.html',
  legislacao:'legislacao.html', concursos:'concursos.html', esic:'esic.html', ouvidoria:'ouvidoria.html',
  config:'config.html', usuarios:'usuarios.html'
};

var STORE_PREFIX = 'adm-painel:';

function memoryGet(resource){
  try { return JSON.parse(localStorage.getItem(STORE_PREFIX + resource) || '[]'); }
  catch(_) { return []; }
}
function memorySet(resource, value){
  localStorage.setItem(STORE_PREFIX + resource, JSON.stringify(value || []));
}
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

async function apiRequest(resource, method, payload){
  var url = API_BASE + resource;
  try {
    var res = await fetch(url, {
      method: method || 'GET',
      headers: {'Content-Type':'application/json'},
      body: payload ? JSON.stringify(payload) : undefined
    });
    if(!res.ok) throw new Error('HTTP '+res.status);
    if(res.status === 204) return null;
    return await res.json();
  } catch(_) {
    var db = memoryGet(resource);
    if((method || 'GET') === 'GET') return db;
    if(method === 'POST'){
      var row = Object.assign({id:uid(), createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()}, payload || {});
      db.unshift(row); memorySet(resource, db); return row;
    }
    if(method === 'PUT'){
      var i = db.findIndex(function(x){ return String(x.id) === String((payload||{}).id); });
      if(i < 0) throw new Error('Registro não encontrado');
      db[i] = Object.assign({}, db[i], payload || {}, {updatedAt:new Date().toISOString()});
      memorySet(resource, db); return db[i];
    }
    if(method === 'DELETE'){
      memorySet(resource, db.filter(function(x){ return String(x.id) !== String((payload||{}).id); }));
      return {ok:true};
    }
    return db;
  }
}

async function loadNoticias(){ return apiRequest('noticias','GET'); }
async function saveNoticia(data){ return data && data.id ? apiRequest('noticias','PUT',data) : apiRequest('noticias','POST',data); }
async function deleteNoticia(id){ return apiRequest('noticias','DELETE',{id:id}); }
async function loadVereadores(){ return apiRequest('vereadores','GET'); }
async function saveVereador(data){ return data && data.id ? apiRequest('vereadores','PUT',data) : apiRequest('vereadores','POST',data); }
async function deleteVereador(id){ return apiRequest('vereadores','DELETE',{id:id}); }
async function loadDiario(){ return apiRequest('diario','GET'); }
async function saveDiario(data){ return data && data.id ? apiRequest('diario','PUT',data) : apiRequest('diario','POST',data); }
async function deleteDiario(id){ return apiRequest('diario','DELETE',{id:id}); }
async function loadLegislacao(){ return apiRequest('legislacao','GET'); }
async function saveLegislacao(data){ return data && data.id ? apiRequest('legislacao','PUT',data) : apiRequest('legislacao','POST',data); }
async function deleteLegislacao(id){ return apiRequest('legislacao','DELETE',{id:id}); }

async function go(id,el,pushState){
  var page = PAGE_MAP[id];
  if(!page) return;

  try {
    var res = await fetch(page, { cache: 'no-store' });
    if(!res.ok) throw new Error('Falha ao carregar ' + page);
    var html = await res.text();
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var nextMain = doc.querySelector('.main');
    var curMain = document.querySelector('.main');
    if(!nextMain || !curMain) throw new Error('Estrutura .main não encontrada');

    curMain.innerHTML = nextMain.innerHTML;

    document.querySelectorAll('.ni').forEach(function(n){ n.classList.remove('act'); });
    var active = document.querySelector('.ni[onclick*="go(\'" + id + "\'"]');
    if(active) active.classList.add('act');

    if(pushState !== false){ history.pushState({page:id}, '', page); }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if(typeof animBars === 'function') setTimeout(animBars, 120);
  } catch(err){
    console.error(err);
    showToast('Erro ao carregar seção. Recarregando...', 'w');
    setTimeout(function(){ window.location.href = page; }, 700);
  }
}

function filtVer(val){
  val = (val || '').toLowerCase();
  document.querySelectorAll('#tbl-ver tbody tr').forEach(function(r){
    r.style.display = r.textContent.toLowerCase().includes(val) ? '' : 'none';
  });
}

window.addEventListener('popstate', function(e){
  if(e.state && e.state.page){ go(e.state.page, null, false); }
});

(function(){
  // ── INTRO DISMISS ──
  setTimeout(function(){
    var intro = document.getElementById("panel-intro");
    if(intro){
      intro.classList.add("hide");
      setTimeout(function(){ intro.classList.add("gone"); }, 800);
    }
  }, 2800);

  // ── PARTICLES ──
  var pc = document.querySelector(".pi-particles");
  if(pc){
    for(var i=0;i<55;i++){
      var s = document.createElement("div");
      var sz = 1 + Math.random()*3.5;
      s.style.cssText = "position:absolute;border-radius:50%;left:"+(Math.random()*100)+"%;width:"+sz+"px;height:"+sz+"px;background:"+(Math.random()>.65?"#f5c518":"#2ecc40")+";opacity:0;animation:particleFly "+(4+Math.random()*5)+"s linear "+(Math.random()*4)+"s infinite";
      pc.appendChild(s);
    }
  }
})();

// ── PAGE LABELS ──
var labels = {
  dashboard:"Dashboard", noticias:"Notícias e Eventos", licitacoes:"Licitações e Contratos",
  diarias:"Diárias de Viagem", concursos:"Concursos Públicos", legislacao:"Legislação Municipal",
  organograma:"Estrutura Organizacional", docs:"Documentos e Upload", obras:"Obras Públicas",
  faq:"FAQ Cidadão", enquetes:"Enquetes", versoes:"Versionamento",
  redirects:"Links e Redirecionamentos", emendas:"Emendas Parlamentares (APIs)",
  ouvidoria:"Ouvidoria / SIC", usuarios:"Usuários e Permissões", config:"Configurações"
};

// ── NAVIGATION ──

function openMo(id){
  var m = document.getElementById(id);
  if(m) m.classList.add("open");
}
function closeMo(id){
  var m = document.getElementById(id);
  if(m) m.classList.remove("open");
}
document.querySelectorAll(".mo").forEach(function(m){
  m.addEventListener("click", function(e){
    if(e.target === this) this.classList.remove("open");
  });
});

// ── SIDEBAR TOGGLE ──
function toggleSb(){
  var sb = document.getElementById("sb");
  if(!sb) return;
  sb.classList.toggle("col");
  var arr = document.getElementById("col-arrow");
  if(arr) arr.style.transform = sb.classList.contains("col") ? "rotate(180deg)" : "rotate(0deg)";
}

// ── TOAST ──
var TCOLORS = { s:"#2ecc40", e:"#f85149", i:"#388bfd", w:"#f5c518",
                success:"#2ecc40", error:"#f85149", info:"#388bfd", warning:"#f5c518" };
var TICONS  = { s:"✓", e:"✕", i:"ℹ", w:"⚠",
                success:"✓", error:"✕", info:"ℹ", warning:"⚠" };
function showToast(msg, type){
  var t = type || "i";
  var color = TCOLORS[t] || "#388bfd";
  var icon  = TICONS[t]  || "ℹ";
  var w = document.getElementById("toast-w");
  if(!w) return;
  var el = document.createElement("div");
  el.className = "toast";
  el.style.cssText = "border-top:2px solid "+color+";";
  el.innerHTML = "<span style='font-size:17px;color:"+color+"'>"+icon+"</span>"
               + "<span style='color:"+color+";font-weight:500;font-size:12px'>"+msg+"</span>";
  w.appendChild(el);
  setTimeout(function(){ el.classList.add("fo"); setTimeout(function(){ el.remove(); }, 350); }, 3200);
}
function toast(msg, type){ showToast(msg, type); }

// ── FLASH ──
function flash(){
  var f = document.createElement("div");
  f.className = "flash";
  document.body.appendChild(f);
  setTimeout(function(){ f.remove(); }, 600);
}

// ── DELETE ROW ──
function del(btn, tipo){
  if(!confirm("Remover este(a) " + tipo + "? Esta ação não pode ser desfeita.")) return;
  var row = btn.closest("tr") || btn.closest(".ouv-item") || btn.closest("[style*='background:var(--bg2)']") || btn.closest("[style*='background:var(--bg3)']");
  if(row){
    row.style.transition = "opacity .3s, transform .3s";
    row.style.opacity = "0";
    row.style.transform = "translateX(16px)";
    setTimeout(function(){ row.remove(); }, 320);
  }
  showToast(tipo + " removido(a)", "e");
}

// ── PUBLISH ROW ──
function publishRow(btn){
  var row = btn.closest("tr");
  if(row){
    var sp = row.querySelector(".sp-pend");
    if(sp){ sp.className = "sp sp-ok"; sp.textContent = "Publicada"; }
    btn.remove();
  }
  flash();
  showToast("Publicado com sucesso!", "s");
}

// ── HOMOLOGAR ──
function homologar(btn){
  var row = btn.closest("tr");
  if(row){
    var sp = row.querySelector(".sp");
    if(sp){ sp.className = "sp sp-ok"; sp.textContent = "Homologado"; }
    btn.remove();
  }
  flash();
  showToast("Licitação homologada!", "s");
}

// ── TABLE FILTERS ──
document.querySelectorAll(".fi").forEach(function(inp){
  inp.addEventListener("input", function(){
    var val = this.value.toLowerCase().trim();
    var tw = this.closest(".tw");
    if(!tw) return;
    tw.querySelectorAll("tbody tr").forEach(function(row){
      row.style.display = (val === "" || row.textContent.toLowerCase().includes(val)) ? "" : "none";
    });
  });
});
document.querySelectorAll(".fs").forEach(function(sel){
  sel.addEventListener("change", function(){
    var val = this.value.toLowerCase();
    var tw = this.closest(".tw");
    if(!tw) return;
    var isAll = val.startsWith("todo") || val.startsWith("all") || val.startsWith("qual");
    tw.querySelectorAll("tbody tr").forEach(function(row){
      row.style.display = (isAll || row.textContent.toLowerCase().includes(val)) ? "" : "none";
    });
  });
});

// ── KEYBOARD SHORTCUTS ──
document.addEventListener("keydown", function(e){
  if((e.ctrlKey || e.metaKey) && e.key === "k"){
    e.preventDefault();
    showToast("Busca global em desenvolvimento", "i");
  }
  if(e.key === "Escape"){
    document.querySelectorAll(".mo.open").forEach(function(m){ m.classList.remove("open"); });
  }
});

// ── PROGRESS BARS ──
function animBars(){
  document.querySelectorAll(".pf[data-w]").forEach(function(bar){
    var w = bar.getAttribute("data-w");
    bar.style.width = "0";
    setTimeout(function(){ bar.style.width = w; }, 80);
  });
}
setTimeout(animBars, 3200);

// ── NEWS PREVIEW (live) ──
function updatePreview(){
  var t  = document.getElementById("prev-titulo");
  var r  = document.getElementById("prev-resumo");
  var te = document.getElementById("prev-title-el");
  var re = document.getElementById("prev-excerpt-el");
  if(t && te) te.textContent = t.value || "Título da notícia aqui";
  if(r && re) re.textContent = r.value || "Resumo da notícia aparece aqui. Mantenha entre 100 e 160 caracteres para melhor visualização no portal.";
}

// ── IMAGE PREVIEW LOADER ──
function loadPrevImg(inp){
  if(!inp.files || !inp.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e){
    var box = document.getElementById("prev-img-box");
    if(box){
      box.style.backgroundImage = "url("+e.target.result+")";
      box.style.backgroundSize  = "cover";
      box.style.backgroundPosition = "center";
      box.innerHTML = '<div style="position:absolute;top:8px;left:8px;background:#f5c518;color:#000;font-size:8px;font-weight:800;padding:2px 8px;border-radius:2px;letter-spacing:1.5px">DESTAQUE</div>';
    }
  };
  reader.readAsDataURL(inp.files[0]);
}

// ── LEI EDITOR ──
function fmtLei(cmd){
  var ed = document.getElementById("lei-editor");
  if(!ed) return;
  var s = ed.selectionStart, e = ed.selectionEnd;
  var sel = ed.value.substring(s, e);
  var before = ed.value.substring(0, s);
  var after  = ed.value.substring(e);
  if(cmd === "bold")      ed.value = before + "**" + sel + "**" + after;
  else if(cmd === "italic")    ed.value = before + "_" + sel + "_" + after;
  else if(cmd === "underline") ed.value = before + "<u>" + sel + "</u>" + after;
  ed.focus();
  ed.setSelectionRange(s, e + (cmd === "underline" ? 7 : 4));
}
function insLei(txt){
  var ed = document.getElementById("lei-editor");
  if(!ed) return;
  var pos = ed.selectionStart;
  ed.value = ed.value.substring(0, pos) + txt + ed.value.substring(pos);
  ed.selectionStart = ed.selectionEnd = pos + txt.length;
  ed.focus();
}
function filterOuv(tipo){
  document.querySelectorAll("#ouv-table tbody tr").forEach(function(row){
    row.style.display=(!tipo||row.getAttribute("data-tipo")===tipo)?"":"none";
  });
}
function filterOuvStatus(st){
  document.querySelectorAll("#ouv-table tbody tr").forEach(function(row){
    row.style.display=(!st||row.getAttribute("data-status")===st)?"":"none";
  });
}
function filterOuvText(v){
  var val=v.toLowerCase().trim();
  document.querySelectorAll("#ouv-table tbody tr").forEach(function(row){
    row.style.display=(!val||row.textContent.toLowerCase().includes(val))?"":"none";
  });
}
function insAssinatura(){
  var ed = document.getElementById("lei-editor");
  if(!ed) return;
  ed.value += "\n\nVargem Grande do Rio Pardo, MG, ____ de __________ de 2025.\n\n_______________________________________\nPrefeito Municipal";
  ed.scrollTop = ed.scrollHeight;
  ed.focus();
}

// ══════════════════════════════════════════════════════
// PDF UPLOAD + IA EXTRACTION — Lei Cadastro
// ══════════════════════════════════════════════════════
var _leiPdfFile    = null;  // original File object
var _leiPdfBase64  = null;  // base64 string for API
var _leiArtigos    = [];    // extracted articles array

function handleLeiDrop(e){
  e.preventDefault();
  document.getElementById("lei-upload-zone").style.borderColor = "var(--bdr)";
  var files = e.dataTransfer.files;
  if(files && files[0] && files[0].type === "application/pdf"){
    processLeiPDF(files[0]);
  } else {
    showToast("Apenas arquivos PDF são aceitos", "e");
  }
}

function handleLeiPDF(input){
  if(input.files && input.files[0]){
    processLeiPDF(input.files[0]);
  }
}

function setProgress(pct, step){
  var bar  = document.getElementById("lei-prog-bar");
  var step_el = document.getElementById("lei-loading-step");
  if(bar) bar.style.width = pct + "%";
  if(step_el) step_el.textContent = step;
}

function processLeiPDF(file){
  _leiPdfFile = file;

  document.getElementById("lei-upload-idle").style.display    = "none";
  document.getElementById("lei-upload-done").style.display    = "none";
  document.getElementById("lei-upload-loading").style.display = "block";
  setProgress(10, "Lendo o arquivo PDF...");

  var reader = new FileReader();
  reader.onload = function(e){
    _leiPdfBase64 = e.target.result.split(",")[1];
    setProgress(25, "Carregando leitor de PDF...");
    loadPDFjs(function(){
      setProgress(40, "Extraindo texto do PDF...");
      extractPDFlocal(e.target.result, file.name, file.size);
    });
  };
  reader.readAsDataURL(file);
}

function loadPDFjs(cb){
  if(window.pdfjsLib){ cb(); return; }
  var s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  s.onload = function(){
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    cb();
  };
  s.onerror = function(){
    showToast("Não foi possível carregar o leitor de PDF. Verifique a conexão.", "e");
    fallbackSemExtract();
  };
  document.head.appendChild(s);
}
function extractPDFlocal(dataUrl, fileName, fileSize){
  var loadingTask = window.pdfjsLib.getDocument(dataUrl);
  loadingTask.promise.then(function(pdf){
    var total = pdf.numPages;
    var pages = [];
    var processed = 0;

    setProgress(50, "Lendo páginas (" + total + " no total)...");

    function getPage(n){
      pdf.getPage(n).then(function(page){
        page.getTextContent({includeMarkedContent:false}).then(function(content){
          // Reconstrói o texto usando posição Y para detectar quebras de linha
          var lines = [];
          var lastY = null;
          var currentLine = [];

          content.items.forEach(function(item){
            if(!item.str) return;
            var y = item.transform ? Math.round(item.transform[5]) : null;
            if(lastY !== null && y !== null && Math.abs(y - lastY) > 3){
              // Nova linha detectada
              if(currentLine.length) lines.push(currentLine.join(""));
              currentLine = [];
            }
            currentLine.push(item.str);
            lastY = y;
          });
          if(currentLine.length) lines.push(currentLine.join(""));

          pages[n-1] = lines.join("\n");
          processed++;
          var pct = 50 + Math.round((processed/total)*35);
          setProgress(pct, "Lendo página " + processed + " de " + total + "...");
          if(processed === total){
            var fullText = pages.join("\n\n");
            setProgress(88, "Identificando artigos...");
            processExtractedText(fullText, fileName, fileSize);
          }
        });
      }).catch(function(err){
        console.error("Erro página "+n, err);
        processed++;
        if(processed === total){
          var fullText = pages.filter(Boolean).join("\n\n");
          processExtractedText(fullText, fileName, fileSize);
        }
      });
    }

    for(var i=1; i<=total; i++){ getPage(i); }

  }).catch(function(err){
    console.error("PDF.js error:", err);
    showToast("PDF parece ser escaneado (imagem). Digite o texto manualmente.", "w");
    fallbackSemExtract(fileName, fileSize);
  });
}
function limparTimbrado(raw){
  var lines = raw.split(/\r?\n/);
  var cleaned = [];

  // Padrões de lixo de timbrado para remover LINHA A LINHA
  var lixoPatterns = [
    // Brasão / imagem / logo
    /^(estado de|estados unidos do brasil|repúblic)/i,
    // Nome da prefeitura / município (linha isolada)
    /^prefeitura\s+(municipal\s+)?de\s+\w+/i,
    /^município\s+de\s+\w+/i,
    /^câmara\s+municipal/i,
    // Endereço de cabeçalho (rua, praça, av - linha curta)
    /^(rua|praça|avenida|av\.|travessa)\s+.{5,60}$/i,
    // Telefone isolado
    /^\(?\d{2}\)?\s*[\d\s\-\.]{7,15}$/,
    // E-mail isolado
    /^[\w\.-]+@[\w\.-]+\.\w+$/,
    // Site / URL
    /^(www\.|https?:\/\/)\S+$/i,
    // CEP
    /^CEP[:\s]*\d{5}-?\d{3}/i,
    // CNPJ isolado
    /^CNPJ[:\s]*[\d\.\-\/]+/i,
    // Paginação "Página X de Y" ou "- 1 -" ou "1 / 5"
    /^-?\s*\d+\s*-?$|^página\s+\d+|^\d+\s*\/\s*\d+$/i,
    /^fl\.\s*\d+|^fls\.\s*\d+/i,
    // "Publicado no Diário Oficial" — rodapé
    /^publicado (no|em)\s+diário/i,
    // "Registre-se. Publique-se. Cumpra-se." — assinatura burocrática de cabeçalho
    // NÃO remover pois pode estar no corpo da lei
    // Linha em branco — manter apenas uma seguida
    // Assinatura genérica de timbrado (só nome do cargo, linha muito curta)
    /^prefeito\s+municipal\s*$/i,
    /^secretári[oa]\s+municipal\s*$/i,
    /^vice-?prefeito\s*$/i,
    // Rodapé de sistema
    /^sistema\s+(de\s+)?(gestão|transparência|legislação)/i,
    /^gerado\s+em|^impresso\s+em/i,
    /^lei\s+federal\s+n[°º]\s*12\.527/i,  // nota de rodapé LAI
    /^em\s+conformidade\s+com\s+a\s+lai/i,
    /^documento\s+(assinado|gerado)/i,
    // Numeração de artigo sozinha na linha (tipo "1" ou "2" solto — ruído do PDF)
    /^\d{1,3}\.?$/,
    // Linha com só símbolos/hífens (divisória)
    /^[-_=\*]{3,}$/,
    // Brasão em texto (OCR de imagem)
    /^(brasão|armas|escudo)\s+(do|de|da)/i,
  ];

  var prevBlank = false;
  for(var i=0;i<lines.length;i++){
    var line = lines[i];
    var trimmed = line.trim();

    // Remove linhas muito curtas que claramente são ruído (< 3 chars)
    if(trimmed.length < 3 && trimmed !== ""){
      prevBlank = false;
      continue;
    }

    // Verifica padrões de lixo
    var isLixo = false;
    for(var j=0;j<lixoPatterns.length;j++){
      if(lixoPatterns[j].test(trimmed)){
        isLixo = true; break;
      }
    }
    if(isLixo) continue;

    // Colapsa múltiplas linhas em branco em uma só
    if(trimmed === ""){
      if(!prevBlank) cleaned.push("");
      prevBlank = true;
      continue;
    }
    prevBlank = false;
    cleaned.push(line);
  }

  var result = cleaned.join("\n").trim();

  // ── REMOVER BLOCO DE CABEÇALHO antes do primeiro "Art." ou "EMENTA" ──
  // Tudo antes do início real da lei (ementa ou primeiro artigo)
  var inicioLei = result.search(/\b(ementa|art\.\s*1[°º]?|artigo\s+1)\b/i);
  if(inicioLei > 80){
    // Há conteúdo antes do início — provavelmente timbrado
    // Manter apenas de 2 linhas antes do Art.1 / EMENTA para cima (número/tipo da lei)
    var cabecalho = result.substring(0, inicioLei);
    var corpo     = result.substring(inicioLei);
    // Do cabeçalho, manter apenas linhas que parecem identificação da lei
    var linhasCab = cabecalho.split("\n").filter(function(l){
      var t = l.trim();
      return /lei|decreto|portaria|resolução|n[°º]\s*\d|complementar/i.test(t) && t.length > 4;
    });
    result = linhasCab.slice(-3).join("\n") + "\n\n" + corpo;
  }

  // ── REMOVER RODAPÉ após assinatura final ──
  // Após "Vargem Grande do Rio Pardo, DD de mês de AAAA" + assinatura
  var fimM = result.match(/(Vargem Grande[^\.]+\d{4}\.?\s*\n[\s\S]{0,300}?)(Prefeito|Presidente|Secretári)/i);
  if(fimM){
    var fimIdx = result.indexOf(fimM[0]) + fimM[0].length + 80;
    // Cortar tudo após ~80 chars depois da assinatura
    var posAssinatura = fimIdx;
    var depois = result.substring(posAssinatura);
    // Se depois tem mais de 3 linhas não-vazias = rodapé = cortar
    var linhasDepois = depois.split("\n").filter(function(l){ return l.trim().length > 5; });
    if(linhasDepois.length > 2){
      result = result.substring(0, posAssinatura);
    }
  }

  return result.trim();
}

function processExtractedText(rawText, fileName, fileSize){
  setProgress(88, "Limpando timbrado e cabeçalhos...");

  // ── STEP 1: LIMPEZA DO TIMBRADO ──
  var text = limparTimbrado(rawText);

  setProgress(92, "Estruturando campos e artigos...");

  // ── STEP 2: AUTO-DETECT CAMPOS ──
  var tipo = "Lei Ordinária";
  var texto300 = text.substring(0,400).toLowerCase();
  if(/lei complementar/i.test(texto300)) tipo = "Lei Complementar";
  else if(/decreto/i.test(texto300)) tipo = "Decreto";
  else if(/portaria/i.test(texto300)) tipo = "Portaria";
  else if(/resolução/i.test(texto300)) tipo = "Resolução";

  var numM = text.match(/n[º°ú.]\s*\.?\s*(\d+[\s\/]\d{4})/i);
  var num = numM ? numM[1].replace(/\s+/,"/").trim() : "";

  var dataM = text.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i)
           || text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  var data = "";
  if(dataM){
    var meses={janeiro:"01",fevereiro:"02",março:"03",abril:"04",maio:"05",junho:"06",
               julho:"07",agosto:"08",setembro:"09",outubro:"10",novembro:"11",dezembro:"12"};
    if(dataM[0].toLowerCase().includes(" de ")){
      var mes=meses[dataM[2].toLowerCase()]||"01";
      data=dataM[3]+"-"+mes+"-"+(dataM[1].length===1?"0":"")+dataM[1];
    } else {
      data=dataM[3]+"-"+dataM[2]+"-"+dataM[1];
    }
  }

  var ementaM = text.match(/ementa[:\s]+([^\n]{20,300})/i)
             || text.match(/dispõe[^.]{10,250}\./i)
             || text.match(/institui[^.]{10,250}\./i)
             || text.match(/regulamenta[^.]{10,250}\./i)
             || text.match(/estabelece[^.]{10,250}\./i)
             || text.match(/autoriza[^.]{10,250}\./i);
  var ementa = ementaM ? ementaM[0].replace(/^ementa[:\s]*/i,"").trim() : "";

  // ── STEP 3: PREENCHER CAMPOS ──
  var tipoSel = document.getElementById("lei-tipo");
  if(tipoSel){
    for(var i=0;i<tipoSel.options.length;i++){
      if(tipoSel.options[i].text.toLowerCase().includes(tipo.toLowerCase())){
        tipoSel.selectedIndex=i; break;
      }
    }
  }
  if(num){ var ne=document.getElementById("lei-num"); if(ne) ne.value=num; }
  if(data){ var de=document.getElementById("lei-data"); if(de) de.value=data; }
  if(ementa){ var ee=document.getElementById("lei-ementa"); if(ee) ee.value=ementa.substring(0,300); }

  // Editor com texto JÁ limpo
  var ed=document.getElementById("lei-editor");
  if(ed) ed.value=text;

  // ── STEP 4: ARTIGOS ──
  var artigos=parseArtigosFromText(text);
  _leiArtigos=artigos;

  // Render artigo cards
  renderArtigoCards(artigos);
  if(artigos.length){
    var badge=document.getElementById("lei-artigos-badge");
    if(badge){badge.style.display="inline";badge.textContent=artigos.length+" artigos";}
    var bp2=document.getElementById("btn-lei-preview"); if(bp2) bp2.style.display="inline";
  }

  finishLeiUpload(fileName, fileSize, artigos.length);
}

function applyExtractedLei(lei, fileName, fileSize){
  // Fill form fields
  if(lei.tipo){
    var sel = document.getElementById("lei-tipo");
    if(sel) for(var i=0;i<sel.options.length;i++){
      if(sel.options[i].text.toLowerCase() === lei.tipo.toLowerCase()){
        sel.selectedIndex = i; break;
      }
    }
  }
  if(lei.numero){ var n=document.getElementById("lei-num"); if(n) n.value=lei.numero; }
  if(lei.data){
    // Convert DD/MM/YYYY to YYYY-MM-DD for date input
    var d=document.getElementById("lei-data");
    if(d){
      var parts = lei.data.split("/");
      if(parts.length===3) d.value = parts[2]+"-"+parts[1]+"-"+parts[0];
      else d.value = lei.data;
    }
  }
  if(lei.ementa){ var em=document.getElementById("lei-ementa"); if(em) em.value=lei.ementa; }

  // Fill editor with full text
  if(lei.textoCompleto){
    var ed=document.getElementById("lei-editor"); if(ed) ed.value=lei.textoCompleto;
  }

  // Store articles
  if(lei.artigos && lei.artigos.length){
    _leiArtigos = lei.artigos;
    var badge = document.getElementById("lei-artigos-badge");
    if(badge){ badge.style.display="inline"; badge.textContent=lei.artigos.length+" artigos"; }
    var btnPrev = document.getElementById("btn-preview-art");
    if(btnPrev) btnPrev.style.display="inline";
    var btnPrev2 = document.getElementById("btn-lei-preview");
    if(btnPrev2) btnPrev2.style.display="inline";
  }

  finishLeiUpload(fileName, fileSize, lei.artigos ? lei.artigos.length : 0);
}

function finishLeiUpload(fileName, fileSize, artCount){
  setProgress(100, "Concluído!");
  setTimeout(function(){
    document.getElementById("lei-upload-loading").style.display = "none";
    document.getElementById("lei-upload-done").style.display    = "block";
    var nameEl = document.getElementById("lei-pdf-name");
    if(nameEl) nameEl.textContent = fileName;
    var countEl = document.getElementById("lei-art-count");
    if(countEl && artCount > 0) countEl.textContent = "— "+artCount+" artigos extraídos";

    // Show stored PDF bar
    var stored = document.getElementById("lei-pdf-stored");
    if(stored){
      stored.style.display = "flex";
      var sn = document.getElementById("lei-pdf-stored-name");
      var ss = document.getElementById("lei-pdf-stored-size");
      if(sn) sn.textContent = fileName;
      if(ss) ss.textContent = (fileSize/1024/1024).toFixed(2)+" MB — PDF original preservado";
    }

    showToast("PDF processado! "+artCount+" artigos extraídos.", "s");
    flash();
  }, 400);
}

function fallbackExtract(fileName, fileSize){
  fallbackSemExtract(fileName, fileSize);
}
function fallbackSemExtract(fileName, fileSize){
  document.getElementById("lei-upload-loading").style.display = "none";
  document.getElementById("lei-upload-done").style.display    = "block";
  var nameEl = document.getElementById("lei-pdf-name");
  if(nameEl) nameEl.textContent = fileName || "arquivo.pdf";
  var countEl = document.getElementById("lei-art-count");
  if(countEl) countEl.textContent = "— preencha o texto manualmente";
  var stored = document.getElementById("lei-pdf-stored");
  if(stored && fileName){
    stored.style.display = "flex";
    var sn = document.getElementById("lei-pdf-stored-name");
    var ss = document.getElementById("lei-pdf-stored-size");
    if(sn) sn.textContent = fileName;
    if(ss) ss.textContent = fileSize ? (fileSize/1024/1024).toFixed(2)+" MB" : "";
  }
  showToast("PDF salvo. Preencha o texto manualmente se necessário.", "i");
}

function resetLeiUpload(e){
  if(e) e.stopPropagation();
  _leiPdfFile   = null;
  _leiPdfBase64 = null;
  _leiArtigos   = [];
  document.getElementById("lei-upload-done").style.display    = "none";
  document.getElementById("lei-upload-loading").style.display = "none";
  document.getElementById("lei-upload-idle").style.display    = "block";
  var stored = document.getElementById("lei-pdf-stored");
  if(stored) stored.style.display = "none";
  var badge = document.getElementById("lei-artigos-badge");
  if(badge) badge.style.display = "none";
  var btnPrev = document.getElementById("btn-preview-art");
  if(btnPrev) btnPrev.style.display = "none";
  var btnPrev2 = document.getElementById("btn-lei-preview");
  if(btnPrev2) btnPrev2.style.display = "none";
  document.getElementById("lei-pdf-input").value = "";
}

function previewArtigos(){
  var prev = document.getElementById("lei-artigos-preview");
  var list = document.getElementById("lei-artigos-list");
  if(!prev || !list) return;

  if(!_leiArtigos.length){
    // Parse from textarea
    _leiArtigos = parseArtigosFromText(document.getElementById("lei-editor").value);
  }

  if(!_leiArtigos.length){
    showToast("Nenhum artigo encontrado. Verifique o texto da lei.", "w"); return;
  }

  list.innerHTML = _leiArtigos.map(function(a){
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;margin-bottom:8px;background:var(--bg2);border-radius:6px;border:1px solid var(--bdr)">'
      +'<span style="background:var(--g5);color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:4px;flex-shrink:0;margin-top:2px;letter-spacing:.3px">'+a.art+'</span>'
      +'<div style="font-size:12px;color:var(--txt2);line-height:1.7;white-space:pre-wrap">'+a.texto.substring(0,200)+(a.texto.length>200?"...":"")+'</div>'
      +'</div>';
  }).join("");

  prev.style.display = prev.style.display === "none" ? "block" : "none";
}

function parseArtigosFromText(text){
  if(!text) return [];
  var artigos = [];
  // Split on Art. N° or Art. N - handles º ° and various spacings
  var parts = text.split(/(?=Art\.?\s*\d+[°º]?)/i).filter(function(p){
    return /^Art\.?\s*\d+/i.test(p.trim());
  });
  if(!parts.length){
    // Try alternate: "ARTIGO 1" format
    parts = text.split(/(?=ARTIGO\s+\d+)/i).filter(function(p){
      return /^ARTIGO\s+\d+/i.test(p.trim());
    });
  }
  parts.forEach(function(part){
    part = part.trim();
    var artM = part.match(/^(Art\.?\s*\d+[°º]?|ARTIGO\s+\d+)/i);
    if(artM){
      var artLabel = artM[0].trim()
        .replace(/^ARTIGO\s+(\d+)/i, "Art. $1º")
        .replace(/Art\.\s*(\d+)([°º]?)/i, "Art. $1º");
      artigos.push({ art: artLabel, texto: part });
    }
  });
  return artigos;
}

function downloadLeiPDF(){
  if(!_leiPdfFile){
    showToast("Nenhum PDF anexado", "e"); return;
  }
  var url = URL.createObjectURL(_leiPdfFile);
  var a   = document.createElement("a");
  a.href  = url;
  a.download = _leiPdfFile.name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Download iniciado!", "s");
}

function salvarLei(){
  var tipo   = document.getElementById("lei-tipo") ? document.getElementById("lei-tipo").value : "";
  var num    = document.getElementById("lei-num")  ? document.getElementById("lei-num").value  : "";
  var ementa = document.getElementById("lei-ementa") ? document.getElementById("lei-ementa").value : "";
  if(!num || !ementa){
    showToast("Preencha pelo menos o Número e a Ementa", "w"); return;
  }
  closeMo("mo-lei");
  flash();
  showToast(tipo+" "+num+" cadastrada com "+(_leiArtigos.length||"?")+" artigos!", "s");
  // Reset for next use
  setTimeout(function(){
    resetLeiUpload(null);
    document.getElementById("lei-editor").value = "";
    document.getElementById("lei-artigos-preview").style.display = "none";
    _leiArtigos = [];
  }, 400);
}


// ══════════════════════════════════════════════════════
// PREVIEW DA LEI — igual ao site público
// ══════════════════════════════════════════════════════
var _previewData = {};

function abrirPreviewLei(){
  // Collect form data
  var tipo   = (document.getElementById("lei-tipo")   || {}).value || "Lei Ordinária";
  var num    = (document.getElementById("lei-num")    || {}).value || "—";
  var dataV  = (document.getElementById("lei-data")   || {}).value || "";
  var sit    = (document.getElementById("lei-sit")    || {}).value || "Vigente";
  var ementa = (document.getElementById("lei-ementa") || {}).value || "";
  var vinc   = (document.getElementById("lei-vinc")   || {}).value || "";
  var texto  = (document.getElementById("lei-editor") || {}).value || "";

  // Format date DD/MM/YYYY
  var dataFmt = dataV;
  if(dataV && dataV.includes("-")){
    var p = dataV.split("-"); dataFmt = p[2]+"/"+p[1]+"/"+p[0];
  }

  // Parse artigos from stored array or extract from text
  var artigos = _leiArtigos && _leiArtigos.length
    ? _leiArtigos
    : parseArtigosFromText(texto);

  _previewData = {tipo, num, dataFmt, sit, ementa, vinc, texto, artigos};

  // ── HEADER ──
  var sitColors = {Vigente:"#2ecc40", Alterada:"#e67e22", Revogada:"#f85149"};
  document.getElementById("lp-tipo-badge").textContent  = tipo.toUpperCase();
  document.getElementById("lp-titulo").textContent      = tipo + " Nº " + num;
  document.getElementById("lp-ementa-head").textContent = ementa;
  document.getElementById("lp-data-badge").querySelector("span").textContent = dataFmt || "—";
  document.getElementById("lp-sit-txt").textContent     = sit;
  document.getElementById("lp-sit-dot").style.background = sitColors[sit] || "#2ecc40";
  document.getElementById("lp-pub-data").textContent    = dataFmt || "—";
  document.getElementById("lp-ementa-body").textContent = ementa;

  // Alteration badge
  var altBadge = document.getElementById("lp-alt-badge");
  var avisoAlt = document.getElementById("lp-aviso-alt");
  if(vinc){
    altBadge.style.display = "flex";
    document.getElementById("lp-alt-txt").textContent = vinc;
    avisoAlt.style.display = "flex";
  } else {
    altBadge.style.display = "none";
    avisoAlt.style.display = "none";
  }

  // PDF button
  var pdfBtn = document.getElementById("lp-btn-pdf");
  if(pdfBtn) pdfBtn.style.display = _leiPdfFile ? "flex" : "none";

  // ── RENDER ARTIGOS ──
  renderArtigosPreview(artigos, sit, vinc);

  openMo("mo-lei-preview");
}

function renderArtigosPreview(artigos, sit, vinc){
  var cont = document.getElementById("lp-artigos-container");
  if(!cont) return;

  if(!artigos || !artigos.length){
    // No articles parsed — show raw text
    cont.innerHTML = '<pre style="font-family:Courier New,monospace;font-size:12px;line-height:1.9;color:#1a2a1a;white-space:pre-wrap;word-break:break-word;margin:0">'
      + ((document.getElementById("lei-editor")||{}).value||"Nenhum texto informado.") + '</pre>';
    return;
  }

  var html = "";
  artigos.forEach(function(a){
    if(a.textoAntigo && a.textoNovo){
      // ── ARTIGO ALTERADO: riscado em cima, vigente embaixo ──
      html += '<div style="margin-bottom:8px">'
        // Antigo riscado
        + '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#fff4f4;border-radius:6px 6px 0 0;border:1px solid #fcc;border-bottom:none">'
          + '<span style="background:#e74c3c;color:#fff;font-size:11px;font-weight:800;padding:2px 9px;border-radius:4px;flex-shrink:0;letter-spacing:.3px;margin-top:1px">'+a.art+'</span>'
          + '<div style="color:#c0392b;font-size:13px;line-height:1.8;text-decoration:line-through;text-decoration-color:rgba(192,57,43,.5);white-space:pre-wrap;font-family:inherit">'+a.textoAntigo+'</div>'
        + '</div>'
        // Referência alteração
        + '<div style="padding:5px 14px 5px 44px;background:#fff4f4;border:1px solid #fcc;border-top:none;border-bottom:none">'
          + '<span style="font-size:11px;color:#e74c3c;font-style:italic">(Alterado pelo(a) '+(a.alteradoPor||vinc||"lei posterior")+')</span>'
        + '</div>'
        // Novo vigente
        + '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#f6fff8;border-radius:0 0 6px 6px;border:1px solid #b2dfb2">'
          + '<span style="background:#1a7a1a;color:#fff;font-size:11px;font-weight:800;padding:2px 9px;border-radius:4px;flex-shrink:0;letter-spacing:.3px;margin-top:1px">'+a.art+'</span>'
          + '<div style="color:#1a2a1a;font-size:13px;line-height:1.8;white-space:pre-wrap;font-family:inherit">'+a.textoNovo+'</div>'
        + '</div>'
      + '</div>';
    } else {
      // ── ARTIGO NORMAL ──
      html += '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;margin-bottom:6px;background:#fff;border-radius:6px;border:1px solid #e0e8e0">'
        + '<span style="background:#1a7a1a;color:#fff;font-size:11px;font-weight:800;padding:2px 9px;border-radius:4px;flex-shrink:0;letter-spacing:.3px;margin-top:1px">'+a.art+'</span>'
        + '<div style="color:#1a2a1a;font-size:13px;line-height:1.8;white-space:pre-wrap;font-family:inherit">'+(a.texto||a.textoNovo||"")+'</div>'
      + '</div>';
    }
  });

  cont.innerHTML = html;
}

function printLeiPreview(){
  var d = _previewData;
  var w = window.open("","_blank","width=700,height=900");
  var artHtml = "";
  (d.artigos||[]).forEach(function(a){
    if(a.textoAntigo && a.textoNovo){
      artHtml += '<div style="margin-bottom:10px;border-left:3px solid #e74c3c;padding:8px 12px;background:#fff4f4">'
        + '<strong style="color:#e74c3c">['+a.art+' — ORIGINAL]</strong><br>'
        + '<span style="text-decoration:line-through;color:#c0392b">'+a.textoAntigo+'</span><br>'
        + '<em style="font-size:11px;color:#e74c3c">(Alterado pelo(a) '+(a.alteradoPor||d.vinc||"lei posterior")+')</em>'
        + '</div>'
        + '<div style="margin-bottom:14px;border-left:3px solid #1a7a1a;padding:8px 12px;background:#f6fff8">'
        + '<strong style="color:#1a7a1a">['+a.art+' — VIGENTE]</strong><br>'+a.textoNovo+'</div>';
    } else {
      artHtml += '<div style="margin-bottom:10px"><strong>'+a.art+'</strong><br>'+(a.texto||a.textoNovo||"")+'</div>';
    }
  });
  w.document.write('<html><head><title>'+d.tipo+' Nº '+d.num+'</title>'
    +'<style>body{font-family:Arial,sans-serif;font-size:13px;line-height:1.8;padding:40px;max-width:680px;margin:0 auto}h2{font-size:18px}h3{font-size:13px;color:#444;font-weight:normal;margin-top:4px}pre{white-space:pre-wrap;font-family:inherit}footer{border-top:1px solid #ccc;margin-top:32px;padding-top:12px;font-size:10px;color:#888}</style>'
    +'</head><body><h2>'+d.tipo.toUpperCase()+' Nº '+d.num+'</h2><h3>'+d.ementa+'</h3>'+artHtml
    +'<footer>Portal da Transparência — Prefeitura de Vargem Grande do Rio Pardo — MG · CNPJ 19.851.397/0001-39 · Publicado: '+d.dataFmt+'</footer>'
    +'<\/body><\/html>');
  w.document.close(); w.focus(); setTimeout(function(){ w.print(); }, 400);
}

function copyLeiPreview(){
  var d = _previewData;
  var t = d.tipo.toUpperCase()+" Nº "+d.num+"\n"+d.ementa+"\n\n";
  (d.artigos||[]).forEach(function(a){
    t += a.art+"\n"+(a.textoNovo||a.texto||"")+"\n\n";
  });
  navigator.clipboard.writeText(t)
    .then(function(){ showToast("Texto copiado!","s"); })
    .catch(function(){
      var ta=document.createElement("textarea"); ta.value=t;
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      showToast("Texto copiado!","s");
    });
}

function downloadLeiTxt(){
  var d = _previewData;
  var t = d.tipo.toUpperCase()+" Nº "+d.num+"\n"+d.ementa+"\n\n";
  (d.artigos||[]).forEach(function(a){
    t += a.art+"\n"+(a.textoNovo||a.texto||"")+"\n\n";
  });
  t += "\n---\nPortal da Transparência — Prefeitura de Vargem Grande do Rio Pardo — MG\nPublicado: "+d.dataFmt;
  var b=new Blob([t],{type:"text/plain;charset=utf-8"});
  var a=document.createElement("a");
  a.href=URL.createObjectURL(b);
  a.download=(d.tipo+"-"+d.num).replace(/\//g,"_").replace(/ /g,"-")+".txt";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  showToast("Download iniciado!","s");
}


// ══════════════════════════════════════════════════════
// EDITOR DE ARTIGOS EM CARDS
// ══════════════════════════════════════════════════════

function renderArtigoCards(artigos){
  var cont = document.getElementById("lei-artigos-cards");
  if(!cont) return;
  cont.innerHTML = "";
  if(!artigos || !artigos.length){
    cont.innerHTML = '<div style="text-align:center;padding:32px 20px;color:#4a6a4a;font-size:13px;border:1px dashed #2a3a2a;border-radius:8px;background:#0f1a0f">'
      +'<div style="font-size:32px;margin-bottom:8px">📄</div>'
      +'<div style="color:#7a9a7a;font-weight:600;margin-bottom:4px">Nenhum artigo ainda</div>'
      +'<div style="font-size:11px">Faça upload do PDF ou clique em <strong style="color:#2ecc40">+ Artigo</strong></div>'
      +'</div>';
    return;
  }
  artigos.forEach(function(a, idx){
    cont.appendChild(criarArtigoCard(a, idx));
  });
  // Sync hidden textarea
  syncEditorFromCards();
  // Update nav bar
  updateArtigoNav(artigos.length);
}

function criarArtigoCard(a, idx){
  var isAlt  = !!(a.textoAntigo && a.textoNovo);
  var txtVer = a.textoNovo || a.texto || "";
  var artNum = a.art || ("Art. " + (idx+1) + "\u00ba");

  // ── CARD WRAPPER — sem overflow hidden ──
  var card = document.createElement("div");
  card.className = "artigo-card";
  card.dataset.idx = String(idx);
  card.style.cssText = [
    "border-radius:8px",
    "border:1px solid " + (isAlt ? "#e67e22" : "#2a3a2a"),
    "margin-bottom:8px",
    "background:#0f1a0f",
  ].join(";");

  // ── HEADER ──
  var hdr = document.createElement("div");
  hdr.style.cssText = "display:flex;align-items:center;gap:6px;padding:9px 12px;background:#0d160d;border-bottom:1px solid #2a3a2a;cursor:pointer;flex-wrap:wrap";

  // Badge artigo
  var badge = document.createElement("span");
  badge.style.cssText = "background:#1a7a1a;color:#fff;font-size:10px;font-weight:800;padding:3px 11px;border-radius:4px;letter-spacing:.5px;white-space:nowrap;flex-shrink:0";
  badge.textContent = artNum;

  // Alt badge
  var altB = null;
  if(isAlt){
    altB = document.createElement("span");
    altB.style.cssText = "background:#e67e22;color:#fff;font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;white-space:nowrap;flex-shrink:0";
    altB.textContent = "ALTERADO";
  }

  // Expandir indicador
  var expandIco = document.createElement("span");
  expandIco.className = "art-expand-ico";
  expandIco.style.cssText = "font-size:11px;color:#4a6a4a;margin-left:2px;transition:transform .2s;flex-shrink:0";
  expandIco.textContent = "\u25BC"; // ▼

  var spacer = document.createElement("div");
  spacer.style.flex = "1";

  // Botões
  function mkBtn(html, bg, bdr, color, fn){
    var b = document.createElement("button");
    b.innerHTML = html;
    b.style.cssText = "background:"+bg+";border:1px solid "+bdr+";color:"+color+";cursor:pointer;font-size:11px;font-weight:700;padding:4px 11px;border-radius:4px;font-family:'Barlow Condensed',sans-serif;letter-spacing:.3px;white-space:nowrap;flex-shrink:0";
    b.addEventListener("click", function(e){ e.stopPropagation(); fn(); });
    return b;
  }

  var btnUp   = mkBtn("↑","#1a221a","#2a3a2a","#7a9a7a", function(){ moverArtigo(idx,-1); });
  var btnDown = mkBtn("↓","#1a221a","#2a3a2a","#7a9a7a", function(){ moverArtigo(idx,1); });
  var btnEdit = mkBtn("✏️ Editar","#1a3a1a","#2ecc40","#2ecc40", function(){ editarArtigo(idx); });
  var btnDel  = mkBtn("🗑 Excluir","#3a1a1a","#f85149","#f85149", function(){ removerArtigo(idx); });

  hdr.appendChild(badge);
  if(altB) hdr.appendChild(altB);
  hdr.appendChild(expandIco);
  hdr.appendChild(spacer);
  hdr.appendChild(btnUp);
  hdr.appendChild(btnDown);
  hdr.appendChild(btnEdit);
  hdr.appendChild(btnDel);

  // Toggle collapse on header click
  hdr.addEventListener("click", function(){
    var vd = card.querySelector(".art-view");
    var ed = card.querySelector(".art-edit");
    if(!vd) return;
    var collapsed = vd.style.display === "none" && (!ed || ed.style.display === "none");
    if(collapsed){
      vd.style.display = "block";
      expandIco.style.transform = "rotate(0deg)";
    } else {
      if(ed && ed.style.display !== "none") return; // editing — don't collapse
      vd.style.display = "none";
      expandIco.style.transform = "rotate(-90deg)";
    }
  });

  card.appendChild(hdr);

  // ── VIEW BODY — texto completo visível ──
  var viewDiv = document.createElement("div");
  viewDiv.className = "art-view";
  viewDiv.style.cssText = "padding:14px 16px;background:#0f1a0f";

  if(isAlt){
    // Label original
    var lbO = document.createElement("div");
    lbO.style.cssText = "font-size:9px;font-weight:800;color:#e67e22;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px";
    lbO.textContent = "Texto Original (riscado):";
    viewDiv.appendChild(lbO);
    // Texto original
    var tO = document.createElement("div");
    tO.style.cssText = "color:#e07060;font-size:12.5px;line-height:1.85;text-decoration:line-through;opacity:.8;white-space:pre-wrap;font-family:'JetBrains Mono',monospace;margin-bottom:12px;padding:10px 12px;background:#1a0e0e;border-radius:6px;border-left:3px solid #e74c3c";
    tO.textContent = a.textoAntigo || "";
    viewDiv.appendChild(tO);
    // Label vigente
    var lbV = document.createElement("div");
    lbV.style.cssText = "font-size:9px;font-weight:800;color:#2ecc40;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px";
    lbV.textContent = "Texto Vigente:";
    viewDiv.appendChild(lbV);
    // Texto vigente
    var tV = document.createElement("div");
    tV.style.cssText = "color:#c8e6c8;font-size:12.5px;line-height:1.85;white-space:pre-wrap;font-family:'JetBrains Mono',monospace;padding:10px 12px;background:#0d1f0d;border-radius:6px;border-left:3px solid #2ecc40";
    tV.textContent = txtVer;
    viewDiv.appendChild(tV);
  } else {
    var tN = document.createElement("div");
    if(txtVer){
      tN.style.cssText = "color:#c8e6c8;font-size:12.5px;line-height:1.85;white-space:pre-wrap;font-family:'JetBrains Mono',monospace;padding:10px 12px;background:#111f11;border-radius:6px;border-left:3px solid #2a3a2a";
      tN.textContent = txtVer;
    } else {
      tN.style.cssText = "color:#4a6a4a;font-size:12px;font-style:italic;padding:10px 12px;background:#111a11;border-radius:6px;border:1px dashed #2a3a2a";
      tN.textContent = "Clique em \u270F\uFE0F Editar para adicionar o texto deste artigo...";
    }
    viewDiv.appendChild(tN);
  }

  card.appendChild(viewDiv);

  // ── EDIT BODY ──
  var editDiv = document.createElement("div");
  editDiv.className = "art-edit";
  editDiv.style.cssText = "display:none;padding:12px 16px;background:#080f08;border-top:1px solid #2a3a2a";

  // Número
  var numRow = document.createElement("div");
  numRow.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap";

  var numLbl = document.createElement("label");
  numLbl.textContent = "N\u00famero do artigo:";
  numLbl.style.cssText = "font-size:11px;color:#7a9a7a;white-space:nowrap;flex-shrink:0";
  numRow.appendChild(numLbl);

  var numInp = document.createElement("input");
  numInp.className = "artigo-num-input";
  numInp.value = artNum;
  numInp.dataset.idx = String(idx);
  numInp.placeholder = "Art. 1\u00ba";
  numInp.style.cssText = "background:#1a221a;border:1px solid #2ecc40;border-radius:4px;color:#e2ebe2;font-size:13px;font-weight:700;padding:6px 10px;outline:none;width:130px;flex-shrink:0";
  numRow.appendChild(numInp);

  if(!isAlt){
    var altLbl = document.createElement("label");
    altLbl.style.cssText = "display:flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:#7a9a7a";
    var altChk = document.createElement("input");
    altChk.type = "checkbox";
    altChk.className = "art-alt-chk";
    altChk.dataset.idx = String(idx);
    altChk.style.cssText = "cursor:pointer;accent-color:#e67e22;width:14px;height:14px;flex-shrink:0";
    altChk.addEventListener("change", function(){ toggleAlteradoCard(this, idx); });
    altLbl.appendChild(altChk);
    altLbl.appendChild(document.createTextNode(" Este artigo foi alterado por outra lei"));
    numRow.appendChild(altLbl);
  }
  editDiv.appendChild(numRow);

  function mkLbl(txt, color){
    var l = document.createElement("div");
    l.textContent = txt;
    l.style.cssText = "font-size:10px;font-weight:700;color:"+color+";text-transform:uppercase;letter-spacing:1px;margin-bottom:5px";
    editDiv.appendChild(l);
  }
  function mkTA(field, val, bg, bdr, rows){
    var ta = document.createElement("textarea");
    ta.className = "artigo-ta";
    ta.dataset.idx = String(idx);
    ta.dataset.field = field;
    ta.rows = rows;
    ta.value = val || "";
    ta.style.cssText = "background:"+bg+";border:1px solid "+bdr+";border-radius:6px;color:#e2ebe2;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.7;padding:10px;width:100%;box-sizing:border-box;resize:vertical;outline:none;margin-bottom:10px;min-height:80px";
    editDiv.appendChild(ta);
    return ta;
  }

  if(isAlt){
    mkLbl("Texto Original (ficar\u00e1 riscado no portal):", "#e67e22");
    mkTA("textoAntigo", a.textoAntigo, "#1f1010","rgba(248,81,73,.3)", 4);
    mkLbl("Texto Vigente (reda\u00e7\u00e3o atual):", "#2ecc40");
    mkTA("textoNovo", a.textoNovo, "#101a10","rgba(46,204,64,.2)", 6);
  } else {
    mkLbl("Texto do artigo:", "#7a9a7a");
    mkTA("texto", a.texto, "#1a221a","#2ecc40", 8);
  }

  var btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex;gap:8px;justify-content:flex-end;margin-top:4px";
  var bSave = mkBtn("\u2705 Salvar","#2ecc40","#2ecc40","#000", function(){ salvarEdicaoArtigo(idx); });
  var bCanc = mkBtn("Cancelar","#1a221a","#2a3a2a","#7a9a7a", function(){ cancelarEdicaoArtigo(idx); });
  bSave.style.padding = "7px 20px";
  bCanc.style.padding = "7px 16px";
  btnRow.appendChild(bSave);
  btnRow.appendChild(bCanc);
  editDiv.appendChild(btnRow);
  card.appendChild(editDiv);

  return card;
}

function escHtml(str){
  return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function addArtigoCard(){
  var n = _leiArtigos.length + 1;
  _leiArtigos.push({ art:"Art. "+n+"º", texto:"" });
  renderArtigoCards(_leiArtigos);
  var cont = document.getElementById("lei-artigos-cards");
  if(cont) setTimeout(function(){ cont.scrollTop = cont.scrollHeight; }, 80);
  // Open new card in edit mode
  setTimeout(function(){
    editarArtigo(_leiArtigos.length - 1, null);
  }, 100);
}

function removerArtigo(idx){
  if(!confirm("Remover este artigo?")) return;
  _leiArtigos.splice(idx,1);
  renderArtigoCards(_leiArtigos);
  syncEditorFromCards();
}

function moverArtigo(idx, dir){
  var to = idx + dir;
  if(to < 0 || to >= _leiArtigos.length) return;
  var tmp = _leiArtigos[idx];
  _leiArtigos[idx] = _leiArtigos[to];
  _leiArtigos[to] = tmp;
  renderArtigoCards(_leiArtigos);
}

function updateArtigoNum(input, idx){
  if(_leiArtigos[idx]) _leiArtigos[idx].art = input.value;
  // Update badge label
  var card = input.closest(".artigo-card");
  if(card){
    var badge = card.querySelector("span");
    if(badge) badge.textContent = input.value;
  }
  syncEditorFromCards();
}

function syncEditorFromCards(){
  // Sync textareas back to _leiArtigos
  document.querySelectorAll(".artigo-ta").forEach(function(ta){
    var idx = parseInt(ta.dataset.idx);
    var field = ta.dataset.field;
    if(!isNaN(idx) && _leiArtigos[idx] && field){
      _leiArtigos[idx][field] = ta.value;
    }
  });
  // Also sync hidden textarea for compatibility
  var ed = document.getElementById("lei-editor");
  if(ed){
    ed.value = _leiArtigos.map(function(a){
      return a.art+"\n"+(a.textoNovo||a.texto||"");
    }).join("\n\n");
  }
  // Update badge
  var badge = document.getElementById("lei-artigos-badge");
  if(badge && _leiArtigos.length){
    badge.style.display = "inline";
    badge.textContent = _leiArtigos.length+" artigos";
  }
}

// Override renderArtigoCards call after extraction
var _origApplyExtracted = typeof applyExtractedLei !== "undefined" ? applyExtractedLei : null;


function editarArtigo(idx){
  var cards = document.querySelectorAll(".artigo-card");
  var card = null;
  cards.forEach(function(c2){ if(c2.dataset.idx===String(idx)) card=c2; });
  if(!card) card = cards[idx];
  if(!card) return;
  card.querySelector(".art-view").style.display = "none";
  card.querySelector(".art-edit").style.display = "block";
  card.style.borderColor = "#2ecc40";
  var ta = card.querySelector(".artigo-ta");
  if(ta) setTimeout(function(){ ta.focus(); ta.setSelectionRange(ta.value.length,ta.value.length); }, 80);
}

function salvarEdicaoArtigo(idx){
  var cards = document.querySelectorAll(".artigo-card");
  var card = null;
  cards.forEach(function(c2){ if(c2.dataset.idx===String(idx)) card=c2; });
  if(!card) card = cards[idx];
  if(!card) return;

  var numInput = card.querySelector(".artigo-num-input");
  if(numInput && _leiArtigos[idx]) _leiArtigos[idx].art = numInput.value.trim();

  card.querySelectorAll(".artigo-ta").forEach(function(ta){
    var field = ta.dataset.field;
    if(field && _leiArtigos[idx]) _leiArtigos[idx][field] = ta.value;
  });

  syncEditorFromCards();
  renderArtigoCards(_leiArtigos);
  showToast("Artigo salvo!", "s");
}

function cancelarEdicaoArtigo(idx){
  var cards = document.querySelectorAll(".artigo-card");
  var card = null;
  cards.forEach(function(c2){ if(c2.dataset.idx===String(idx)) card=c2; });
  if(!card) card = cards[idx];
  if(!card) return;
  card.querySelector(".art-view").style.display = "block";
  card.querySelector(".art-edit").style.display = "none";
  card.style.borderColor = _leiArtigos[idx] && (_leiArtigos[idx].textoAntigo) ? "#e67e22" : "#2a3a2a";
}

function toggleAlteradoCard(chk, idx){
  // Toggle between normal and alterado card
  if(chk.checked){
    _leiArtigos[idx].textoAntigo = _leiArtigos[idx].texto || "";
    _leiArtigos[idx].textoNovo   = "";
    delete _leiArtigos[idx].texto;
  } else {
    _leiArtigos[idx].texto = _leiArtigos[idx].textoNovo || _leiArtigos[idx].textoAntigo || "";
    delete _leiArtigos[idx].textoAntigo;
    delete _leiArtigos[idx].textoNovo;
  }
  renderArtigoCards(_leiArtigos);
  // Re-open in edit mode
  setTimeout(function(){ editarArtigo(idx, null); }, 80);
}


function scrollArtigosTop(){
  var cont = document.getElementById("lei-artigos-cards");
  if(cont) cont.scrollTop = 0;
}
function scrollArtigosBottom(){
  var cont = document.getElementById("lei-artigos-cards");
  if(cont) cont.scrollTop = cont.scrollHeight;
}
function updateArtigoNav(count){
  var nav  = document.getElementById("lei-art-nav");
  var info = document.getElementById("lei-art-nav-info");
  var btn  = document.getElementById("btn-scroll-down");
  var cont = document.getElementById("lei-artigos-cards");
  if(!nav || !cont) return;
  if(count > 0){
    nav.style.display  = "flex";
    if(info) info.textContent = count + " artigo" + (count>1?"s":"") + " cadastrado" + (count>1?"s":"");
    // Show scroll btn only if scrollable
    setTimeout(function(){
      if(btn) btn.style.display = (cont.scrollHeight > cont.clientHeight) ? "block" : "none";
    }, 100);
  } else {
    nav.style.display = "none";
    if(btn) btn.style.display = "none";
  }
}


(function(){var el=document.getElementById("panel-intro");if(el)setTimeout(function(){el.classList.add("hide");setTimeout(function(){el.classList.add("gone");},800);},1400);})();

const mockData = {
  dashboard: {
    noticias: 14,
    vereadores: 11,
    diarios: 8,
    legislacoes: 27,
    concursos: 3,
    esicPendentes: 5,
    ouvidoriaPendente: 4,
    usuarios: 6
  },
  noticias: [
    { id: 1, titulo: 'Sessão ordinária desta semana', status: 'Publicada', data: '2026-05-23' },
    { id: 2, titulo: 'Audiência pública sobre saúde', status: 'Rascunho', data: '2026-05-20' }
  ],
  vereadores: [
    { id: 1, nome: 'Ana Souza', partido: 'ABC', status: 'Ativo' },
    { id: 2, nome: 'Carlos Lima', partido: 'DEF', status: 'Ativo' }
  ],
  diario: [
    { id: 1, edicao: '125', data: '2026-05-21', status: 'Publicado' },
    { id: 2, edicao: '124', data: '2026-05-14', status: 'Publicado' }
  ],
  legislacao: [
    { id: 1, numero: 'PL 012/2026', tipo: 'Projeto de Lei', status: 'Em tramitação' },
    { id: 2, numero: 'LC 003/2026', tipo: 'Lei Complementar', status: 'Aprovada' }
  ],
  concursos: [{ titulo: 'Concurso Administrativo 2026', status: 'Inscrições abertas' }],
  esic: [{ protocolo: 'ESIC-2026-0004', assunto: 'Acesso a contratos', status: 'Em análise' }],
  ouvidoria: [{ protocolo: 'OUV-2026-0012', assunto: 'Solicitação de informação', status: 'Pendente' }],
  configuracoes: [{ chave: 'tema', valor: 'escuro' }, { chave: 'nome_painel', valor: 'Painel Câmara' }],
  usuarios: [{ nome: 'Administrador', email: 'admin@camara.gov.br', perfil: 'Admin' }]
};

const titles = {
  dashboard: 'Dashboard',
  noticias: 'Notícias',
  vereadores: 'Vereadores',
  diario: 'Diário Oficial',
  legislacao: 'Legislação',
  concursos: 'Concursos',
  esic: 'e-SIC',
  ouvidoria: 'Ouvidoria',
  configuracoes: 'Configurações',
  usuarios: 'Usuários'
};

const container = document.getElementById('view-container');
const titleEl = document.getElementById('view-title');
const menu = document.getElementById('menu');

function renderTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderView(view) {
  titleEl.textContent = titles[view] || 'Painel';

  if (view === 'dashboard') {
    const d = mockData.dashboard;
    container.innerHTML = `
      <div class="grid">
        <article class="card"><h3>Notícias</h3><div class="kpi">${d.noticias}</div></article>
        <article class="card"><h3>Vereadores</h3><div class="kpi">${d.vereadores}</div></article>
        <article class="card"><h3>Diários</h3><div class="kpi">${d.diarios}</div></article>
        <article class="card"><h3>Legislação</h3><div class="kpi">${d.legislacoes}</div></article>
        <article class="card"><h3>Concursos</h3><div class="kpi">${d.concursos}</div></article>
        <article class="card"><h3>e-SIC pendentes</h3><div class="kpi">${d.esicPendentes}</div></article>
        <article class="card"><h3>Ouvidoria pendente</h3><div class="kpi">${d.ouvidoriaPendente}</div></article>
        <article class="card"><h3>Usuários</h3><div class="kpi">${d.usuarios}</div></article>
      </div>
      <div class="panel-note">SPA único em funcionamento. Integrações futuras devem usar <strong>API_BASE</strong>: ${API_BASE}</div>
    `;
    return;
  }

  if (view === 'noticias') {
    container.innerHTML = renderTable(['ID', 'Título', 'Status', 'Data'], mockData.noticias.map((n) => [n.id, n.titulo, `<span class="badge ${n.status === 'Publicada' ? 'ok' : 'warn'}">${n.status}</span>`, n.data]));
    return;
  }
  if (view === 'vereadores') {
    container.innerHTML = renderTable(['ID', 'Nome', 'Partido', 'Status'], mockData.vereadores.map((v) => [v.id, v.nome, v.partido, `<span class="badge ok">${v.status}</span>`]));
    return;
  }
  if (view === 'diario') {
    container.innerHTML = renderTable(['ID', 'Edição', 'Data', 'Status'], mockData.diario.map((d) => [d.id, d.edicao, d.data, `<span class="badge info">${d.status}</span>`]));
    return;
  }
  if (view === 'legislacao') {
    container.innerHTML = renderTable(['ID', 'Número', 'Tipo', 'Status'], mockData.legislacao.map((l) => [l.id, l.numero, l.tipo, `<span class="badge warn">${l.status}</span>`]));
    return;
  }

  const generic = mockData[view] || [];
  container.innerHTML = generic.length
    ? renderTable(Object.keys(generic[0]).map((k) => k.toUpperCase()), generic.map((obj) => Object.values(obj)))
    : '<div class="panel-note">Sem dados mockados para esta seção.</div>';
}

menu.addEventListener('click', (event) => {
  const button = event.target.closest('.menu-item');
  if (!button) return;

  menu.querySelectorAll('.menu-item').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');

  renderView(button.dataset.view);
});

renderView('dashboard');
