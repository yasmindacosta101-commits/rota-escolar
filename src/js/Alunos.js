/*
  js/alunos.js
  ------------------------------------------------------------
  Todas as funções que leem ou gravam a coleção "alunos".
*/

function salvarAlunoFirestore(dados) {
  // dados: { nome, turma, rotaId, pontoId, ativo }
  return db.collection('alunos').add(dados);
}

function atualizarAlunoFirestore(id, dados) {
  return db.collection('alunos').doc(id).update(dados);
}

function removerAlunoFirestore(id) {
  return db.collection('alunos').doc(id).delete();
}

// Fica "escutando" a lista de alunos e chama callback(lista) toda vez que algo mudar.
// rotaId é opcional: quando informado, só traz os alunos daquela rota
// (usado pelo motorista, que só pode ler os alunos da própria rota).
function ouvirAlunos(callback, rotaId) {
  let referencia = db.collection('alunos');
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