import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { collection, setDoc, doc } from 'firebase/firestore'

import { auth, db } from '../../../infrastructure/firebase/firebase'
import '../styles/Account.scss'
import styles from '../styles/Account.module.scss'

export function Account() {
  const [activeTab, setActiveTab] = useState('signin')
  const [isformActive, setFormActive] = useState(false)

  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  //LOGIN
  const [loginEmail, setLoginEmial] = useState('')
  const [loginPassword, setloginPassword] = useState('')

  //user colelction ref
  const usersRef = collection(db, 'users')

  //const Google provider
  const googleProvider = new GoogleAuthProvider()

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
        const newUserRef = await setDoc(doc(usersRef, user.user.uid), {
          name: 'Testy',
          surname: 'Smith',
          email: userEmail,
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

  async function signInGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      //info about signd in user
      const user = result.user
      const newUserRef = await setDoc(doc(usersRef, user.uid), {
        name: user.displayName,
        email: user.email,
      })
      console.log(newUserRef)
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log(
        'code: ',
        errorCode,
        'message: ',
        errorMessage,
        'email: ',
        email,
        'credential used: ',
        credential
      )
    }
  }

  async function signoutUser() {
    try {
      signOut(auth)
      console.log('user is signed out')
    } catch (error) {
      console.log('error', error.message)
    }
  }

  return (
    <div>
      {/* <h1>Welcome to user account page!</h1> */}
      {/* <p className="welcome">welcome to account page</p> */}
      {auth.currentUser && <h3>{auth.currentUser.displayName}</h3>}
      <button onClick={signoutUser}>Sign Out</button>
      <button onClick={() => setFormActive(!isformActive)}>Toggle Form</button>

      {isformActive && (
        <div className={styles['account-form']}>
          <ul className={styles.tabs}>
            <li
              className={
                activeTab === 'signin'
                  ? styles['active-tab']
                  : styles['inactive-tab']
              }
              onClick={() => setActiveTab('signin')}
            >
              sign in
            </li>
            <li
              className={
                activeTab === 'register'
                  ? styles['active-tab']
                  : styles['inactive-tab']
              }
              onClick={() => setActiveTab('register')}
            >
              register
            </li>
          </ul>

          {activeTab === 'register' && (
            <div className={styles.registerForm}>
              <label for="name">Name</label>
              <input placeholder="Enter your name" id="name" />
              <label for="email">Email</label>
              <input
                placeholder="email"
                id="email"
                onChange={(event) => {
                  setUserEmail(event.target.value)
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
              <label for="confirm">Confirm Password</label>
              <input placeholder="Re-enter your password" id="confirm" />
              <button onClick={registerUser}>Register</button>
            </div>
          )}
          {activeTab === 'signin' && (
            <div className={styles.loginForm}>
              <label for="email">Email</label>
              <input placeholder="email" id="login-email" />
              <label for="password">Password</label>
              <input placeholder="Enter your password" id="login-password" />
              <button className={styles.button} onClick={loginUser}>
                Sign In
              </button>
            </div>
          )}
          <button
            className={styles.button}
            id={styles['google-button']}
            onClick={signInGoogle}
          >
            <img height={16} src="src/assets/google-logo.png" />
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  )
}
