// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "my-blog-9892f.firebaseapp.com",
  projectId: "my-blog-9892f",
  storageBucket: "my-blog-9892f.appspot.com",
  messagingSenderId: "94055870724",
  appId: "1:94055870724:web:4d7398c6a82336e70da051",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
