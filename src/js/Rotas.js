/*
  js/rotas.js
  ------------------------------------------------------------
  Todas as funções que leem ou gravam a coleção "rotas".
*/

function salvarRotaFirestore(dados) {
  // dados: { nome, turno, motoristaId, ativa }
  return db.collection('rotas').add(dados);
}

function atualizarRotaFirestore(id, dados) {
  return db.collection('rotas').doc(id).update(dados);
}

function removerRotaFirestore(id) {
  return db.collection('rotas').doc(id).delete();
}

// Usado pela Escola: traz TODAS as rotas.
function ouvirRotas(callback) {
  return db.collection('rotas').onSnapshot(function (snapshot) {
    const lista = [];
    snapshot.forEach(function (doc) {
      lista.push(Object.assign({ id: doc.id }, doc.data()));
    });
    callback(lista);
  });
}

// Usado pelo Motorista: busca só a rota dele (por id), nunca a lista inteira,
// porque as regras de segurança não deixam o motorista listar todas as rotas.
function buscarRotaPorId(id, callback) {
  return db.collection('rotas').doc(id).onSnapshot(function (doc) {
    callback(doc.exists ? Object.assign({ id: doc.id }, doc.data()) : null);
  });
}