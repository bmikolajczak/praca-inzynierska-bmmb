import React from 'react'
import { Link } from 'react-router-dom'
import style from './headerNavigation.module.scss'

export const HeaderNavigation = () => {
  return (
    <nav className={style.headerNav}>
      <Link to="/mars">
        <img src="src/assets/cosmic-logo.svg" className={style.logo} />
      </Link>
      <ul className={style.links}>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <a href="/settings">Settings</a>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  )
}
