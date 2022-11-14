import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import style from './headerNavigation.module.scss'
import { auth } from '../firebase/firebase'

export const HeaderNavigation = () => {
  const user = auth.currentUser
  console.log(user)
  useEffect(() => {}, [user])
  async function signoutUser() {
    try {
      signOut(auth)
      console.log('user is signed out')
    } catch (error) {
      console.log('error', error.message)
    }
  }

  return (
    <nav className={style.headerNav}>
      <Link to="/mars" className={style.logoLink}>
        <img
          src="src/assets/cosmic-logo.svg"
          alt="cosmic logo"
          className={style.logo}
        />
      </Link>
      <ul className={style.links}>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
        <li>
          <Link to="/apod">APOD</Link>
        </li>
        {user === null ? (
          <li>
            <a href="">Sign In / Sign Up</a>
          </li>
        ) : (
          <li onClick={signoutUser}>
            <a href="">Sign Out</a>
          </li>
        )}
      </ul>
    </nav>
  )
}
