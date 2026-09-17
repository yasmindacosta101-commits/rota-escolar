/*
  js/login.js
  ------------------------------------------------------------
  Cuida do login/logout usando Firebase Authentication e
  descobre se quem entrou é "escola" ou "motorista" consultando
  a coleção "usuarios" no Firestore (o documento tem o MESMO id
  do usuário autenticado).
  
*/

function fazerLogin(email, senha, aoSucesso, aoErro) {
  auth.signInWithEmailAndPassword(email, senha)
    .then(function (credencial) {
      return db.collection('usuarios').doc(credencial.user.uid).get();
    })
    .then(function (doc) {
      if (!doc.exists) {
        auth.signOut();
        aoErro('Este usuário não tem um perfil configurado. Fale com a escola.');
        return;
      }
      aoSucesso(doc.data()); // { papel: 'escola' } ou { papel: 'motorista', motoristaId, rotaId }
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
  if (codigo.includes('too-many-requests')) return 'Muitas tentativas seguidas. Aguarde um momento e tente de novo.';
  if (codigo.includes('network')) return 'Falha de conexão. Verifique sua internet.';
  return 'Não foi possível entrar. Tente novamente.';
}