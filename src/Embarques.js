/*
  js/embarques.js
  ------------------------------------------------------------
  Registra embarque/não embarque. Usa um ID PREVISÍVEL
  (alunoId_pontoId_data) em vez de .add(), para que clicar duas
  vezes só sobrescreva o mesmo registro, sem duplicar.
*/

function dataDeHojeISO() {
  return new Date().toISOString().slice(0, 10); // "2026-09-16"
}

function registrarEmbarqueFirestore(aluno, ponto, rotaId, motoristaId, status) {
  const idRegistro = aluno.id + '_' + ponto.id + '_' + dataDeHojeISO();
  return db.collection('embarques').doc(idRegistro).set({
    alunoId: aluno.id,
    motoristaId: motoristaId,
    rotaId: rotaId,
    pontoId: ponto.id,
    data: dataDeHojeISO(),
    dataHora: firebase.firestore.FieldValue.serverTimestamp(),
    status: status
  });
}

function ouvirEmbarquesDoDia(rotaId, aoAtualizar, aoErro) {
  return db.collection('embarques')
    .where('rotaId', '==', rotaId)
    .where('data', '==', dataDeHojeISO())
    .onSnapshot(
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