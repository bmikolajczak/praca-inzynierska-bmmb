import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { collection, setDoc, doc } from 'firebase/firestore'

import { auth, db } from '../../../infrastructure/firebase/firebase'

import styles from '../styles/Account.module.scss'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeUserLoggedIn, hideLoginForm, setActiveUser } from '../../../infrastructure/store/appState'

import { AiOutlineCloseCircle } from 'react-icons/ai'

export function Form() {
  const [activeTab, setActiveTab] = useState('signin')

  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  //LOGIN
  const [loginEmail, setLoginEmial] = useState('')
  const [loginPassword, setloginPassword] = useState('')

  const user = auth.currentUser

  //user colelction ref
  const usersRef = collection(db, 'users')

  //const Google provider
  const googleProvider = new GoogleAuthProvider()

  //ref to redux state and dispatch
  const formVisible = useSelector((state) => state.app.loginFormShown)
  const activeUser = useSelector((state) => state.app.currentUser)
  const dispatch = useDispatch()

  async function registerUser() {
    try {
      const user = await createUserWithEmailAndPassword(auth, userEmail, userPassword)
      console.log(user.user.uid)
      try {
        const newUserRef = await setDoc(doc(usersRef, user.user.uid), {
          name: 'John',
          surname: 'Doe',
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
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      console.log('user: ', user.user)
      dispatch(changeUserLoggedIn())
      dispatch(hideLoginForm())
    } catch (error) {
      console.log('something went wrong when logging you in', error.message)
    }
  }

  async function signInGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      //info about signd in user
      const user = result.user
      // dispatch(setActiveUser(user))

      const newUserRef = await setDoc(doc(usersRef, user.uid), {
        name: user.displayName,
        email: user.email,
      })
      console.log('new google user:', newUserRef)
      console.log('user in REDUX', activeUser)
      dispatch(hideLoginForm())
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log('code: ', errorCode, 'message: ', errorMessage, 'email: ', email, 'credential used: ', credential)
    }
  }

  useEffect(() => {}, [user])
  return (
    formVisible && (
      <div className={styles['account-form']}>
        <div className={styles['welcome-part']}>
          <h3>Welcome</h3>
          <h3>to</h3>
          <h3>Cosmic</h3>
          <img src="src/assets/account/images/Logo.svg" />
        </div>
        <div className={styles['input-part']}>
          <button id={styles['close']} onClick={() => dispatch(hideLoginForm())}>
            <AiOutlineCloseCircle />
          </button>
          <ul className={styles.tabs}>
            <li
              className={activeTab === 'signin' ? styles['active-tab'] : styles['inactive-tab']}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </li>
            <li
              className={activeTab === 'register' ? styles['active-tab'] : styles['inactive-tab']}
              onClick={() => setActiveTab('register')}
            >
              Sign Up
            </li>
          </ul>
          {activeTab === 'register' && (
            <div className={styles.registerForm}>
              <label for="name">Name</label>
              <input className={styles['input-field']} placeholder="Enter your name" id="name" />
              <label for="email">Email</label>
              <input
                className={styles['input-field']}
                placeholder="email"
                id="email"
                onChange={(event) => {
                  setUserEmail(event.target.value)
                }}
              />
              <label for="password">Password</label>
              <input
                className={styles['input-field']}
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={(event) => {
                  setUserPassword(event.target.value)
                }}
              />
              <label className={styles['input-field']} for="confirm">
                Confirm Password
              </label>
              <input className={styles['input-field']} placeholder="Re-enter your password" id="confirm" />
              <button className={styles['button']} onClick={registerUser}>
                Register
              </button>
            </div>
          )}
          {activeTab === 'signin' && (
            <div className={styles.loginForm}>
              <label for="email">Email</label>
              <input
                className={styles['input-field']}
                placeholder="email"
                id="login-email"
                onChange={(event) => {
                  setLoginEmial(event.target.value)
                }}
              />
              <label for="password">Password</label>
              <input
                className={styles['input-field']}
                placeholder="Enter your password"
                id="login-password"
                onChange={(event) => {
                  setloginPassword(event.target.value)
                }}
              />
              <button className={styles.button} onClick={loginUser}>
                Sign In
              </button>
            </div>
          )}
          <button className={styles.button} id={styles['google-button']} onClick={signInGoogle}>
            <img height={16} src="src/assets/google-logo.png" />
            Sign In with Google
          </button>
        </div>
      </div>
    )
  )
}
