import { useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { collection, setDoc, doc, getDoc, arrayRemove, updateDoc } from 'firebase/firestore'

import { auth, db } from '../../../infrastructure/firebase/firebase'
import { useDispatch, useSelector } from 'react-redux'

import '../styles/Account.scss'
import styles from '../styles/Account.module.scss'
import { changeUserLoggedIn, showChosenPhoto, setChosenPhoto } from '../../../infrastructure/store/appState'

export function Account() {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')

  //Saved images
  const [savedImages, setSavedImages] = useState([])

  //user object retrieved from auth
  const user = auth.currentUser
  //user colelction ref
  const usersRef = collection(db, 'users')

  //user's doc reference with saved images
  const userDocRef = doc(db, 'users', auth.currentUser.uid)

  //Dispatch and selector from redux store
  const dispatch = useDispatch()
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)

  async function GetSavedImages() {
    const userDocSnapshot = await getDoc(userDocRef)
    if (userDocSnapshot.exists()) {
      setSavedImages(userDocSnapshot.data().savedImages)
    }
  }
  //CHECKING WETHER USER IS LOGGED IN
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('Current User: ', user)
    } else {
      console.log('user signed out')
    }
  })
  useEffect(() => {
    GetSavedImages()
  }, [user])
  //

  async function signoutUser() {
    try {
      await signOut(auth)
      dispatch(changeUserLoggedIn())
      alert('user is signed out', userLoggedIn)
      window.location.href = '/about'
    } catch (error) {
      console.log('something went wrong', error.message)
    }
  }

  async function removeImage(image) {
    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, { savedImages: arrayRemove(image) })
    //remove image from array
    setSavedImages(savedImages.filter((savedImg) => savedImg.title !== image.title))
    console.log('new seved images:', savedImages)
  }

  //chosen pic in store
  function updateChosenPic(image) {
    dispatch(setChosenPhoto(image))
    dispatch(showChosenPhoto())
  }

  return (
    <div>
      {/* <button onClick={signoutUser}>Sign Out</button> */}
      {/* <button onClick={() => setFormActive(!isformActive)}>Toggle Form</button> */}
      {userLoggedIn ? (
        <div className={styles['profile-tile']}>
          <p className={styles['profile-header']}>Your Profile</p>
          <img src={auth.currentUser.photoURL} alt="placeholder image" />
          <p>{auth.currentUser.displayName}</p>
          <p>{auth.currentUser.email}</p>
        </div>
      ) : (
        <h1>Sign in to your exsisting account or create new one</h1>
      )}
      {userLoggedIn ? (
        <div className={styles['saved-images']}>
          <p className={styles['images-header']}>Saved Images</p>
          <div className={styles['cards']}>
            {savedImages.map((image, index) => (
              <div className={styles['image-card']}>
                <div className={styles['card-visuals']}>
                  <img
                    onClick={() => updateChosenPic(image)}
                    src={image.url}
                    alt={image.title}
                    className={styles['fetched-photo']}
                  />
                  <p className={styles['image-title']}>{image.title}</p>
                  <button id={styles['remove-btn']} onClick={() => removeImage(image)}>
                    Remove image
                  </button>
                </div>
                <p className={styles['image-desc']}>{image.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

// async function loginUser() {
//   try {
//     const user = await signInWithEmailAndPassword(
//       auth,
//       loginEmail,
//       loginPassword
//     )
//     console.log('user: ', user.user)
//   } catch (error) {
//     console.log(error.message)
//   }
// }

// async function signInGoogle() {
//   try {
//     const result = await signInWithPopup(auth, googleProvider)
//     const credential = GoogleAuthProvider.credentialFromResult(result)
//     const token = credential.accessToken
//     //info about signd in user
//     const user = result.user
//     const newUserRef = await setDoc(doc(usersRef, user.uid), {
//       name: user.displayName,
//       email: user.email,
//     })
//     console.log(newUserRef)
//   } catch (error) {
//     const errorCode = error.code
//     const errorMessage = error.message
//     // The email of the user's account used.
//     const email = error.customData.email
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error)
//     console.log(
//       'code: ',
//       errorCode,
//       'message: ',
//       errorMessage,
//       'email: ',
//       email,
//       'credential used: ',
//       credential
//     )
//   }
// }

//async function registerUser() {
//   try {
//     const user = await createUserWithEmailAndPassword(auth, userEmail, userPassword)
//     console.log(user.user.uid)
//     try {
//       const newUserRef = await setDoc(doc(usersRef, user.user.uid), {
//         name: 'Testy',
//         surname: 'Smith',
//         email: userEmail,
//       })
//       console.log('New document with user info: ', newUserRef)
//     } catch (error) {
//       console.log('Problem when creating user:', error)
//     }
//   } catch (error) {
//     console.log('OOh no,', error.message)
//   }
// }
