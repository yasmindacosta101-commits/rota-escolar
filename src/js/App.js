/*
  js/app.js
  ------------------------------------------------------------
  Controla as telas (login, Escola, Motorista) e chama as
  funções dos outros arquivos (alunos.js, rotas.js, etc.) para
  ler e gravar no Firestore. Esta é a evolução do antigo
  script.js: a diferença é que os dados não ficam mais só na
  memória da página — agora vêm do Firebase em tempo real.
*/

let state = {
  tela: 'login',            // login | escola | motorista
  carregandoLogin: false,
  loginError: null,

  papel: null,               // 'escola' | 'motorista'
  motoristaId: null,
  rotaId: null,

  escolaTab: 'alunos',
  motoristaEtapa: 'rota',    // rota | pontos | alunos
  pontoSelecionado: null,

  alunos: [],
  motoristas: [],
  rotas: [],
  pontos: [],
  rotaAtual: null,
  embarquesHoje: [],

  formError: null,

  _unsubscribers: [],        // funções para "desligar" os listeners do Firestore
};

function render() { document.getElementById('app').innerHTML = App(); }

/* ===================== AUTENTICAÇÃO ===================== */

auth.onAuthStateChanged(function (user) {
  pararTodosOsListeners();

  if (!user) {
    state.tela = 'login';
    state.papel = null;
    render();
    return;
  }

  db.collection('usuarios').doc(user.uid).get().then(function (doc) {
    if (!doc.exists) {
      state.loginError = 'Usuário sem perfil configurado. Fale com a escola.';
      auth.signOut();
      return;
    }
    const dados = doc.data();
    state.papel = dados.papel;

    if (dados.papel === 'escola') {
      iniciarComoEscola();
    } else if (dados.papel === 'motorista') {
      state.motoristaId = dados.motoristaId;
      state.rotaId = dados.rotaId;
      iniciarComoMotorista();
    }
  });
});

function pararTodosOsListeners() {
  state._unsubscribers.forEach(function (unsub) { unsub(); });
  state._unsubscribers = [];
}

function iniciarComoEscola() {
  state.tela = 'escola';
  state.escolaTab = 'alunos';
  state._unsubscribers.push(ouvirAlunos(function (lista) { state.alunos = lista; render(); }));
  state._unsubscribers.push(ouvirMotoristas(function (lista) { state.motoristas = lista; render(); }));
  state._unsubscribers.push(ouvirRotas(function (lista) { state.rotas = lista; render(); }));
  state._unsubscribers.push(ouvirPontos(function (lista) { state.pontos = lista; render(); }));
  render();
}

function iniciarComoMotorista() {
  state.tela = 'motorista';
  state.motoristaEtapa = 'rota';
  state._unsubscribers.push(buscarRotaPorId(state.rotaId, function (rota) { state.rotaAtual = rota; render(); }));
  state._unsubscribers.push(ouvirPontos(function (lista) { state.pontos = lista; render(); }, state.rotaId));
  state._unsubscribers.push(ouvirAlunos(function (lista) { state.alunos = lista; render(); }, state.rotaId));
  state._unsubscribers.push(ouvirEmbarquesDoDia(state.rotaId, function (lista) { state.embarquesHoje = lista; render(); }));
  render();
}

function tentarLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  state.loginError = null;
  state.carregandoLogin = true;
  render();
  fazerLogin(email, senha,
    function () { state.carregandoLogin = false; },
    function (mensagem) { state.carregandoLogin = false; state.loginError = mensagem; render(); }
  );
}

function sair() { fazerLogout(); }

/* ===================== TOPBAR ===================== */
function Topbar() {
  if (state.tela === 'login') {
    return `<div class="topbar"><div class="brand"><span class="dot"></span>Rota Escolar</div></div>`;
  }
  const quem = state.papel === 'escola' ? 'Escola' : (state.rotaAtual ? state.rotaAtual.nome : 'Motorista');
  return `
    <div class="topbar">
      <div class="brand"><span class="dot"></span>Rota Escolar</div>
      <div class="who"><span>${quem}</span><button class="link" onclick="sair()">Sair</button></div>
    </div>`;
}

