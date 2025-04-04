import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBP2FFXmpveyEL-HxqF5X4MVaSRcDrPO7k',
  authDomain: 'cosmic-b39fe.firebaseapp.com',
  projectId: 'cosmic-b39fe',
  storageBucket: 'cosmic-b39fe.appspot.com',
  messagingSenderId: '464188872675',
  appId: '1:464188872675:web:5ec807728d8d12083ef2d6',
}

// Initializing Firebase
const app = initializeApp(firebaseConfig)

//referencing services in obejcts
export const auth = getAuth(app)
export const db = getFirestore(app)
