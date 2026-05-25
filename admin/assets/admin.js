const API_BASE = '../api/';

const state = { current: 'dashboard', data: { noticias: [], vereadores: [], diario: [] } };
const sections = { dashboard:'Dashboard', noticias:'Notícias', vereadores:'Vereadores', diario:'Diário Oficial', legislacao:'Legislação', concursos:'Concursos', esic:'e-SIC', ouvidoria:'Ouvidoria', config:'Configurações', usuarios:'Usuários' };

function $(s, r=document){ return r.querySelector(s); }
function $all(s, r=document){ return Array.from(r.querySelectorAll(s)); }
function esc(v){ return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function dateBR(v){ if(!v) return '-'; const d = new Date(String(v).replace(' ', 'T')); return isNaN(d.getTime()) ? esc(v) : d.toLocaleDateString('pt-BR'); }

function toast(msg, type='i'){
  let w = $('#toast-w');
  if(!w){ w = document.createElement('div'); w.id='toast-w'; w.className='toast-w'; document.body.appendChild(w); }
  const el = document.createElement('div');
  el.className = 'toast t-' + ({s:'success', e:'error', i:'info', w:'warning'}[type] || type);
  el.textContent = msg;
  w.appendChild(el);
  setTimeout(()=>{ el.classList.add('fo'); setTimeout(()=>el.remove(),350); },2800);
}

async function api(path, opts={}){
  const res = await fetch(API_BASE + path, { credentials:'include', headers:{'Content-Type':'application/json', ...(opts.headers||{})}, ...opts });
  const txt = await res.text();
  let json = null;
  try { json = txt ? JSON.parse(txt) : null; } catch(_){ throw new Error('Resposta inválida da API: ' + txt.slice(0,120)); }
  if(!res.ok || (json && json.ok === false)) throw new Error((json && json.error) || 'Erro HTTP ' + res.status);
  return json;
}

async function loadNoticias(){ const j = await api('noticias.php'); state.data.noticias = j.data || []; return state.data.noticias; }
async function saveNoticia(data){ return api('noticias.php' + (data.id ? '?id=' + encodeURIComponent(data.id) : ''), { method:data.id?'PUT':'POST', body:JSON.stringify(data) }); }
async function deleteNoticia(id){ return api('noticias.php?id=' + encodeURIComponent(id), { method:'DELETE' }); }
async function loadVereadores(){ const j = await api('vereadores.php?admin=1'); state.data.vereadores = j.data || []; return state.data.vereadores; }
async function saveVereador(data){ return api('vereadores.php' + (data.id ? '?id=' + encodeURIComponent(data.id) : ''), { method:data.id?'PUT':'POST', body:JSON.stringify(data) }); }
async function deleteVereador(id){ return api('vereadores.php?id=' + encodeURIComponent(id), { method:'DELETE' }); }
async function loadDiario(){ const j = await api('diario.php?admin=1'); state.data.diario = j.data || []; return state.data.diario; }
async function saveDiario(data){ return api('diario.php' + (data.id ? '?id=' + encodeURIComponent(data.id) : ''), { method:data.id?'PUT':'POST', body:JSON.stringify(data) }); }
async function deleteDiario(id){ return api('diario.php?id=' + encodeURIComponent(id), { method:'DELETE' }); }
async function loadLegislacao(){ return []; }
async function saveLegislacao(data){ toast('Legislação será ligada na próxima etapa.', 'w'); return data; }
async function deleteLegislacao(id){ toast('Legislação será ligada na próxima etapa.', 'w'); return id; }

function menuGroup(title, items){ return `<div class="grp-lbl">${title}</div>` + items.map(i=>`<button class="ni" type="button" data-page="${i[0]}"><span class="ni-ico">${i[1]}</span><span class="ni-lbl">${i[2]}</span></button>`).join(''); }
function renderShell(){
  document.body.innerHTML = `<div id="app"><aside class="sb" id="sb"><div class="sb-head"><div class="sb-logo-wrap">🏛️</div><div class="sb-ttl"><div class="t1">Vargem Grande</div><div class="t2">Painel Administrativo</div></div></div><div class="sb-usr"><div class="av">AD</div><div class="usr-info"><div class="usr-name">Administrador</div><div class="usr-role">Gestão do site</div></div><div class="usr-dot"></div></div><nav class="sb-nav">${menuGroup('VISÃO GERAL', [['dashboard','📊','Dashboard']])}${menuGroup('GESTÃO DO SITE', [['noticias','📰','Notícias'],['vereadores','👥','Vereadores'],['diario','📘','Diário Oficial'],['legislacao','⚖️','Legislação'],['concursos','📋','Concursos']])}${menuGroup('ATENDIMENTO', [['esic','📨','e-SIC'],['ouvidoria','🎧','Ouvidoria']])}${menuGroup('SISTEMA', [['config','⚙️','Configurações'],['usuarios','🔐','Usuários']])}</nav></aside><main class="main"><header class="topbar"><div class="tb-bc"><span>Painel</span><span class="sep">/</span><span class="cur" id="bc-cur">Dashboard</span></div><div class="tb-acts"><button class="tb-ico" onclick="refreshCurrent()">↻</button><button class="tb-ico" onclick="location.href='../'">↗</button></div></header><section class="content" id="view"></section></main></div><div class="toast-w" id="toast-w"></div>`;
}
function bindNav(){ $all('.ni').forEach(btn=>btn.addEventListener('click', ()=>go(btn.dataset.page))); }
async function go(page){ state.current = page; $all('.ni').forEach(n=>n.classList.toggle('act', n.dataset.page===page)); $('#bc-cur').textContent = sections[page] || page; history.replaceState({page}, '', '#'+page); await renderPage(page); }
async function refreshCurrent(){ await renderPage(state.current); toast('Atualizado', 's'); }
async function renderPage(page){ const view=$('#view'); view.innerHTML='<div class="panel-note">Carregando...</div>'; try{ if(page==='dashboard') return renderDashboard(); if(page==='noticias') return renderNoticias(); if(page==='vereadores') return renderVereadores(); if(page==='diario') return renderDiario(); return renderPlaceholder(page); }catch(e){ console.error(e); view.innerHTML=`<div class="alert al-r">Erro: ${esc(e.message)}</div>`; } }

function stat(icon,num,label){ return `<div class="scard g"><div class="sc-row"><div class="sc-ico ic-g">${icon}</div></div><div class="sc-num">${esc(num)}</div><div class="sc-lbl">${esc(label)}</div></div>`; }
async function renderDashboard(){ await Promise.allSettled([loadNoticias(),loadVereadores(),loadDiario()]); $('#view').innerHTML=`<div class="ph"><div><h1>Dashboard <em>Geral</em></h1><p>Resumo dos conteúdos ligados ao site público.</p></div></div><div class="stat-grid">${stat('📰',state.data.noticias.length,'Notícias')}${stat('👥',state.data.vereadores.length,'Vereadores')}${stat('📘',state.data.diario.length,'Diários')}${stat('⚖️','0','Leis')}</div><div class="tw"><div class="th"><div class="tt">Últimas notícias</div><button class="btn btn-p" onclick="go('noticias')">Gerenciar</button></div>${tableNoticias(state.data.noticias.slice(0,5))}</div>`; }

async function renderNoticias(){ const rows=await loadNoticias(); $('#view').innerHTML=`<div class="ph"><div><h1>Notícias <em>e Eventos</em></h1><p>Conteúdo publicado aparece automaticamente no site.</p></div><div class="ph-acts"><button class="btn btn-p" onclick="openNoticiaModal()">+ Nova Notícia</button></div></div><div class="tw"><div class="th"><div class="tt">Lista de notícias</div></div>${tableNoticias(rows)}</div>${modalNoticia()}`; }
function tableNoticias(rows){ if(!rows.length) return '<div class="panel-note">Nenhuma notícia cadastrada.</div>'; return `<table><thead><tr><th>Título</th><th>Categoria</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows.map(n=>`<tr><td class="tc">${esc(n.title)}</td><td>${esc(n.category||'-')}</td><td>${dateBR(n.published_at||n.created_at)}</td><td><span class="sp ${n.status==='published'?'sp-ok':'sp-pend'}">${n.status==='published'?'Publicada':'Rascunho'}</span></td><td><button class="btn btn-s btn-sm" onclick='openNoticiaModal(${JSON.stringify(n).replace(/'/g,"&#039;")})'>Editar</button> <button class="btn btn-d btn-sm" onclick="removeNoticia(${n.id})">Excluir</button></td></tr>`).join('')}</tbody></table>`; }
function modalNoticia(){ return `<div class="mo" id="mo-noticia"><div class="md"><div class="md-h"><h3>Nova Notícia</h3><button class="md-x" onclick="closeMo('mo-noticia')">×</button></div><div class="md-b"><input type="hidden" id="noticia-id"><div class="fg"><div class="fgrp span2"><label>Título</label><input class="fc" id="noticia-titulo"></div><div class="fgrp"><label>Categoria</label><input class="fc" id="noticia-categoria" value="Institucional"></div><div class="fgrp"><label>Data</label><input class="fc" id="noticia-data" type="date"></div><div class="fgrp span2"><label>Resumo</label><textarea class="fc" id="noticia-resumo"></textarea></div><div class="fgrp span2"><label>Conteúdo</label><textarea class="fc" id="noticia-conteudo" style="min-height:140px"></textarea></div><div class="fgrp span2"><label>Imagem capa (URL)</label><input class="fc" id="noticia-img" placeholder="https://..."></div></div></div><div class="md-f"><button class="btn btn-s" onclick="submitNoticia('draft')">Salvar rascunho</button><button class="btn btn-p" onclick="submitNoticia('published')">Publicar</button></div></div></div>`; }
function openNoticiaModal(n={}){ $('#noticia-id').value=n.id||''; $('#noticia-titulo').value=n.title||''; $('#noticia-categoria').value=n.category||'Institucional'; $('#noticia-data').value=(n.published_at||'').slice(0,10)||new Date().toISOString().slice(0,10); $('#noticia-resumo').value=n.summary||''; $('#noticia-conteudo').value=n.content||''; $('#noticia-img').value=n.image_url||''; openMo('mo-noticia'); }
async function submitNoticia(status){ const data={id:$('#noticia-id').value||undefined,title:$('#noticia-titulo').value.trim(),category:$('#noticia-categoria').value,summary:$('#noticia-resumo').value,content:$('#noticia-conteudo').value,image_url:$('#noticia-img').value,status,published_at:$('#noticia-data').value+' 09:00:00'}; if(!data.title) return toast('Informe o título.','w'); await saveNoticia(data); closeMo('mo-noticia'); toast('Notícia salva.','s'); renderNoticias(); }
async function removeNoticia(id){ if(confirm('Excluir notícia?')){ await deleteNoticia(id); toast('Notícia excluída.','s'); renderNoticias(); } }

