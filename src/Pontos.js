/*
  js/pontos.js
  ------------------------------------------------------------
  Leitura/gravação da coleção "pontos".
*/

function salvarPontoFirestore(dados) {
  return db.collection('pontos').add(dados);
}

function removerPontoFirestore(id) {
  return db.collection('pontos').doc(id).delete();
}

function ouvirPontos(aoAtualizar, rotaId, aoErro) {
  let referencia = db.collection('pontos');
  if (rotaId) {
    referencia = referencia.where('rotaId', '==', rotaId);
  }
  return referencia.onSnapshot(
    function (snapshot) {
      const lista = [];
      snapshot.forEach(function (doc) {
        lista.push(Object.assign({ id: doc.id }, doc.data()));
      });
      aoAtualizar(lista);
    },
    function (erro) {
      if (aoErro) aoErro(erro);
    }
  );
}