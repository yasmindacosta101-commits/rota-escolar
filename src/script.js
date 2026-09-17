/* ===================== ESTADO (em memória, sem backend) ===================== */
let state = {
  screen: 'login',          // login | escola | motorista
  escolaTab: 'alunos',      // alunos | motoristas | rotas | pontos | associacao
  motoristaLogado: null,    // id do motorista "logado"
  motoristaEtapa: 'rota',   // rota | pontos | alunos
  pontoSelecionado: null,

  alunos: [
    { id:1, nome:'Sofia Almeida', turma:'5º A', id_rota:1, id_ponto:1 },
    { id:2, nome:'Miguel Torres', turma:'5º A', id_rota:1, id_ponto:1 },
    { id:3, nome:'Laura Ferreira', turma:'4º B', id_rota:1, id_ponto:2 },
    { id:4, nome:'Davi Souza', turma:'3º C', id_rota:2, id_ponto:3 },
  ],
  motoristas: [
    { id:1, nome:'Carlos Menezes', cnh:'04582211903', telefone:'(41) 99811-2233' },
    { id:2, nome:'Renata Duarte', cnh:'03971188420', telefone:'(41) 99622-4410' },
  ],
  rotas: [
    { id:1, nome:'Rota Norte', turno:'Manhã', id_motorista:1 },
    { id:2, nome:'Rota Sul', turno:'Tarde', id_motorista:2 },
  ],
  pontos: [
    { id:1, nome:'Praça das Flores', endereco:'Rua das Acácias, 120', id_rota:1 },
    { id:2, nome:'Terminal Central', endereco:'Av. Brasil, 900', id_rota:1 },
    { id:3, nome:'Vila Esperança', endereco:'Rua 7 de Setembro, 45', id_rota:2 },
  ],
  registros: [], // { id, id_aluno, id_ponto, data, embarcou }

  nextId: { aluno:5, motorista:3, rota:3, ponto:4, registro:1 },
  formError: null,
};

/* ---- persistência no navegador (localStorage) ---- */
const STORAGE_KEY = 'rota-escolar-dados';
function salvarNoNavegador(){
  const dados = {
    alunos: state.alunos,
    motoristas: state.motoristas,
    rotas: state.rotas,
    pontos: state.pontos,
    registros: state.registros,
    nextId: state.nextId,
  };
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(dados)); }catch(e){}
}
function carregarDoNavegador(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const dados = JSON.parse(raw);
    Object.assign(state, dados);
  }catch(e){}
}

function render(){
  salvarNoNavegador();
  document.getElementById('app').innerHTML = App();
}

/* ===================== HELPERS ===================== */
function rotaNome(id){ const r = state.rotas.find(r=>r.id===id); return r ? r.nome : '—'; }
function motoristaNome(id){ const m = state.motoristas.find(m=>m.id===id); return m ? m.nome : '—'; }
function pontoNome(id){ const p = state.pontos.find(p=>p.id===id); return p ? p.nome : '—'; }
function pontosDaRota(idRota){ return state.pontos.filter(p=>p.id_rota===idRota); }
function alunosDoPonto(idPonto){ return state.alunos.filter(a=>a.id_ponto===idPonto); }
function hojeISO(){ return new Date().toISOString().slice(0,10); }
function registroDoDia(idAluno, idPonto){
  return state.registros.find(r=>r.id_aluno===idAluno && r.id_ponto===idPonto && r.data===hojeISO());
}

function setScreen(s){ state.screen = s; state.formError = null; render(); }

/* ===================== TOPBAR ===================== */
function Topbar(){
  let who = '';
  if(state.screen==='escola') who = 'Escola';
  if(state.screen==='motorista') who = state.motoristaLogado ? motoristaNome(state.motoristaLogado) : 'Motorista';
  return `
    <div class="topbar">
      <div class="brand"><span class="dot"></span>Rota Escolar</div>
      ${state.screen!=='login' ? `
        <div class="who">
          <span>${who}</span>
          <button class="link" onclick="voltarLogin()">Sair</button>
        </div>` : ''}
    </div>
  `;
}
function voltarLogin(){
  state.screen='login';
  state.motoristaLogado=null;
  state.motoristaEtapa='rota';
  state.pontoSelecionado=null;
  render();
}