async function renderVereadores(){ const rows=await loadVereadores(); $('#view').innerHTML=`<div class="ph"><div><h1>Vereadores <em>Ativos</em></h1><p>Gerencie vereadores exibidos no site.</p></div><button class="btn btn-p" onclick="openVereadorModal()">+ Novo Vereador</button></div><div class="tw"><div class="th"><div class="tt">Vereadores</div></div>${tableVereadores(rows)}</div>${modalVereador()}`; }
function tableVereadores(rows){ if(!rows.length)return '<div class="panel-note">Nenhum vereador cadastrado.</div>'; return `<table><thead><tr><th>Nome</th><th>Cargo</th><th>Partido</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows.map(v=>`<tr><td class="tc">${esc(v.name)}</td><td>${esc(v.role||'-')}</td><td>${esc(v.party||'-')}</td><td><span class="sp ${Number(v.active)!==0?'sp-ok':'sp-err'}">${Number(v.active)!==0?'Ativo':'Inativo'}</span></td><td><button class="btn btn-s btn-sm" onclick='openVereadorModal(${JSON.stringify(v).replace(/'/g,"&#039;")})'>Editar</button> <button class="btn btn-d btn-sm" onclick="removeVereador(${v.id})">Excluir</button></td></tr>`).join('')}</tbody></table>`; }
function modalVereador(){ return `<div class="mo" id="mo-vereador"><div class="md"><div class="md-h"><h3>Vereador</h3><button class="md-x" onclick="closeMo('mo-vereador')">×</button></div><div class="md-b"><input type="hidden" id="ver-id"><div class="fg"><div class="fgrp span2"><label>Nome</label><input class="fc" id="ver-name"></div><div class="fgrp"><label>Cargo</label><input class="fc" id="ver-role"></div><div class="fgrp"><label>Partido</label><input class="fc" id="ver-party"></div><div class="fgrp span2"><label>Foto URL</label><input class="fc" id="ver-photo"></div><div class="fgrp span2"><label>Biografia</label><textarea class="fc" id="ver-bio"></textarea></div></div></div><div class="md-f"><button class="btn btn-p" onclick="submitVereador()">Salvar</button></div></div></div>`; }
function openVereadorModal(v={}){ $('#ver-id').value=v.id||''; $('#ver-name').value=v.name||''; $('#ver-role').value=v.role||''; $('#ver-party').value=v.party||''; $('#ver-photo').value=v.photo_url||''; $('#ver-bio').value=v.biography||''; openMo('mo-vereador'); }
async function submitVereador(){ const data={id:$('#ver-id').value||undefined,name:$('#ver-name').value,role:$('#ver-role').value,party:$('#ver-party').value,photo_url:$('#ver-photo').value,biography:$('#ver-bio').value,active:1}; if(!data.name)return toast('Informe o nome.','w'); await saveVereador(data); closeMo('mo-vereador'); toast('Vereador salvo.','s'); renderVereadores(); }
async function removeVereador(id){ if(confirm('Excluir vereador?')){ await deleteVereador(id); toast('Vereador excluído.','s'); renderVereadores(); } }

