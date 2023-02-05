import React from 'react'
import style from './headerNavigation.module.scss'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { changeSideMenuVisible, showLoginForm } from '../store/appState'
import { auth } from '../firebase/firebase'
import { signOut } from 'firebase/auth'

export const SideMenu = () => {
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)
  const sideMenuShown = useSelector((state) => state.app.sideMenuShown)
  const dispatch = useDispatch()
  const toggleMenu = () => {
    dispatch(changeSideMenuVisible())
  }
  function showForm() {
    dispatch(showLoginForm())
  }
  return (
    <div className={sideMenuShown ? style.sideMenu + ' ' + style.sideMenuOpen : style['sideMenu']}>
      <ul>
        <li>
          <p onClick={() => toggleMenu()}>
            <AiOutlineClose />
          </p>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        {userLoggedIn && (
          <li>
            <Link to="/account">Account</Link>
          </li>
        )}
        {!userLoggedIn ? (
          <li onClick={() => showForm()}>
            <p>Sign In / Sign Up</p>
          </li>
        ) : (
          <li onClick={async () => await signOut(auth)}>
            <a>Sign Out</a>
          </li>
        )}
      </ul>
    </div>
  )
}
