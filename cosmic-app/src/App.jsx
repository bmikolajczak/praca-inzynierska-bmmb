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
import solarInfo from './pages/Solar System/components/SolarInfo.json'
import solar from './pages/Solar System/components/Solar.json'
import stageModels from './pages/Stage Models/components/StageModels.json'
import landscapes from './pages/Mars/components/Landscapes.json'

export function App() {
  const modal = useSelector((state) => state.app.modalShown)
  const chosenPhotoShown = useSelector((state) => state.app.chosenPhotoShown)

  const quizCollection = collection(db, 'quizes')
  const resourceCollection = collection(db, 'resources')
  useEffect(() => {
    try {
      setDoc(doc(quizCollection, 'questions'), {
        marsQuestions: [...quizes.marsQuestions],
        solarQuestions: [...quizes.solarQuestions],
        vehicleQuestions: [...quizes.vehicleQuestions],
      })
      setDoc(doc(resourceCollection, 'solarInfo'), { ...solarInfo })
      setDoc(doc(resourceCollection, 'solar'), { ...solar })
      setDoc(doc(resourceCollection, 'stageModels'), { ...stageModels })
      setDoc(doc(resourceCollection, 'landscapes'), { ...landscapes })
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