/* ===================== LOGIN ===================== */
function LoginScreen() {
  return `
    <div class="login-wrap">
      <div class="login-card" style="max-width:420px;">
        <div class="kicker">ACESSO AO SISTEMA</div>
        <h1 style="font-size:30px;">Entrar no Rota Escolar</h1>
        <p class="sub">Use o e-mail e a senha cadastrados pela escola.</p>
        <div class="card" style="text-align:left;">
          ${state.loginError ? `<div class="error-msg">${state.loginError}</div>` : ''}
          <div class="field" style="margin-bottom:10px;">
            <label>E-mail</label>
            <input id="login-email" type="email" placeholder="seuemail@exemplo.com">
          </div>
          <div class="field" style="margin-bottom:10px;">
            <label>Senha</label>
            <input id="login-senha" type="password" placeholder="Sua senha">
          </div>
          <div class="btn-row">
            <button class="btn btn-primary" onclick="tentarLogin()" ${state.carregandoLogin ? 'disabled' : ''}>
              ${state.carregandoLogin ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
        <p style="font-size:12.5px; color:var(--muted); margin-top:14px;">
          Seu tipo de acesso (Escola ou Motorista) é identificado automaticamente após o login — ninguém escolhe isso na tela.
        </p>
      </div>
    </div>`;
}

/* ===================== HELPERS ===================== */
function rotaNome(id) { const r = state.rotas.find(function (r) { return r.id === id; }); return r ? r.nome : '—'; }
function motoristaNome(id) { const m = state.motoristas.find(function (m) { return m.id === id; }); return m ? m.nome : '—'; }
function pontoNome(id) { const p = state.pontos.find(function (p) { return p.id === id; }); return p ? p.nome : '—'; }
function pontosDaRota(idRota) { return state.pontos.filter(function (p) { return p.rotaId === idRota; }); }
function alunosDoPonto(idPonto) { return state.alunos.filter(function (a) { return a.pontoId === idPonto; }); }
function registroDoAlunoHoje(alunoId, pontoId) {
  return state.embarquesHoje.find(function (r) { return r.alunoId === alunoId && r.pontoId === pontoId; });
}
function ErrorBox() { return state.formError ? `<div class="error-msg">${state.formError}</div>` : ''; }

/* ===================== ESCOLA — SHELL ===================== */
const ESCOLA_TABS = [
  { key: 'alunos', label: 'Alunos' },
  { key: 'motoristas', label: 'Motoristas' },
  { key: 'rotas', label: 'Rotas' },
  { key: 'pontos', label: 'Pontos de embarque' },
  { key: 'associacao', label: 'Associação' },
];
function EscolaScreen() {
  return `
    <div class="shell">
      <div class="sidebar">
        ${ESCOLA_TABS.map(function (t) {
          return `<button class="${state.escolaTab === t.key ? 'active' : ''}" onclick="setEscolaTab('${t.key}')">${t.label}</button>`;
        }).join('')}
      </div>
      <div class="content">${EscolaTabContent()}</div>
    </div>`;
}
function setEscolaTab(tab) { state.escolaTab = tab; state.formError = null; render(); }
function EscolaTabContent() {
  switch (state.escolaTab) {
    case 'alunos': return TabAlunos();
    case 'motoristas': return TabMotoristas();
    case 'rotas': return TabRotas();
    case 'pontos': return TabPontos();
    case 'associacao': return TabAssociacao();
  }
}

