/*
  js/login.js
  ------------------------------------------------------------
  Login/logout com Firebase Authentication + descoberta do
  papel (escola/motorista) na coleção "usuarios".
*/

function fazerLogin(email, senha, aoSucesso, aoErro) {
  auth.signInWithEmailAndPassword(email, senha)
    .then(function (credencial) {
      return db.collection('usuarios').doc(credencial.user.uid).get();
    })
    .then(function (doc) {
      if (!doc.exists) {
        auth.signOut();
        aoErro('Este login não tem um perfil configurado na coleção "usuarios". Fale com a escola.');
        return;
      }
      const dados = doc.data();
      if (dados.papel !== 'escola' && dados.papel !== 'motorista') {
        auth.signOut();
        aoErro('O campo "papel" do usuário está ausente ou inválido (use exatamente "escola" ou "motorista").');
        return;
      }
      if (dados.papel === 'motorista' && !dados.rotaId) {
        auth.signOut();
        aoErro('Este motorista não tem "rotaId" configurado em "usuarios". Associe-o a uma rota.');
        return;
      }
      aoSucesso(dados);
    })
    .catch(function (erro) {
      aoErro(traduzErroFirebase(erro));
    });
}

function fazerLogout() {
  auth.signOut();
}

function traduzErroFirebase(erro) {
  const codigo = erro.code || '';
  if (codigo.includes('user-not-found') || codigo.includes('invalid-credential')) return 'E-mail ou senha incorretos.';
  if (codigo.includes('wrong-password')) return 'E-mail ou senha incorretos.';
  if (codigo.includes('invalid-email')) return 'Digite um e-mail válido.';
  if (codigo.includes('too-many-requests')) return 'Muitas tentativas seguidas. Aguarde um momento e tente de novo.';
  if (codigo.includes('network')) return 'Falha de conexão. Verifique sua internet.';
  if (codigo.includes('permission-denied')) return 'Sem permissão para acessar os dados (confira as regras do Firestore).';
  return 'Não foi possível entrar (' + (erro.message || 'erro desconhecido') + ').';
}