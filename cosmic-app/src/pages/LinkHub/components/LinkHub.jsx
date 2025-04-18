import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/LinkHub.module.scss'

export function LinkHub() {
  return (
    <div className={styles['parent-cont']}>
      <div className={styles['links-container']}>
        <Link to="/mars" className="mars-li">
          Learn about Mars
        </Link>
        <Link to="/solar" className="solar-li">
          Learn about our Solar System
        </Link>
        <Link to="/stage" className="stage-li">
          Learn about NASA's inventions
        </Link>
        <Link to="/apod" className="apod-li">
          See interesting astronomy pictures
        </Link>
        <Link to="/quiz" className="about-li">
          Check your knowledge with our quizes
        </Link>
      </div>
    </div>
  )
}
