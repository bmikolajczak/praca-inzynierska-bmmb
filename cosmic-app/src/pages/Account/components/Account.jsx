import { useState, useEffect } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, arrayRemove, updateDoc, deleteField } from 'firebase/firestore'

import { auth, db } from '../../../infrastructure/firebase/firebase'
import { useDispatch, useSelector } from 'react-redux'

import '../styles/Account.scss'
import styles from '../styles/Account.module.scss'
import { changeUserLoggedIn, showChosenPhoto, setChosenPhoto } from '../../../infrastructure/store/appState'

import { BsFillTrashFill } from 'react-icons/bs'

export function Account() {
  //Saved images
  const [savedImages, setSavedImages] = useState([])
  const [marsScore, setMarsScore] = useState('NOT TAKEN')
  const [vehicleScore, setVehicleScore] = useState('NOT TAKEN')
  const [solarsScore, setSolarScore] = useState('NOT TAKEN')

  //user object retrieved from auth
  const user = auth.currentUser
  //user colelction ref
  const usersRef = collection(db, 'users')

  //user's doc reference with saved images
  const userDocRef = doc(db, 'users', auth.currentUser.uid)

  //Dispatch and selector from redux store
  const dispatch = useDispatch()
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)

  async function deleteScore(score) {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    if (score === 'marsScore') {
      await updateDoc(userRef, {
        marsQuiz: deleteField(),
      })
      setMarsScore('NOT TAKEN')
    }
    if (score === 'solarScore') {
      await updateDoc(userRef, {
        solarQuiz: deleteField(),
      })
      setSolarScore('NOT TAKEN')
    }
    if (score === 'vehicleScore') {
      await updateDoc(userRef, {
        vehicleQuiz: deleteField(),
      })
      setVehicleScore('NOT TAKEN')
    }
  }

  async function GetSavedImages() {
    const userDocSnapshot = await getDoc(userDocRef)
    if (userDocSnapshot.exists()) {
      if (userDocSnapshot.data().savedImages) {
        setSavedImages(userDocSnapshot.data().savedImages)
      } else {
        return
      }
      if (userDocSnapshot.data().marsQuiz) {
        setMarsScore(userDocSnapshot.data().marsQuiz)
      }
      if (userDocSnapshot.data().solarQuiz) {
        setSolarScore(userDocSnapshot.data().solarQuiz)
      }
      if (userDocSnapshot.data().vehicleQuiz) {
        setVehicleScore(userDocSnapshot.data().vehicleQuiz)
      }
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
          <img
            src={
              auth.currentUser.photoURL
                ? auth.currentUser.photoURL
                : 'src/assets/account/images/user_placeholder_image.svg'
            }
            alt="user image"
          />
          <p>{auth.currentUser.displayName}</p>
          <p>{auth.currentUser.email}</p>
        </div>
      ) : (
        <h1>Sign in to your exsisting account or create new one</h1>
      )}
      <div className={styles['saved-images']}>
        <p className={styles['images-header']}>Quiz Scores</p>
        <div className={styles['cards']}>
          <div className={styles['image-card']}>
            <div className={styles['card-visuals']}>
              <h3>Mars Quiz</h3>
              <p className={styles['quiz-score']}>{marsScore}</p>
              <button title="Clear Score" id={styles['remove-btn']} onClick={() => deleteScore('marsScore')}>
                <BsFillTrashFill />
              </button>
            </div>
          </div>
          <div className={styles['image-card']}>
            <div className={styles['card-visuals']}>
              <h3>Solar Quiz</h3>
              <p className={styles['quiz-score']}>{solarsScore}</p>
              <button title="Clear Score" id={styles['remove-btn']} onClick={() => deleteScore('solarScore')}>
                <BsFillTrashFill />
              </button>
            </div>
          </div>
          <div className={styles['image-card']}>
            <div className={styles['card-visuals']}>
              <h3>NASA Missions Quiz</h3>
              <p className={styles['quiz-score']}>{vehicleScore}</p>
              <button title="Clear Score" id={styles['remove-btn']} onClick={() => deleteScore('vehicleScore')}>
                <BsFillTrashFill />
              </button>
            </div>
          </div>
        </div>
      </div>
      {userLoggedIn ? (
        <div className={styles['saved-images']}>
          <p className={styles['images-header']}>Saved Images</p>
          {savedImages.length !== 0 ? (
            <div className={styles['cards']}>
              {savedImages.map((image, index) => (
                <div key={image.title} className={styles['image-card']}>
                  <div className={styles['card-visuals']}>
                    <img
                      onClick={() => updateChosenPic(image)}
                      src={image.url}
                      alt={image.title}
                      className={styles['fetched-photo']}
                    />
                    <p className={styles['image-title']}>{image.title}</p>
                    <button id={styles['remove-btn']} onClick={() => removeImage(image)}>
                      <BsFillTrashFill />
                    </button>
                  </div>
                  <p className={styles['image-desc']}>{image.explanation}</p>
                </div>
              ))}
            </div>
          ) : (
            <h2>You didn't save any images yet</h2>
          )}
        </div>
      ) : null}
    </div>
  )
}
