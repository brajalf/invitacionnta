import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (pública - es segura)
const firebaseConfig = {
  apiKey: "AIzaSyB8XmQ9ZNJnE-6_-YjYJ8KGbX2XR5L-0nQ",
  authDomain: "invitacion-especial-nta.firebaseapp.com",
  projectId: "invitacion-especial-nta",
  storageBucket: "invitacion-especial-nta.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh5678ijklmn",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);
