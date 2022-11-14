import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import styles from '../styles/LinkHub.module.scss'
// import { HeaderNavigation } from '../../../infrastructure/navigation/headerNavigation'
// import { Form } from '../../Account/components/Form'

export function LinkHub() {
  return (
    <div>
      <div className={styles['links-container']}>
        <Link to="/mars">Learn about Mars</Link>
        <Link to="/solar">Learn about our Solar System</Link>
        <Link to="/apod">See interesting astronomy pictures</Link>
        <Link to="/about">Learn more about the project</Link>
      </div>
    </div>
  )
}
