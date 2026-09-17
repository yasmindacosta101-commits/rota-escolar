/*
  js/embarques.js
  ------------------------------------------------------------
  Registra se um aluno embarcou ou não, e evita registros
  duplicados quando o motorista toca duas vezes no botão.

  COMO EVITAMOS DUPLICIDADE (PARTE 26 do pedido):
  Em vez de criar um documento novo a cada clique (.add()),
  usamos um ID PREVISÍVEL para o documento:
      alunoId + "_" + pontoId + "_" + dataDeHoje
  e usamos .set() em vez de .add(). Assim, se o motorista clicar
  duas vezes, o segundo clique só SOBRESCREVE o mesmo documento
  em vez de criar um segundo registro. Não precisa de nenhuma
  lógica extra de "verificar se já existe".
*/

function dataDeHojeISO() {
  return new Date().toISOString().slice(0, 10); // ex: "2026-09-14"
}

function registrarEmbarqueFirestore(aluno, ponto, rotaId, motoristaId, status) {
  // status: "embarcou" ou "nao_embarcou"
  const idRegistro = aluno.id + '_' + ponto.id + '_' + dataDeHojeISO();

  return db.collection('embarques').doc(idRegistro).set({
    alunoId: aluno.id,
    motoristaId: motoristaId,
    rotaId: rotaId,
    pontoId: ponto.id,
    data: dataDeHojeISO(),
    // FieldValue.serverTimestamp() usa o relógio do SERVIDOR do Firebase,
    // não o do celular/computador do motorista — evita registros com
    // hora errada caso o aparelho esteja com a data/hora desconfigurada.
    dataHora: firebase.firestore.FieldValue.serverTimestamp(),
    status: status
  });
}

// Traz os embarques de HOJE de uma rota específica (usado para saber,
// na tela do motorista, quem já foi marcado como embarcou ou não).
function ouvirEmbarquesDoDia(rotaId, callback) {
  return db.collection('embarques')
    .where('rotaId', '==', rotaId)
    .where('data', '==', dataDeHojeISO())
    .onSnapshot(function (snapshot) {
      const lista = [];
      snapshot.forEach(function (doc) {
        lista.push(Object.assign({ id: doc.id }, doc.data()));
      });
      callback(lista);
    });
}