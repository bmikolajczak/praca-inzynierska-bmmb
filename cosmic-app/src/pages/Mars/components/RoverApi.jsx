import style from '../styles/RoverApi.module.scss'
import React from 'react'
import FetchMarsApi from './FetchMarsApi'

export default function RoverApi() {
  return (
    <section className={style.roverApi}>
      <h2>Mars Rover Photos</h2>
      <div>
        <FetchMarsApi apiKey='0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND'/>
      </div>
    </section>
  )
}