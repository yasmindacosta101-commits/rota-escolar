/*
  js/rotas.js
  ------------------------------------------------------------
  Leitura/gravação da coleção "rotas".
*/

function salvarRotaFirestore(dados) {
  return db.collection('rotas').add(dados);
}

function atualizarRotaFirestore(id, dados) {
  return db.collection('rotas').doc(id).update(dados);
}

function removerRotaFirestore(id) {
  return db.collection('rotas').doc(id).delete();
}

// Usado pela Escola: traz TODAS as rotas.
function ouvirRotas(aoAtualizar, aoErro) {
  return db.collection('rotas').onSnapshot(
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

// Usado pelo Motorista: busca só a própria rota, por ID.
function buscarRotaPorId(id, aoAtualizar, aoErro) {
  return db.collection('rotas').doc(id).onSnapshot(
    function (doc) {

      if (!doc.exists) {
        if (aoErro) {
          aoErro({
            code: 'rota-not-found',
            message: 'A rota não foi encontrada. O site recebeu este rotaId: "' + id + '"'
          });
        }
        return;
      }

      aoAtualizar(
        Object.assign(
          { id: doc.id },
          doc.data()
        )
      );
    },
    function (erro) {
      if (aoErro) aoErro(erro);
    }
  );
}