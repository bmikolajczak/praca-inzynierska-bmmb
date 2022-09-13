// APOD - Astronomy Picture of the Day
import '../styles/Apod.scss'
import React from 'react'
import { useEffect, useState } from 'react'

const API_URL = 'https://api.nasa.gov/planetary/apod?api_key='
const API_KEY = '0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND' // Not secure
// Note: concept_tags functionality is turned off in API

function CallApodApi() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [image, setImage] = useState('')

  useEffect(() => {
    fetch(API_URL + API_KEY)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setImage(result)
          console.log(result)
        },
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
      <div className="apod-content-container">
        <p>
          <b>{image.title}</b>
        </p>
        <div className="apod-image-container">
          <img
            className="apod-image-col apod-image"
            src={image.url}
            alt={image.title}
          />
          <div className="apod-info apod-image-col">
            <p>{image.explanation}</p>
            <p>{image.date}</p>
            <p>
              <i>@{image.copyright}</i>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export function Apod() {
  return (
    <div className="apod-container">
      <h2>Astronomy Picture of the Day</h2>
      <CallApodApi />
    </div>
  )
}
