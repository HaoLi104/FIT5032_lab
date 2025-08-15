
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyDLVqDHTILSuFYhVtprCcKYwpgkru2EMgc",
  authDomain: "haoli-25523077.firebaseapp.com",
  projectId: "haoli-25523077",
  storageBucket: "haoli-25523077.firebasestorage.app",
  messagingSenderId: "204924463139",
  appId: "1:204924463139:web:f354627fb7a1d9438b6996"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);

export default db;