import React, { useEffect } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import style from './headerNavigation.module.scss'
import { auth } from '../firebase/firebase'
import { signOut } from 'firebase/auth'
import { changeModalVisible, changeSideMenuVisible, setUserIn, setUserOut, showLoginForm } from '../store/appState'
// import { onAuthStateChanged } from 'firebase/auth'

export const HeaderNavigation = () => {
  const user = auth.currentUser

  //creating ref to redux dispatch object
  const dispatch = useDispatch()
  const navigate = useNavigate()

  //ref to user login status in redux
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)
  // console.log('logged in?', userLoggedIn)

  // console.log('user info', user)
  useEffect(() => {}, [user])
  async function signoutUser() {
    try {
      navigate('/menu')
      await signOut(auth)
      console.log('user is signed out', userLoggedIn)
      setTimeout(() => (window.location.href = '/about'), 1000)
    } catch (error) {
      console.log('error', error.message)
    }
  }

  function closeLinkHub() {
    dispatch(changeModalVisible())
  }
  function showForm() {
    dispatch(showLoginForm())
  }
  function toggleMenu() {
    dispatch(changeSideMenuVisible())
  }
  return (
    <nav className={style.headerNav}>
      <Link to="/menu" className={style.logoLink}>
        <img src="src/assets/cosmic-logo.svg" alt="cosmic logo" className={style.logo} />
      </Link>
      {/* <button id={style['hamburger-icon']} onClick={toggleMenu}>
        {' '}
        <AiOutlineMenu />
      </button> */}
      <ul className={style.links}>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        {userLoggedIn && (
          <li>
            <Link to="/account">Account</Link>
          </li>
        )}
        {!userLoggedIn ? (
          <li>
            <a
              onClick={() => {
                showForm()
              }}
            >
              Sign In
            </a>
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
