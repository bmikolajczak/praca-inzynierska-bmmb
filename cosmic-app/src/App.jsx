import React from 'react'
import { Outlet } from 'react-router-dom'

import { LinkHub } from './pages/LinkHub/components/LinkHub'
import { HeaderNavigation } from './infrastructure/navigation/headerNavigation'
import { Form } from './pages/Account/components/Form'
import { ApodModal } from './pages/APOD/components/Modal'

import { useSelector, useDispatch } from 'react-redux'

export function App() {
  const modal = useSelector((state) => state.app.modalShown)
  const chosenPhotoShown = useSelector((state) => state.app.chosenPhotoShown)
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
