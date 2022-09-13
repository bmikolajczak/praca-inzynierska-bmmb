import { useState } from 'react'

import '../styles/Account.scss'
import styles from '../styles/Account.module.scss'
export function Account() {
  const [activeTab, setActiveTab] = useState('signin')
  return (
    <div>
      <h1>Welcome to user account page!</h1>
      <p className="welcome">welcome to account page</p>

      <ul className={styles.tabs}>
        <li onClick={() => setActiveTab('signin')}>sign in</li>
        <li onClick={() => setActiveTab('register')}>register</li>
      </ul>

      {activeTab === 'register' && (
        <form className={styles.registerForm}>
          <label for="name">Name</label>
          <input placeholder="Enter your name" id="name" />

          <label for="email">Email</label>
          <input placeholder="email" id="email" />

          <label for="password">Password</label>
          <input placeholder="Enter your password" id="password" />

          <label for="confirm">Confirm Password</label>
          <input placeholder="Re-enter your password" id="confirm" />
          <button type="submit">Register</button>
        </form>
      )}

      {activeTab === 'signin' && (
        <form className={styles.loginForm}>
          <label for="email">Email</label>
          <input placeholder="email" id="login-email" />

          <label for="password">Password</label>
          <input placeholder="Enter your password" id="login-password" />

          <button type="submit">Sign In</button>
        </form>
      )}
    </div>
  )
}
