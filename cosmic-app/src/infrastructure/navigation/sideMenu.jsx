import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import style from './headerNavigation.module.scss'
import { AiOutlineClose } from 'react-icons/ai'
import { changeSideMenuVisible } from '../store/appState'

export const SideMenu = () => {
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)
  const sideMenuShown = useSelector((state) => state.app.sideMenuShown)
  const dispatch = useDispatch()
  const toggleMenu = () => {
    dispatch(changeSideMenuVisible())
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
        <li>
          <Link to="/account">Account</Link>
        </li>
        {!userLoggedIn ? (
          <li>
            <p>Sign In / Sign Up</p>
          </li>
        ) : (
          <li>
            <p>Sign Out</p>
          </li>
        )}
      </ul>
    </div>
  )
}
