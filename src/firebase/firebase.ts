import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB-1cNPldp9JmlD-yTb4CqR5OGfFkIUXzg',
  authDomain: 'ntwitter-reloaded-aeb1a.firebaseapp.com',
  projectId: 'ntwitter-reloaded-aeb1a',
  storageBucket: 'ntwitter-reloaded-aeb1a.appspot.com',
  messagingSenderId: '958966798269',
  appId: '1:958966798269:web:23f4f0cad0421ed72e24d4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