/* ===================== LOGIN ===================== */
function LoginScreen(){
  return `
    <div class="login-wrap">
      <div class="login-card">
        <div class="kicker">PROTÓTIPO — SEGUNDA ETAPA</div>
        <h1>Bem-vindo ao Rota Escolar</h1>
        <p class="sub">Escolha como você quer entrar no sistema para continuar.</p>
        <div class="role-grid">
          <button class="role-card" onclick="setScreen('escola')" style="border:none;">
            <div class="icon">🏫</div>
            <h3>Sou da Escola</h3>
            <p>Cadastre alunos, motoristas, rotas e pontos de embarque, e associe os alunos às rotas.</p>
          </button>
          <button class="role-card" onclick="abrirSelecaoMotorista()" style="border:none;">
            <div class="icon">🚌</div>
            <h3>Sou Motorista</h3>
            <p>Consulte sua rota, veja os alunos de cada ponto e registre quem embarcou.</p>
          </button>
        </div>
      </div>
    </div>
  `;
}
function abrirSelecaoMotorista(){
  state.screen = 'seleciona-motorista';
  render();
}
function SelecionaMotoristaScreen(){
  const opcoes = state.motoristas.map(m=>`<option value="${m.id}">${m.nome}</option>`).join('');
  return `
    <div class="login-wrap">
      <div class="login-card" style="max-width:420px;">
        <div class="kicker">ÁREA DO MOTORISTA</div>
        <h1 style="font-size:26px;">Qual motorista é você?</h1>
        <p class="sub">Selecione seu nome para ver sua rota de hoje.</p>
        <div class="card" style="text-align:left;">
          <div class="field">
            <label>Motorista</label>
            <select id="sel-motorista">${opcoes}</select>
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="entrarComoMotorista()">Entrar</button>
            <button class="btn btn-ghost" onclick="setScreen('login')">Voltar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
function entrarComoMotorista(){
  const id = parseInt(document.getElementById('sel-motorista').value);
  state.motoristaLogado = id;
  state.screen = 'motorista';
  state.motoristaEtapa = 'rota';
  render();
}

/* ===================== ESCOLA — SHELL ===================== */
const ESCOLA_TABS = [
  { key:'alunos', label:'Alunos' },
  { key:'motoristas', label:'Motoristas' },
  { key:'rotas', label:'Rotas' },
  { key:'pontos', label:'Pontos de embarque' },
  { key:'associacao', label:'Associação' },
];
function EscolaScreen(){
  return `
    <div class="shell">
      <div class="sidebar">
        ${ESCOLA_TABS.map(t=>`
          <button class="${state.escolaTab===t.key?'active':''}" onclick="setEscolaTab('${t.key}')">${t.label}</button>
        `).join('')}
      </div>
      <div class="content">
        ${EscolaTabContent()}
      </div>
    </div>
  `;
}
function setEscolaTab(tab){ state.escolaTab = tab; state.formError=null; render(); }

function EscolaTabContent(){
  switch(state.escolaTab){
    case 'alunos': return TabAlunos();
    case 'motoristas': return TabMotoristas();
    case 'rotas': return TabRotas();
    case 'pontos': return TabPontos();
    case 'associacao': return TabAssociacao();
  }
}

function ErrorBox(){
  return state.formError ? `<div class="error-msg">${state.formError}</div>` : '';
}

/* ----- RF01: Alunos ----- */
function TabAlunos(){
  const rows = state.alunos.map(a=>`
    <tr>
      <td>${a.nome}</td>
      <td>${a.turma}</td>
      <td>${a.id_rota ? rotaNome(a.id_rota) : '<span class="tag tag-muted">sem rota</span>'}</td>
      <td>${a.id_ponto ? pontoNome(a.id_ponto) : '<span class="tag tag-muted">sem ponto</span>'}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="removerAluno(${a.id})">Remover</button></td>
    </tr>
  `).join('');
  return `
    <h2 class="page-title">Alunos</h2>
    <p class="page-sub">RF01 — Cadastro dos alunos que utilizam o transporte escolar.</p>
    <div class="card">
      <h3>Novo aluno</h3>
      ${ErrorBox()}
      <div class="form-grid">
        <div class="field"><label>Nome completo</label><input id="al-nome" placeholder="Ex: Ana Souza"></div>
        <div class="field"><label>Turma</label><input id="al-turma" placeholder="Ex: 5º A"></div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" onclick="salvarAluno()">Salvar aluno</button></div>
    </div>
    <div class="card">
      <h3>Alunos cadastrados (${state.alunos.length})</h3>
      ${state.alunos.length ? `
        <table>
          <tr><th>Nome</th><th>Turma</th><th>Rota</th><th>Ponto</th><th></th></tr>
          ${rows}
        </table>` : `<div class="empty">Nenhum aluno cadastrado ainda.</div>`}
    </div>
  `;
}
function salvarAluno(){
  const nome = document.getElementById('al-nome').value.trim();
  const turma = document.getElementById('al-turma').value.trim();
  if(!nome || !turma){ state.formError='Preencha nome e turma para continuar.'; render(); return; }
  state.alunos.push({ id: state.nextId.aluno++, nome, turma, id_rota:null, id_ponto:null });
  state.formError=null;
  render();
}
function removerAluno(id){ state.alunos = state.alunos.filter(a=>a.id!==id); render(); }

/* ----- RF02: Motoristas ----- */
function TabMotoristas(){
  const rows = state.motoristas.map(m=>`
    <tr>
      <td>${m.nome}</td><td>${m.cnh}</td><td>${m.telefone}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="removerMotorista(${m.id})">Remover</button></td>
    </tr>
  `).join('');
  return `
    <h2 class="page-title">Motoristas</h2>
    <p class="page-sub">RF02 — Cadastro dos motoristas responsáveis pelas escalas.</p>
    <div class="card">
      <h3>Novo motorista</h3>
      ${ErrorBox()}
      <div class="form-grid">
        <div class="field"><label>Nome completo</label><input id="mo-nome" placeholder="Ex: João Pereira"></div>
        <div class="field"><label>CNH</label><input id="mo-cnh" placeholder="Número da CNH"></div>
        <div class="field"><label>Telefone</label><input id="mo-tel" placeholder="(00) 00000-0000"></div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" onclick="salvarMotorista()">Salvar motorista</button></div>
    </div>
    <div class="card">
      <h3>Motoristas cadastrados (${state.motoristas.length})</h3>
      ${state.motoristas.length ? `
        <table><tr><th>Nome</th><th>CNH</th><th>Telefone</th><th></th></tr>${rows}</table>
      ` : `<div class="empty">Nenhum motorista cadastrado ainda.</div>`}
    </div>
  `;
}
function salvarMotorista(){
  const nome = document.getElementById('mo-nome').value.trim();
  const cnh = document.getElementById('mo-cnh').value.trim();
  const telefone = document.getElementById('mo-tel').value.trim();
  if(!nome || !cnh || !telefone){ state.formError='Preencha todos os campos do motorista.'; render(); return; }
  state.motoristas.push({ id: state.nextId.motorista++, nome, cnh, telefone });
  state.formError=null;
  render();
}
function removerMotorista(id){ state.motoristas = state.motoristas.filter(m=>m.id!==id); render(); }

/* ----- RF03: Rotas ----- */
function TabRotas(){
  const opcoesMotorista = state.motoristas.map(m=>`<option value="${m.id}">${m.nome}</option>`).join('');
  const rows = state.rotas.map(r=>`
    <tr>
      <td>${r.nome}</td><td>${r.turno}</td><td>${motoristaNome(r.id_motorista)}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="removerRota(${r.id})">Remover</button></td>
    </tr>
  `).join('');
  return `
    <h2 class="page-title">Rotas</h2>
    <p class="page-sub">RF03 — Cadastro e organização das rotas do transporte escolar.</p>
    <div class="card">
      <h3>Nova rota</h3>
      ${ErrorBox()}
      <div class="form-grid">
        <div class="field"><label>Nome da rota</label><input id="ro-nome" placeholder="Ex: Rota Leste"></div>
        <div class="field"><label>Turno</label>
          <select id="ro-turno"><option>Manhã</option><option>Tarde</option><option>Noite</option></select>
        </div>
        <div class="field"><label>Motorista responsável</label>
          <select id="ro-motorista">${opcoesMotorista || '<option value="">Cadastre um motorista primeiro</option>'}</select>
        </div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" onclick="salvarRota()">Salvar rota</button></div>
    </div>
    <div class="card">
      <h3>Rotas cadastradas (${state.rotas.length})</h3>
      ${state.rotas.length ? `
        <table><tr><th>Rota</th><th>Turno</th><th>Motorista</th><th></th></tr>${rows}</table>
      ` : `<div class="empty">Nenhuma rota cadastrada ainda.</div>`}
    </div>
  `;
}
function salvarRota(){
  const nome = document.getElementById('ro-nome').value.trim();
  const turno = document.getElementById('ro-turno').value;
  const id_motorista = document.getElementById('ro-motorista').value;
  if(!nome){ state.formError='Informe o nome da rota.'; render(); return; }
  if(!id_motorista){ state.formError='Cadastre um motorista antes de criar uma rota.'; render(); return; }
  state.rotas.push({ id: state.nextId.rota++, nome, turno, id_motorista: parseInt(id_motorista) });
  state.formError=null;
  render();
}
function removerRota(id){
  state.rotas = state.rotas.filter(r=>r.id!==id);
  state.pontos = state.pontos.filter(p=>p.id_rota!==id);
  render();
}

/* ----- RF04: Pontos de embarque ----- */
function TabPontos(){
  const opcoesRota = state.rotas.map(r=>`<option value="${r.id}">${r.nome}</option>`).join('');
  const rows = state.pontos.map(p=>`
    <tr>
      <td>${p.nome}</td><td>${p.endereco}</td><td>${rotaNome(p.id_rota)}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="removerPonto(${p.id})">Remover</button></td>
    </tr>
  `).join('');
  return `
    <h2 class="page-title">Pontos de embarque</h2>
    <p class="page-sub">RF04 — Cadastro dos pontos de embarque de cada rota.</p>
    <div class="card">
      <h3>Novo ponto de embarque</h3>
      ${ErrorBox()}
      ${!state.rotas.length ? `<div class="error-msg">Cadastre uma rota antes de adicionar pontos de embarque.</div>` : `
      <div class="form-grid">
        <div class="field"><label>Nome do ponto</label><input id="pt-nome" placeholder="Ex: Praça Central"></div>
        <div class="field"><label>Endereço</label><input id="pt-endereco" placeholder="Rua, número"></div>
        <div class="field"><label>Rota</label><select id="pt-rota">${opcoesRota}</select></div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" onclick="salvarPonto()">Salvar ponto</button></div>
      `}
    </div>
    <div class="card">
      <h3>Pontos cadastrados (${state.pontos.length})</h3>
      ${state.pontos.length ? `
        <table><tr><th>Ponto</th><th>Endereço</th><th>Rota</th><th></th></tr>${rows}</table>
      ` : `<div class="empty">Nenhum ponto cadastrado ainda.</div>`}
    </div>
  `;
}
function salvarPonto(){
  const nome = document.getElementById('pt-nome').value.trim();
  const endereco = document.getElementById('pt-endereco').value.trim();
  const id_rota = document.getElementById('pt-rota').value;
  if(!nome || !endereco){ state.formError='Preencha nome e endereço do ponto.'; render(); return; }
  if(!id_rota){ state.formError='Cadastre a rota primeiro.'; render(); return; }
  state.pontos.push({ id: state.nextId.ponto++, nome, endereco, id_rota: parseInt(id_rota) });
  state.formError=null;
  render();
}
function removerPonto(id){ state.pontos = state.pontos.filter(p=>p.id!==id); render(); }

/* ----- RF05: Associação ----- */
function TabAssociacao(){
  const opcoesAluno = state.alunos.map(a=>`<option value="${a.id}">${a.nome}</option>`).join('');
  const rows = state.alunos.map(a=>`
    <tr>
      <td>${a.nome}</td>
      <td>${a.id_rota ? rotaNome(a.id_rota) : '<span class="tag tag-stop">não associado</span>'}</td>
      <td>${a.id_ponto ? pontoNome(a.id_ponto) : '—'}</td>
    </tr>
  `).join('');
  return `
    <h2 class="page-title">Associação de alunos</h2>
    <p class="page-sub">RF05 — Associe cada aluno a uma rota e a um ponto de embarque.</p>
    <div class="card">
      <h3>Associar aluno</h3>
      ${ErrorBox()}
      ${!state.alunos.length ? `<div class="error-msg">Cadastre alunos primeiro.</div>` : `
      <div class="form-grid">
        <div class="field"><label>Aluno</label><select id="as-aluno" onchange="atualizarPontosAssociacao()">${opcoesAluno}</select></div>
        <div class="field"><label>Rota</label>
          <select id="as-rota" onchange="atualizarPontosAssociacao()">
            <option value="">Selecione a rota</option>
            ${state.rotas.map(r=>`<option value="${r.id}">${r.nome}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>Ponto de embarque</label><select id="as-ponto"><option value="">Selecione a rota primeiro</option></select></div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" onclick="salvarAssociacao()">Salvar associação</button></div>
      `}
    </div>
    <div class="card">
      <h3>Situação dos alunos</h3>
      <table><tr><th>Aluno</th><th>Rota</th><th>Ponto</th></tr>${rows}</table>
    </div>
  `;
}
function atualizarPontosAssociacao(){
  const idRota = parseInt(document.getElementById('as-rota').value);
  const sel = document.getElementById('as-ponto');
  const pontos = pontosDaRota(idRota);
  sel.innerHTML = pontos.length
    ? pontos.map(p=>`<option value="${p.id}">${p.nome}</option>`).join('')
    : '<option value="">Nenhum ponto nessa rota</option>';
}
function salvarAssociacao(){
  const idAluno = parseInt(document.getElementById('as-aluno').value);
  const idRota = parseInt(document.getElementById('as-rota').value);
  const idPonto = parseInt(document.getElementById('as-ponto').value);
  if(!idAluno || !idRota || !idPonto){ state.formError='Selecione aluno, rota e ponto de embarque válidos.'; render(); return; }
  const aluno = state.alunos.find(a=>a.id===idAluno);
  aluno.id_rota = idRota;
  aluno.id_ponto = idPonto;
  state.formError=null;
  render();
}

/* ===================== MOTORISTA ===================== */
function MotoristaScreen(){
  const rota = state.rotas.find(r=>r.id_motorista===state.motoristaLogado);
  if(!rota){
    return `
      <div class="content">
        <h2 class="page-title">Sem rota atribuída</h2>
        <p class="page-sub">Este motorista ainda não está associado a nenhuma rota. Fale com a escola.</p>
      </div>`;
  }
  if(state.motoristaEtapa==='rota') return MotoristaRota(rota);
  if(state.motoristaEtapa==='pontos') return MotoristaPontos(rota);
  if(state.motoristaEtapa==='alunos') return MotoristaAlunos(rota);
}

function MotoristaRota(rota){
  const pontos = pontosDaRota(rota.id);
  return `
    <div class="content">
      <h2 class="page-title">Sua rota de hoje</h2>
      <p class="page-sub">RF06 — Consulta da rota e dos pontos de embarque.</p>
      <div class="card">
        <h3>${rota.nome} · ${rota.turno}</h3>
        <p style="color:var(--muted); font-size:13.5px; margin-bottom:14px;">${pontos.length} ponto(s) de embarque nesta rota.</p>
        <button class="btn btn-primary" onclick="irParaPontos()">Ver pontos de embarque</button>
      </div>
    </div>
  `;
}
function irParaPontos(){ state.motoristaEtapa='pontos'; render(); }

function MotoristaPontos(rota){
  const pontos = pontosDaRota(rota.id);
  const cards = pontos.map(p=>{
    const alunos = alunosDoPonto(p.id);
    const feitos = alunos.filter(a=>registroDoDia(a.id,p.id)).length;
    const pct = alunos.length ? Math.round((feitos/alunos.length)*100) : 0;
    return `
      <div class="point-card">
        <h4>${p.nome}</h4>
        <p>${p.endereco}</p>
        <div class="progress-bar"><div style="width:${pct}%"></div></div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12.5px; color:var(--muted);">${feitos}/${alunos.length} registrados</span>
          <button class="btn btn-primary btn-sm" onclick="abrirPonto(${p.id})">Ver alunos</button>
        </div>
      </div>
    `;
  }).join('');
  return `
    <div class="content">
      <div class="breadcrumb"><button onclick="state.motoristaEtapa='rota'; render();">${rota.nome}</button> / Pontos de embarque</div>
      <h2 class="page-title">Pontos de embarque</h2>
      <p class="page-sub">Toque em um ponto para ver os alunos e registrar o embarque.</p>
      <div class="point-grid">${cards || '<div class="empty">Nenhum ponto cadastrado nesta rota.</div>'}</div>
    </div>
  `;
}
function abrirPonto(idPonto){ state.pontoSelecionado = idPonto; state.motoristaEtapa='alunos'; render(); }

function MotoristaAlunos(rota){
  const ponto = state.pontos.find(p=>p.id===state.pontoSelecionado);
  const alunos = alunosDoPonto(ponto.id);
  const rowsHtml = alunos.map(a=>{
    const reg = registroDoDia(a.id, ponto.id);
    const embarcou = reg ? reg.embarcou : null;
    return `
      <div class="student-row">
        <div>
          <div class="student-name">${a.nome}</div>
          <div class="student-turma">${a.turma}</div>
        </div>
        <div class="toggle-group">
          <button class="toggle-btn ${embarcou===true?'on-go':''}" onclick="registrarEmbarque(${a.id}, ${ponto.id}, true)">Embarcou</button>
          <button class="toggle-btn ${embarcou===false?'on-stop':''}" onclick="registrarEmbarque(${a.id}, ${ponto.id}, false)">Não embarcou</button>
        </div>
      </div>
    `;
  }).join('');
  return `
    <div class="content">
      <div class="breadcrumb"><button onclick="state.motoristaEtapa='pontos'; render();">${rota.nome}</button> / ${ponto.nome}</div>
      <h2 class="page-title">${ponto.nome}</h2>
      <p class="page-sub">RF07/RF08 — Alunos do ponto e registro de embarque.</p>
      <div class="card">
        ${alunos.length ? rowsHtml : '<div class="empty">Nenhum aluno associado a este ponto.</div>'}
      </div>
      <button class="btn btn-ghost" onclick="state.motoristaEtapa='pontos'; render();">Voltar aos pontos</button>
    </div>
  `;
}
function registrarEmbarque(idAluno, idPonto, embarcou){
  const existente = registroDoDia(idAluno, idPonto);
  if(existente){ existente.embarcou = embarcou; }
  else {
    state.registros.push({ id: state.nextId.registro++, id_aluno:idAluno, id_ponto:idPonto, data:hojeISO(), embarcou });
  }
  render();
}

/* ===================== APP ROOT ===================== */
function App(){
  let body = '';
  if(state.screen==='login') body = LoginScreen();
  else if(state.screen==='seleciona-motorista') body = SelecionaMotoristaScreen();
  else if(state.screen==='escola') body = EscolaScreen();
  else if(state.screen==='motorista') body = `<div class="shell">${MotoristaScreen()}</div>`;

  return `${Topbar()}${body}`;
}

carregarDoNavegador();
render();