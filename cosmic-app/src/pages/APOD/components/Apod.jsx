// APOD - Astronomy Picture of the Day
import style from '../styles/Apod.module.scss'
import React from 'react'
import { useEffect, useState } from 'react'

const API_URL = 'https://api.nasa.gov/planetary/apod?api_key='
const API_KEY = '0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND' // Not secure
// Note: concept_tags functionality is turned off in API

function CallApodApi() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [image, setImage] = useState('')

  function downloadImage() {
    window.open(image.hdurl)
  }
  // TODO Save image url, for a logged user, to his profile
  function saveImage() {
    console.log('low-res image url: ', image.url)
    alert('You saved an image.')
  }

  useEffect(() => {
    fetch(API_URL + API_KEY)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setImage(result)
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
      <div className={style.apodContentContainer}>
        <p>
          <b>{image.title}</b>
        </p>
        <div className={style.apodImageContainer}>
          <img
            className={style.apodImageCol + ' ' + style.apodImage}
            src={image.url}
            alt={image.title}
          />
          <div className={style.apodInfo + ' ' + style.apodImageCol}>
            <p>{image.explanation}</p>
            <p>{image.date}</p>
            <p>
              <i>@{image.copyright}</i>
            </p>
          </div>
        </div>
        <div className={style.apodButtons}>
          <button onClick={downloadImage}>Open</button>
          <button onClick={saveImage}>Save</button>
        </div>
      </div>
    )
  }
}

export function Apod() {
  return (
    <div className={style.apodContainer}>
      <h2>Astronomy Picture of the Day</h2>
      <CallApodApi />
    </div>
  )
}
