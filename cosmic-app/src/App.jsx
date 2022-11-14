import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { LinkHub } from './pages/LinkHub/components/LinkHub'
import { HeaderNavigation } from './infrastructure/navigation/headerNavigation'
import { Form } from './pages/Account/components/Form'

export function App() {
  const [hubVisible, setHubVisible] = useState(false)

  function toggleHub() {}
  return (
    <div>
      <HeaderNavigation />
      <LinkHub />
      <Outlet />
      <Form />
    </div>
  )
}
