/*
  js/firebase.js
  ------------------------------------------------------------
  Conecta o projeto ao Firebase. Cole aqui os valores do SEU
  projeto (Firebase Console > ⚙️ Configurações do projeto >
  "Seus aplicativos" > app Web > SDK setup and configuration > Config).
*/

const firebaseConfig = {
 apiKey: "AIzaSyDGsYq6krWVvi-rixAhOk5S7DGf2ATx6ZE",
  authDomain: "rota-escolar-ff3bf.firebaseapp.com",
  projectId: "rota-escolar-ff3bf",
  storageBucket: "rota-escolar-ff3bf.firebasestorage.app",
  messagingSenderId: "710330160200",
  AppId: "1:710330160200:web:eda0d48e9d1134a39e747d",
  measurementId: "G-BTSQSDGQF9"
};

firebase.initializeApp(firebaseConfig);

// Ficam disponíveis para todos os outros arquivos JS (mesma página, sem "import").
const db = firebase.firestore();
const auth = firebase.auth();