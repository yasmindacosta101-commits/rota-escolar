
const firebaseConfig = {
  apiKey: "AIzaSyDGsYq6krWVvi-rixAhOk5S7DGf2ATx6ZE",
  authDomain: "rota-escolar-ff3bf.firebaseapp.com",
  projectId: "rota-escolar-ff3bf",
  storageBucket: "rota-escolar-ff3bf.firebasestorage.app",
  messagingSenderId: "710330160200",
  appId: "1:710330160200:web:eda0d48e9d1134a39e747d"
};

firebase.initializeApp(firebaseConfig);

// Essas duas variáveis ficam disponíveis para TODOS os outros arquivos JS
// (porque todos são carregados na mesma página, sem "import").
const db = firebase.firestore();
const auth = firebase.auth();