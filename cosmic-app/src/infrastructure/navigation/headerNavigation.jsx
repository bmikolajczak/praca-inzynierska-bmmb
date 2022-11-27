import React from 'react'
import { Link } from 'react-router-dom'
import style from './headerNavigation.module.scss'

export const HeaderNavigation = () => {
  return (
    <nav className={style.headerNav}>
      <Link to="/" className={style.logoLink}>
        <img src="src/assets/cosmic-logo.svg" alt="cosmic logo" className={style.logo} />
      </Link>
      <ul className={style.links}>
        <li>
          <Link to="/mars">Mars</Link>
        </li>
        <li>
          <Link to="/solar">Solar</Link>
        </li>        
        <li>
          <Link to="/stage">Stage</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  )
}
