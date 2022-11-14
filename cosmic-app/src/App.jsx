import React from 'react'
import { Outlet } from 'react-router-dom'

import { HeaderNavigation } from './infrastructure/navigation/headerNavigation'
import { Form } from './pages/Account/components/Form'

export function App() {
  return (
    <div>
      <HeaderNavigation />
      <Outlet />
      <Form />
    </div>
  )
}