/* ----- RF01: Alunos ----- */
function TabAlunos() {
  const rows = state.alunos.map(function (a) {
    return `
    <tr>
      <td>${a.nome}</td><td>${a.turma || ''}</td>
      <td>${a.rotaId ? rotaNome(a.rotaId) : '<span class="tag tag-muted">sem rota</span>'}</td>
      <td>${a.pontoId ? pontoNome(a.pontoId) : '<span class="tag tag-muted">sem ponto</span>'}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="removerAluno('${a.id}')">Remover</button></td>
    </tr>`;
  }).join('');
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
      ${state.alunos.length ? `<table><tr><th>Nome</th><th>Turma</th><th>Rota</th><th>Ponto</th><th></th></tr>${rows}</table>` : `<div class="empty">Nenhum aluno cadastrado ainda.</div>`}
    </div>`;
}
function salvarAluno() {
  const nome = document.getElementById('al-nome').value.trim();
  const turma = document.getElementById('al-turma').value.trim();
  if (!nome || !turma) { state.formError = 'Preencha nome e turma para continuar.'; render(); return; }
  state.formError = null;
  salvarAlunoFirestore({ nome: nome, turma: turma, rotaId: null, pontoId: null, ativo: true })
    .catch(function (e) { state.formError = 'Erro ao salvar: ' + e.message; render(); });
  render();
}
function removerAluno(id) {
  removerAlunoFirestore(id).catch(function (e) { state.formError = 'Erro ao remover: ' + e.message; render(); });
}

/* ----- RF02: Motoristas ----- */
function TabMotoristas() {
  const rows = state.motoristas.map(function (m) {
    return `
    <tr><td>${m.nome}</td><td>${m.telefone || ''}</td><td>${m.rotaId ? rotaNome(m.rotaId) : '—'}</td>
    <td><button class="btn btn-ghost btn-sm" onclick="removerMotorista('${m.id}')">Remover</button></td></tr>`;
  }).join('');
  return `
    <h2 class="page-title">Motoristas</h2>
    <p class="page-sub">RF02 — Cadastro dos motoristas responsáveis pelas rotas.</p>
    <div class="card">
      <h3>Novo motorista</h3>
      ${ErrorBox()}
      <div class="form-grid">
        <div class="field"><label>Nome completo</label><input id="mo-nome" placeholder="Ex: João Pereira"></div>
        <div class="field"><label>Telefone</label><input id="mo-tel" placeholder="(00) 00000-0000"></div>
      </div>
      <div class="btn-row"><button class="btn btn-primary" onclick="salvarMotorista()">Salvar motorista</button></div>
      <p style="font-size:12px; color:var(--muted); margin-top:10px;">
        Isso salva só os dados do motorista. Para ele conseguir <b>fazer login</b>, crie também o acesso dele em
        Firebase Console → Authentication, e um documento na coleção <b>usuarios</b> (veja PARTE 4 do guia).
      </p>
    </div>
    <div class="card">
      <h3>Motoristas cadastrados (${state.motoristas.length})</h3>
      ${state.motoristas.length ? `<table><tr><th>Nome</th><th>Telefone</th><th>Rota</th><th></th></tr>${rows}</table>` : `<div class="empty">Nenhum motorista cadastrado ainda.</div>`}
    </div>`;
}
function salvarMotorista() {
  const nome = document.getElementById('mo-nome').value.trim();
  const telefone = document.getElementById('mo-tel').value.trim();
  if (!nome || !telefone) { state.formError = 'Preencha nome e telefone.'; render(); return; }
  state.formError = null;
  salvarMotoristaFirestore({ nome: nome, telefone: telefone, rotaId: null, ativo: true })
    .catch(function (e) { state.formError = e.message; render(); });
  render();
}
function removerMotorista(id) {
  removerMotoristaFirestore(id).catch(function (e) { state.formError = e.message; render(); });
}

/* ----- RF03: Rotas ----- */
function TabRotas() {
  const opcoesMotorista = state.motoristas.map(function (m) { return `<option value="${m.id}">${m.nome}</option>`; }).join('');
  const rows = state.rotas.map(function (r) {
    return `
    <tr><td>${r.nome}</td><td>${r.turno || ''}</td><td>${r.motoristaId ? motoristaNome(r.motoristaId) : '—'}</td>
    <td><button class="btn btn-ghost btn-sm" onclick="removerRota('${r.id}')">Remover</button></td></tr>`;
  }).join('');
  return `
    <h2 class="page-title">Rotas</h2>
    <p class="page-sub">RF03 — Cadastro e organização das rotas do transporte escolar.</p>
    <div class="card">
      <h3>Nova rota</h3>
      ${ErrorBox()}
      <div class="form-grid">
        <div class="field"><label>Nome da rota</label><input id="ro-nome" placeholder="Ex: Rota Centro"></div>
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
      ${state.rotas.length ? `<table><tr><th>Rota</th><th>Turno</th><th>Motorista</th><th></th></tr>${rows}</table>` : `<div class="empty">Nenhuma rota cadastrada ainda.</div>`}
    </div>`;
}
function salvarRota() {
  const nome = document.getElementById('ro-nome').value.trim();
  const turno = document.getElementById('ro-turno').value;
  const motoristaId = document.getElementById('ro-motorista').value;
  if (!nome) { state.formError = 'Informe o nome da rota.'; render(); return; }
  if (!motoristaId) { state.formError = 'Cadastre um motorista antes de criar uma rota.'; render(); return; }
  state.formError = null;
  salvarRotaFirestore({ nome: nome, turno: turno, motoristaId: motoristaId, ativa: true })
    .catch(function (e) { state.formError = e.message; render(); });
  render();
}
function removerRota(id) {
  removerRotaFirestore(id).catch(function (e) { state.formError = e.message; render(); });
}

/* ----- RF04: Pontos de embarque ----- */
function TabPontos() {
  const opcoesRota = state.rotas.map(function (r) { return `<option value="${r.id}">${r.nome}</option>`; }).join('');
  const rows = state.pontos.map(function (p) {
    return `
    <tr><td>${p.nome}</td><td>${p.endereco || ''}</td><td>${rotaNome(p.rotaId)}</td>
    <td><button class="btn btn-ghost btn-sm" onclick="removerPonto('${p.id}')">Remover</button></td></tr>`;
  }).join('');
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
      ${state.pontos.length ? `<table><tr><th>Ponto</th><th>Endereço</th><th>Rota</th><th></th></tr>${rows}</table>` : `<div class="empty">Nenhum ponto cadastrado ainda.</div>`}
    </div>`;
}
function salvarPonto() {
  const nome = document.getElementById('pt-nome').value.trim();
  const endereco = document.getElementById('pt-endereco').value.trim();
  const rotaId = document.getElementById('pt-rota').value;
  if (!nome || !endereco) { state.formError = 'Preencha nome e endereço do ponto.'; render(); return; }
  if (!rotaId) { state.formError = 'Cadastre a rota primeiro.'; render(); return; }
  state.formError = null;
  const ordem = pontosDaRota(rotaId).length + 1;
  salvarPontoFirestore({ nome: nome, endereco: endereco, rotaId: rotaId, ordem: ordem })
    .catch(function (e) { state.formError = e.message; render(); });
  render();
}
function removerPonto(id) {
  removerPontoFirestore(id).catch(function (e) { state.formError = e.message; render(); });
}

