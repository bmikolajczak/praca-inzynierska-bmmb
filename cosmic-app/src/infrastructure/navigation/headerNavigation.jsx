import React from 'react'
import { Link } from 'react-router-dom'
import style from './headerNavigation.module.scss'

export const HeaderNavigation = () => {
  return (
    <nav className={style.headerNav}>
      <Link to="/mars" className={style.logoLink}>
        <img src="src/assets/cosmic-logo.svg" alt="cosmic logo" className={style.logo} />
      </Link>
      <ul className={style.links}>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  )
}
