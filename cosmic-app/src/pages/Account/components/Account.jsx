import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { addDoc, collection, getDoc } from 'firebase/firestore'

import { auth, db } from '../../../infrastructure/firebase/firebase'
import '../styles/Account.scss'
import styles from '../styles/Account.module.scss'

export function Account() {
  // const [activeTab, setActiveTab] = useState('signin')

  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  //LOGIN
  const [loginEmail, setLoginEmial] = useState('')
  const [loginPassword, setloginPassword] = useState('')

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Current User: ', user)
    } else {
      console.log('user signed out')
    }
  })

  async function registerUser() {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      )
      console.log(user.user.uid)
      try {
        const newUserRef = await addDoc(collection(db, 'users'), {
          id: user.user.uid,
          email: user.user.email,
        })
        console.log('New document with user info: ', newUserRef)
      } catch (error) {
        console.log('Problem when creating user:', error)
      }
    } catch (error) {
      console.log('OOh no,', error.message)
    }
  }

  async function loginUser() {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      )
      console.log('user: ', user.user)
    } catch (error) {
      console.log(error.message)
    }
  }

  async function signoutUser() {
    try {
      signOut(auth)
      console.log('user signed out')
    } catch (error) {
      console.log('error', error.message)
    }
  }

  return (
    <div>
      <h1>Welcome to user account page!</h1>
      <p className="welcome">welcome to account page</p>

      <ul className={styles.tabs}>
        <li onClick={() => setActiveTab('signin')}>sign in</li>
        <li onClick={() => setActiveTab('register')}>register</li>
      </ul>

      <div className={styles.registerForm}>
        {/* <label for="name">Name</label>
          <input placeholder="Enter your name" id="name" /> */}

        <label for="email">Email</label>
        <input
          placeholder="email"
          id="email"
          onChange={(event) => {
            setUserEmail(event.target.value)
            console.log(userEmail)
          }}
        />

        <label for="password">Password</label>
        <input
          placeholder="Enter your password"
          id="password"
          onChange={(event) => {
            setUserPassword(event.target.value)
          }}
        />

        {/* <label for="confirm">Confirm Password</label>
          <input placeholder="Re-enter your password" id="confirm" /> */}
        <button onClick={registerUser}>Register</button>
      </div>

      <div className={styles.loginForm}>
        <label for="email">Email</label>
        <input placeholder="email" id="login-email" />

        <label for="password">Password</label>
        <input placeholder="Enter your password" id="login-password" />

        <button onClick={loginUser}>Sign In</button>
        <button onClick={signoutUser}>Sign Out</button>
      </div>
    </div>
  )
}
