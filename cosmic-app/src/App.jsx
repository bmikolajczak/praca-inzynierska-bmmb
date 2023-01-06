import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { LinkHub } from './pages/LinkHub/components/LinkHub'
import { HeaderNavigation } from './infrastructure/navigation/headerNavigation'
import { Form } from './pages/Account/components/Form'
import { ApodModal } from './pages/APOD/components/Modal'

import { useSelector, useDispatch } from 'react-redux'

import { db } from './infrastructure/firebase/firebase'
import { collection, setDoc, doc } from 'firebase/firestore'

import quizes from './pages/Quizes/components/Questions.json'

export function App() {
  const modal = useSelector((state) => state.app.modalShown)
  const chosenPhotoShown = useSelector((state) => state.app.chosenPhotoShown)

  const quizCollection = collection(db, 'quizes')

  useEffect(() => {
    try {
      setDoc(doc(quizCollection, 'questions'), {
        marsQuestions: [...quizes.marsQuestions],
        solarQuestions: [...quizes.solarQuestions],
        vehicleQuestions: [...quizes.vehicleQuestions],
      })
    } catch (error) {
      console.log('error when adding questions to firestore: ', error)
    }
  }, [])

  return (
    <div>
      <HeaderNavigation />
      {modal && <LinkHub />}
      <Outlet />
      {chosenPhotoShown && <ApodModal />}
      <Form />
    </div>
  )
}
