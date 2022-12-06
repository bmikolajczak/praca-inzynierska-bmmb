import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { LinkHub } from './pages/LinkHub/components/LinkHub'
import { HeaderNavigation } from './infrastructure/navigation/headerNavigation'
import { Form } from './pages/Account/components/Form'
import { ApodModal } from './pages/APOD/components/Modal'

import { useSelector, useDispatch } from 'react-redux'

export function App() {
  // const [hubVisible, setHubVisible] = useState(false)
  const modal = useSelector((state) => state.app.modalShown)

  return (
    <div>
      <HeaderNavigation />
      {modal && <LinkHub />}
      <Outlet />
      <ApodModal />
      <Form />
    </div>
  )
}
