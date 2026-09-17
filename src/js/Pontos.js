/*
  js/pontos.js
  ------------------------------------------------------------
  Todas as funções que leem ou gravam a coleção "pontos".
*/

function salvarPontoFirestore(dados) {
  // dados: { nome, endereco, rotaId, ordem }
  return db.collection('pontos').add(dados);
}

function removerPontoFirestore(id) {
  return db.collection('pontos').doc(id).delete();
}

// rotaId é opcional: o motorista só pode ler os pontos da própria rota,
// então, para ele, sempre passamos o rotaId para filtrar a consulta.
function ouvirPontos(callback, rotaId) {
  let referencia = db.collection('pontos');
  if (rotaId) {
    referencia = referencia.where('rotaId', '==', rotaId);
  }
  return referencia.onSnapshot(function (snapshot) {
    const lista = [];
    snapshot.forEach(function (doc) {
      lista.push(Object.assign({ id: doc.id }, doc.data()));
    });
    callback(lista);
  });
}