/* ----- RF05: Associação ----- */
function TabAssociacao() {
  const opcoesAluno = state.alunos.map(function (a) { return `<option value="${a.id}">${a.nome}</option>`; }).join('');
  const rows = state.alunos.map(function (a) {
    return `
    <tr><td>${a.nome}</td>
    <td>${a.rotaId ? rotaNome(a.rotaId) : '<span class="tag tag-stop">não associado</span>'}</td>
    <td>${a.pontoId ? pontoNome(a.pontoId) : '—'}</td></tr>`;
  }).join('');
  return `
    <h2 class="page-title">Associação de alunos</h2>
    <p class="page-sub">RF05 — Associe cada aluno a uma rota e a um ponto de embarque.</p>
    <div class="card">
      <h3>Associar aluno</h3>
      ${ErrorBox()}
      ${!state.alunos.length ? `<div class="error-msg">Cadastre alunos primeiro.</div>` : `
      <div class="form-grid">
        <div class="field"><label>Aluno</label><select id="as-aluno">${opcoesAluno}</select></div>
        <div class="field"><label>Rota</label>
          <select id="as-rota" onchange="atualizarPontosAssociacao()">
            <option value="">Selecione a rota</option>
            ${state.rotas.map(function (r) { return `<option value="${r.id}">${r.nome}</option>`; }).join('')}
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
    </div>`;
}
function atualizarPontosAssociacao() {
  const idRota = document.getElementById('as-rota').value;
  const sel = document.getElementById('as-ponto');
  const pontos = pontosDaRota(idRota);
  sel.innerHTML = pontos.length
    ? pontos.map(function (p) { return `<option value="${p.id}">${p.nome}</option>`; }).join('')
    : '<option value="">Nenhum ponto nessa rota</option>';
}
function salvarAssociacao() {
  const alunoId = document.getElementById('as-aluno').value;
  const rotaId = document.getElementById('as-rota').value;
  const pontoId = document.getElementById('as-ponto').value;
  if (!alunoId || !rotaId || !pontoId) { state.formError = 'Selecione aluno, rota e ponto de embarque válidos.'; render(); return; }
  state.formError = null;
  atualizarAlunoFirestore(alunoId, { rotaId: rotaId, pontoId: pontoId })
    .catch(function (e) { state.formError = e.message; render(); });
  render();
}

/* ===================== MOTORISTA ===================== */
function MotoristaScreen() {
  if (!state.rotaAtual) {
    return `<div class="content"><h2 class="page-title">Carregando sua rota...</h2><p class="page-sub">Se essa mensagem não sumir, confirme se seu usuário está associado a uma rota (documento em "usuarios").</p></div>`;
  }
  if (state.motoristaEtapa === 'rota') return MotoristaRota();
  if (state.motoristaEtapa === 'pontos') return MotoristaPontos();
  if (state.motoristaEtapa === 'alunos') return MotoristaAlunos();
}
function MotoristaRota() {
  const pontos = pontosDaRota(state.rotaId);
  return `
    <div class="content">
      <h2 class="page-title">Sua rota de hoje</h2>
      <p class="page-sub">RF06 — Consulta da rota e dos pontos de embarque.</p>
      <div class="card">
        <h3>${state.rotaAtual.nome} · ${state.rotaAtual.turno || ''}</h3>
        <p style="color:var(--muted); font-size:13.5px; margin-bottom:14px;">${pontos.length} ponto(s) de embarque nesta rota.</p>
        <button class="btn btn-primary" onclick="state.motoristaEtapa='pontos'; render();">Ver pontos de embarque</button>
      </div>
    </div>`;
}
function MotoristaPontos() {
  const pontos = pontosDaRota(state.rotaId).sort(function (a, b) { return (a.ordem || 0) - (b.ordem || 0); });
  const cards = pontos.map(function (p) {
    const alunos = alunosDoPonto(p.id);
    const feitos = alunos.filter(function (a) { return registroDoAlunoHoje(a.id, p.id); }).length;
    const pct = alunos.length ? Math.round((feitos / alunos.length) * 100) : 0;
    return `
      <div class="point-card">
        <h4>${p.nome}</h4><p>${p.endereco || ''}</p>
        <div class="progress-bar"><div style="width:${pct}%"></div></div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:12.5px; color:var(--muted);">${feitos}/${alunos.length} registrados</span>
          <button class="btn btn-primary btn-sm" onclick="abrirPonto('${p.id}')">Ver alunos</button>
        </div>
      </div>`;
  }).join('');
  return `
    <div class="content">
      <div class="breadcrumb"><button onclick="state.motoristaEtapa='rota'; render();">${state.rotaAtual.nome}</button> / Pontos de embarque</div>
      <h2 class="page-title">Pontos de embarque</h2>
      <p class="page-sub">Toque em um ponto para ver os alunos e registrar o embarque.</p>
      <div class="point-grid">${cards || '<div class="empty">Nenhum ponto cadastrado nesta rota.</div>'}</div>
    </div>`;
}
function abrirPonto(id) { state.pontoSelecionado = id; state.motoristaEtapa = 'alunos'; render(); }
function MotoristaAlunos() {
  const ponto = state.pontos.find(function (p) { return p.id === state.pontoSelecionado; });
  const alunos = alunosDoPonto(ponto.id);
  const linhas = alunos.map(function (a) {
    const reg = registroDoAlunoHoje(a.id, ponto.id);
    const status = reg ? reg.status : null;
    return `
      <div class="student-row">
        <div><div class="student-name">${a.nome}</div><div class="student-turma">${a.turma || ''}</div></div>
        <div class="toggle-group">
          <button class="toggle-btn ${status === 'embarcou' ? 'on-go' : ''}" onclick="marcarEmbarque('${a.id}','${ponto.id}','embarcou')">Embarcou</button>
          <button class="toggle-btn ${status === 'nao_embarcou' ? 'on-stop' : ''}" onclick="marcarEmbarque('${a.id}','${ponto.id}','nao_embarcou')">Não embarcou</button>
        </div>
      </div>`;
  }).join('');
  return `
    <div class="content">
      <div class="breadcrumb"><button onclick="state.motoristaEtapa='pontos'; render();">${state.rotaAtual.nome}</button> / ${ponto.nome}</div>
      <h2 class="page-title">${ponto.nome}</h2>
      <p class="page-sub">RF07/RF08 — Alunos do ponto e registro de embarque.</p>
      <div class="card">${alunos.length ? linhas : '<div class="empty">Nenhum aluno associado a este ponto.</div>'}</div>
      <button class="btn btn-ghost" onclick="state.motoristaEtapa='pontos'; render();">Voltar aos pontos</button>
    </div>`;
}
function marcarEmbarque(alunoId, pontoId, status) {
  const aluno = state.alunos.find(function (a) { return a.id === alunoId; });
  registrarEmbarqueFirestore(aluno, { id: pontoId }, state.rotaId, state.motoristaId, status)
    .catch(function (e) { alert('Erro ao registrar: ' + e.message); });
}

/* ===================== APP ROOT ===================== */
function App() {
  let corpo = '';
  if (state.tela === 'login') corpo = LoginScreen();
  else if (state.tela === 'escola') corpo = EscolaScreen();
  else if (state.tela === 'motorista') corpo = `<div class="shell">${MotoristaScreen()}</div>`;
  return `${Topbar()}${corpo}`;
}

render();