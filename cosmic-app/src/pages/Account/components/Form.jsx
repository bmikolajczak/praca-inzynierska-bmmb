import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import { collection, setDoc, doc, getDoc } from 'firebase/firestore'

import { auth, db } from '../../../infrastructure/firebase/firebase'

import styles from '../styles/Account.module.scss'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeUserLoggedIn, hideLoginForm } from '../../../infrastructure/store/appState'

import { AiOutlineCloseCircle } from 'react-icons/ai'

export function Form() {
  const [activeTab, setActiveTab] = useState('signin')

  const [name, setName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  //LOGIN
  const [loginEmail, setLoginEmial] = useState('')
  const [loginPassword, setloginPassword] = useState('')

  const [loginErr, setLoginErr] = useState(false)
  const [passErr, setPassErr] = useState(false)
  const [emailErr, setEmailErr] = useState(false)
  const [confirmErr, setConfirmErr] = useState(false)
  const [signupErr, setSignupErr] = useState(false)

  //email regex
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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
      if (signupErr) {
        console.log('incorretly filled up fields')
        return
      } else {
        const user = await createUserWithEmailAndPassword(auth, userEmail, userPassword)
        try {
          const newUserRef = await setDoc(doc(usersRef, user.user.uid), {
            name: name,
            email: userEmail,
          })
          dispatch(hideLoginForm())
        } catch (error) {
          console.log('Problem when creating user:', error)
        }
      }
    } catch (error) {
      console.log('OOh no,', error.message)
    }
  }

  async function loginUser() {
    try {
      setLoginErr(false)
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      dispatch(hideLoginForm())
    } catch (error) {
      setLoginErr(true)
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

      const userDocSnap = getDoc(doc(usersRef, auth.currentUser.uid))
      dispatch(hideLoginForm())
      if (userDocSnap.exists()) {
        console.log('Google user exists')
      } else {
        const newUserRef = await setDoc(doc(usersRef, user.uid), {
          name: user.displayName,
          email: user.email,
        })
      }
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      // const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // console.log('code: ', errorCode, 'message: ', errorMessage, 'credential used: ', credential)
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
              <label htmlFor="name">Name</label>
              <input
                className={styles['input-field']}
                placeholder="Enter your name"
                id="name"
                onChange={(event) => {
                  setName(event.target.value)
                }}
              />
              <label htmlFor="email">Email</label>
              <input
                className={styles['input-field']}
                placeholder="email"
                id="email"
                onChange={(event) => {
                  if (emailRegex.test(event.target.value) || event.target.value === '') {
                    setEmailErr(false)
                    setSignupErr(false)
                  } else {
                    setEmailErr(true)
                    setSignupErr(true)
                  }
                  setUserEmail(event.target.value)
                }}
              />
              {emailErr ? <p style={{ color: 'red', fontSize: 14 }}>Enter correct email!</p> : null}
              <label htmlFor="password">Password</label>
              <input
                className={styles['input-field']}
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={(event) => {
                  if (event.target.value.length < 6 || event.target.value === '') {
                    setPassErr(true)
                    setSignupErr(true)
                  } else {
                    setPassErr(false)
                    setSignupErr(false)
                  }
                  setUserPassword(event.target.value)
                }}
              />
              {passErr ? <p style={{ color: 'red', fontSize: 14 }}>Password is too short!</p> : null}
              <label className={styles['input-field']} htmlFor="confirm">
                Confirm Password
              </label>
              <input
                type="password"
                className={styles['input-field']}
                placeholder="Re-enter your password"
                id="confirm"
                onChange={(event) => {
                  if (event.target.value !== userPassword || event.target.value === '') {
                    setConfirmErr(true)
                    setSignupErr(true)
                  } else {
                    setConfirmErr(false)
                    setSignupErr(false)
                  }
                  setConfirm(event.target.value)
                }}
              />
              {confirmErr ? <p style={{ color: 'red', fontSize: 14 }}>Passwords do not match!</p> : null}
              <button className={styles['button']} onClick={registerUser}>
                Register
              </button>
            </div>
          )}
          {activeTab === 'signin' && (
            <div className={styles.loginForm}>
              <label htmlFor="email">Email</label>
              <input
                className={styles['input-field']}
                placeholder="email"
                id="login-email"
                onChange={(event) => {
                  setLoginEmial(event.target.value)
                }}
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={styles['input-field']}
                placeholder="Enter your password"
                id="login-password"
                onChange={(event) => {
                  setloginPassword(event.target.value)
                }}
              />
              {loginErr ? <p style={{ color: 'red', fontSize: 14 }}>Email or password is/are incorrect!</p> : null}
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
