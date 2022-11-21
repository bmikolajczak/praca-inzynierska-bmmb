import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import styles from '../styles/LinkHub.module.scss'
// import { HeaderNavigation } from '../../../infrastructure/navigation/headerNavigation'
// import { Form } from '../../Account/components/Form'

export function LinkHub() {
  return (
    <div>
      <div className={styles['links-container']}>
        <Link to="/mars" className="mars-li">
          Learn about Mars
        </Link>
        <Link to="/solar" className="solar-li">
          Learn about our Solar System
        </Link>
        <Link to="/stage" className="stage-li">
          Learn about NASA'S inventions
        </Link>
        <Link to="/apod" className="apod-li">
          See interesting astronomy pictures
        </Link>
        <Link to="/about" className="about-li">
          Learn more about the project
        </Link>
      </div>
    </div>
  )
}
