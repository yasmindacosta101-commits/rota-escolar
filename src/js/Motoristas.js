/*
  js/motoristas.js
  ------------------------------------------------------------
  Todas as funções que leem ou gravam a coleção "motoristas".

  Atenção: isto guarda só os DADOS do motorista (nome, telefone).
  Para o motorista conseguir fazer login, é preciso, além disso,
  criar um usuário em Authentication e um documento na coleção
  "usuarios"
*/

function salvarMotoristaFirestore(dados) {
  // dados: { nome, telefone, rotaId, ativo }
  return db.collection('motoristas').add(dados);
}

function atualizarMotoristaFirestore(id, dados) {
  return db.collection('motoristas').doc(id).update(dados);
}

function removerMotoristaFirestore(id) {
  return db.collection('motoristas').doc(id).delete();
}

function ouvirMotoristas(callback) {
  return db.collection('motoristas').onSnapshot(function (snapshot) {
    const lista = [];
    snapshot.forEach(function (doc) {
      lista.push(Object.assign({ id: doc.id }, doc.data()));
    });
    callback(lista);
  });
}