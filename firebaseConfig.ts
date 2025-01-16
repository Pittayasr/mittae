// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdX-jnVrYyL3C7f9lOJNy5pxj82XSHPDg",
  authDomain: "mittaremfl-91d81.firebaseapp.com",
  projectId: "mittaremfl-91d81",
  storageBucket: "mittaremfl-91d81.appspot.com",
  messagingSenderId: "828851663297",
  appId: "1:828851663297:web:81291195ef9d544afeff40",
  measurementId: "G-H4578FET55",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
const db = getFirestore(app);

export { app, db };
