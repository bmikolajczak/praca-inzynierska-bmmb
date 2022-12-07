import React from 'react'
import { useSelector } from 'react-redux'

import { AiOutlineCloseCircle } from 'react-icons/ai'

import { useDispatch } from 'react-redux'
import { hideChosenPhoto } from '../../../infrastructure/store/appState'

import { updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../../../infrastructure/firebase/firebase'

export function ApodModal() {
  const dispatch = useDispatch()
  const chosenPhoto = useSelector((state) => state.app.chosenPhoto)

  const currentUserRef = doc(db, 'users', auth.currentUser.uid)
  async function saveToProfile() {
    await updateDoc(currentUserRef, { savedImages: arrayUnion({ ...chosenPhoto }) })
    alert('You saved an image.')
  }
  return (
    <div>
      <button onClick={() => dispatch(hideChosenPhoto())}>
        <AiOutlineCloseCircle />
      </button>
      <div>
        <div>
          <img src={chosenPhoto.url} />
        </div>
        <div>
          <h1>{chosenPhoto.title}</h1>
          <p>{chosenPhoto.explanation}</p>
          <p>{chosenPhoto.copyright}</p>
          <button onClick={saveToProfile}>Save to Your Gallery</button>
        </div>
      </div>
    </div>
  )
}
