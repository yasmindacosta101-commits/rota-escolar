/*
  js/alunos.js
  ------------------------------------------------------------
  Leitura/gravação da coleção "alunos". Toda função "ouvir..."
  aceita um callback de sucesso e, opcionalmente, um de erro —
  se um listener falhar (ex: regra de segurança bloqueando),
  o erro é avisado em vez de travar a tela em silêncio.
*/

function salvarAlunoFirestore(dados) {
  return db.collection('alunos').add(dados);
}

function atualizarAlunoFirestore(id, dados) {
  return db.collection('alunos').doc(id).update(dados);
}

function removerAlunoFirestore(id) {
  return db.collection('alunos').doc(id).delete();
}

function ouvirAlunos(aoAtualizar, rotaId, aoErro) {
  let referencia = db.collection('alunos');
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