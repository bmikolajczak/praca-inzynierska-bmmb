import style from '../styles/RoverApi.module.scss'
import React, { useState, useEffect } from 'react'
import RoverForm from './RoverForm'

export default function RoverApi() {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState([])
  const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1'
  const apiKey = '0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND'
  // run on start
  useEffect(() => {
    fetch(baseUrl + '/rovers?api_key=' + apiKey)
      .then((res) => res.json())
      .then((result) => {
        setData(result.rovers)
        setLoaded(true)
        console.log(result.rovers);
      })
  }, [])

  return (
    <section className={style.roverApi}>
      <h2>Mars Rover Photos</h2>
      <div className={style.formsContainer}>
        {loaded ? 
          <RoverForm name="rovers" labelText="Choose rover " data={data} /> 
          : <div>Loading...</div>
        }
        
      </div>
    </section>
  )
}
