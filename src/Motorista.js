/*
  js/motoristas.js
  ------------------------------------------------------------
  Leitura/gravação da coleção "motoristas".
*/

function salvarMotoristaFirestore(dados) {
  return db.collection('motoristas').add(dados);
}

function atualizarMotoristaFirestore(id, dados) {
  return db.collection('motoristas').doc(id).update(dados);
}

function removerMotoristaFirestore(id) {
  return db.collection('motoristas').doc(id).delete();
}

function ouvirMotoristas(aoAtualizar, aoErro) {
  return db.collection('motoristas').onSnapshot(
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