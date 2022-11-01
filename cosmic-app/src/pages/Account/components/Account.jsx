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
      <div className={styles['profile-tile']}>
        <p className={styles['profile-header']}>Your Profile</p>
        <img
          src="src/assets/account/images/user_placeholder_image.svg"
          alt="placeholder image"
        />
        <p>Alberto</p>
        <p>alberto@gmail.com</p>
      </div>
      <div className={styles['saved-images']}>
        <p className={styles['images-header']}>Saved Images</p>
        <div className={styles['cards']}>
          <div className={styles['image-card']}>
            <div className={styles['card-visuals']}>
              <img
                src="src/assets/account/images/galaxy_photo.png"
                alt="galaxy photo"
              />
              <p className={styles['image-title']}>
                Clouds over andromeda galaxy
              </p>
              <button>Remove image</button>
            </div>
            <p className={styles['image-desc']}>
              What are those red clouds surrounding the Andromeda galaxy? This
              galaxy, M31, is often imaged by planet Earth-based astronomers. As
              the nearest large spiral galaxy, it is a familiar sight with dark
              dust lanes, bright yellowish core, and spiral arms traced by
              clouds of bright blue stars. A mosaic of well-exposed broad and
              narrow-band image data, this deep portrait of our neighboring
              island universe offers strikingly unfamiliar features though,
              faint reddish clouds of glowing ionized hydrogen gas in the same
              wide field of view. Most of the ionized hydrogen clouds surely lie
              in the foreground of the scene, well within our Milky Way Galaxy.
              They are likely associated with the pervasive, dusty interstellar
              cirrus clouds scattered hundreds of light-years above our own
              galactic plane. Some of the clouds, however, occur right in the
              Andromeda galaxy itself, and some in M110, the small galaxy just
              below.
            </p>
          </div>
          <div className={styles['image-card']}>
            <div className={styles['card-visuals']}>
              <img
                src="src/assets/account/images/galaxy_photo.png"
                alt="galaxy photo"
              />
              <p className={styles['image-title']}>
                Clouds over andromeda galaxy
              </p>
              <button>Remove image</button>
            </div>
            <p className={styles['image-desc']}>
              What are those red clouds surrounding the Andromeda galaxy? This
              galaxy, M31, is often imaged by planet Earth-based astronomers. As
              the nearest large spiral galaxy, it is a familiar sight with dark
              dust lanes, bright yellowish core, and spiral arms traced by
              clouds of bright blue stars. A mosaic of well-exposed broad and
              narrow-band image data, this deep portrait of our neighboring
              island universe offers strikingly unfamiliar features though,
              faint reddish clouds of glowing ionized hydrogen gas in the same
              wide field of view. Most of the ionized hydrogen clouds surely lie
              in the foreground of the scene, well within our Milky Way Galaxy.
              They are likely associated with the pervasive, dusty interstellar
              cirrus clouds scattered hundreds of light-years above our own
              galactic plane. Some of the clouds, however, occur right in the
              Andromeda galaxy itself, and some in M110, the small galaxy just
              below.
            </p>
          </div>
        </div>
      </div>
      {isformActive && (
        <div className={styles['account-form']}>
          <div className={styles['welcome-part']}>
            <h3>Welcome</h3>
            <h3>to</h3>
            <h3>Cosmic</h3>
            <img src="src/assets/account/images/Logo.svg" />
            {/* <img
              id={styles['wave-1']}
              src="src/assets/account/images/Wave1.svg"
            />
            <img
              id={styles['wave-2']}
              src="src/assets/account/images/Wave2.svg"
            /> */}
          </div>
          <div className={styles['input-part']}>
            <ul className={styles.tabs}>
              <li
                className={
                  activeTab === 'signin'
                    ? styles['active-tab']
                    : styles['inactive-tab']
                }
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </li>
              <li
                className={
                  activeTab === 'register'
                    ? styles['active-tab']
                    : styles['inactive-tab']
                }
                onClick={() => setActiveTab('register')}
              >
                Sign Up
              </li>
            </ul>
            {activeTab === 'register' && (
              <div className={styles.registerForm}>
                <label for="name">Name</label>
                <input
                  className={styles['input-field']}
                  placeholder="Enter your name"
                  id="name"
                />
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
                  placeholder="Enter your password"
                  id="password"
                  onChange={(event) => {
                    setUserPassword(event.target.value)
                  }}
                />
                <label className={styles['input-field']} for="confirm">
                  Confirm Password
                </label>
                <input
                  className={styles['input-field']}
                  placeholder="Re-enter your password"
                  id="confirm"
                />
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
                />
                <label for="password">Password</label>
                <input
                  className={styles['input-field']}
                  placeholder="Enter your password"
                  id="login-password"
                />
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
        </div>
      )}
    </div>
  )
}