async function renderDiario(){ const rows=await loadDiario(); $('#view').innerHTML=`<div class="ph"><div><h1>Diário <em>Oficial</em></h1><p>Edições publicadas aparecem no site.</p></div><button class="btn btn-p" onclick="openDiarioModal()">+ Nova Edição</button></div><div class="tw"><div class="th"><div class="tt">Edições</div></div>${tableDiario(rows)}</div>${modalDiario()}`; }
function tableDiario(rows){ if(!rows.length)return '<div class="panel-note">Nenhuma edição cadastrada.</div>'; return `<table><thead><tr><th>Título</th><th>Edição</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead><tbody>${rows.map(d=>`<tr><td class="tc">${esc(d.title)}</td><td>${esc(d.edition_number||'-')}</td><td>${dateBR(d.publication_date)}</td><td><span class="sp sp-ok">${esc(d.status||'published')}</span></td><td><button class="btn btn-s btn-sm" onclick='openDiarioModal(${JSON.stringify(d).replace(/'/g,"&#039;")})'>Editar</button></td></tr>`).join('')}</tbody></table>`; }
function modalDiario(){ return `<div class="mo" id="mo-diario"><div class="md"><div class="md-h"><h3>Diário Oficial</h3><button class="md-x" onclick="closeMo('mo-diario')">×</button></div><div class="md-b"><input type="hidden" id="dia-id"><div class="fg"><div class="fgrp span2"><label>Título</label><input class="fc" id="dia-title"></div><div class="fgrp"><label>Edição</label><input class="fc" id="dia-edition"></div><div class="fgrp"><label>Data</label><input class="fc" id="dia-date" type="date"></div><div class="fgrp span2"><label>PDF URL</label><input class="fc" id="dia-file"></div><div class="fgrp span2"><label>Descrição</label><textarea class="fc" id="dia-desc"></textarea></div></div></div><div class="md-f"><button class="btn btn-p" onclick="submitDiario()">Salvar</button></div></div></div>`; }
function openDiarioModal(d={}){ $('#dia-id').value=d.id||''; $('#dia-title').value=d.title||''; $('#dia-edition').value=d.edition_number||''; $('#dia-date').value=d.publication_date||new Date().toISOString().slice(0,10); $('#dia-file').value=d.file_url||''; $('#dia-desc').value=d.description||''; openMo('mo-diario'); }
async function submitDiario(){ const data={id:$('#dia-id').value||undefined,title:$('#dia-title').value,edition_number:$('#dia-edition').value,publication_date:$('#dia-date').value,file_url:$('#dia-file').value,description:$('#dia-desc').value,status:'published'}; if(!data.title)return toast('Informe o título.','w'); await saveDiario(data); closeMo('mo-diario'); toast('Diário salvo.','s'); renderDiario(); }

function renderPlaceholder(page){ $('#view').innerHTML=`<div class="ph"><div><h1>${esc(sections[page])}</h1><p>Módulo preparado para integração na próxima etapa.</p></div></div><div class="panel-note">Este módulo será ligado à API correspondente após validação de Notícias, Vereadores e Diário.</div>`; }
function openMo(id){ const m=$('#'+id); if(m)m.classList.add('open'); }
function closeMo(id){ const m=$('#'+id); if(m)m.classList.remove('open'); }

document.addEventListener('click', e=>{ if(e.target.classList.contains('mo')) e.target.classList.remove('open'); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') $all('.mo.open').forEach(m=>m.classList.remove('open')); });
document.addEventListener('DOMContentLoaded', ()=>{ renderShell(); bindNav(); const initial=(location.hash||'#dashboard').replace('#',''); go(sections[initial]?initial:'dashboard'); });
