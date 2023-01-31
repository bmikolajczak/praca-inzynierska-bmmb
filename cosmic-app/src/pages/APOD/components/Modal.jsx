import React from 'react'
import { useSelector } from 'react-redux'

import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BsFillPlusCircleFill } from 'react-icons/bs'

import { useDispatch } from 'react-redux'
import { hideChosenPhoto } from '../../../infrastructure/store/appState'

import { updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../../../infrastructure/firebase/firebase'

import styles from '../styles/Modal.module.scss'

export function ApodModal() {
  const dispatch = useDispatch()
  const chosenPhoto = useSelector((state) => state.app.chosenPhoto)

  const currentUserRef = doc(db, 'users', auth.currentUser.uid)
  async function saveToProfile() {
    await updateDoc(currentUserRef, { savedImages: arrayUnion({ ...chosenPhoto }) })
    alert('You saved an image.')
  }
  return (
    <div className={styles['container']}>
      <button id={styles['close']} onClick={() => dispatch(hideChosenPhoto())}>
        <AiOutlineCloseCircle />
      </button>
      <div className={styles['content-box']}>
        <div className={styles['img-box']}>
          <img src={chosenPhoto.url} />
        </div>
        <div className={styles['info']}>
          <h1>{chosenPhoto.title}</h1>
          <p className={styles['explanation']}>{chosenPhoto.explanation}</p>
          <button className={styles['add-btn']} onClick={saveToProfile}>
            <BsFillPlusCircleFill /> Save to Your Gallery
          </button>
        </div>
      </div>
    </div>
  )
}
