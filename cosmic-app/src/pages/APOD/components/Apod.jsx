// APOD - Astronomy Picture of the Day
import React from 'react'
import { useEffect, useState } from 'react'

import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../../../infrastructure/firebase/firebase'

import { useDispatch } from 'react-redux'
import { setChosenPhoto, showChosenPhoto } from '../../../infrastructure/store/appState'

import { BsFillPlusCircleFill } from 'react-icons/bs'

import style from '../styles/Apod.module.scss'
import styles2 from '../../Account/styles/Account.module.scss'

const API_URL = 'https://api.nasa.gov/planetary/apod?api_key='
const RandomImageCount = '&count=4'
// TODO Not secured API key
const API_KEY = '0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND'
const MEDIA_TYPE = '&media_type="image"'

// Note: concept_tags functionality is turned off in API

function CallApodApi() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [image, setImage] = useState('')
  const [fetchedImages, setFetchedImages] = useState([])
  const [apodStartDate, setStartDate] = useState('')
  const [apodEndDate, setEndDate] = useState('')

  function downloadImage() {
    window.open(image.hdurl)
  }

  // Saving image to user profile
  async function saveImage() {
    await updateDoc(currentUserRef, {
      savedImages: arrayUnion({ ...image }),
    })
    console.log(`saved iamge: ' ${image.url} to account: ${auth.currentUser.uid}`)
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
    fetch(API_URL + API_KEY + RandomImageCount)
      .then((res) => res.json())
      .then(
        (result) => {
          setFetchedImages(result)
        },
        (error) => console.log('Error appeared: ', error)
      )
  }, [])
  async function saveToProfile(image) {
    const currentUserRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(currentUserRef, { savedImages: arrayUnion({ ...image }) })
    console.log(`image ${image.title} successfully added`)
  }
  //set chosen pic function
  const dispatch = useDispatch()
  function updateChosenPic(image) {
    dispatch(setChosenPhoto(image))
    dispatch(showChosenPhoto())
  }

  //filter function
  async function getImages(numberOfImages) {
    const imageCount = `&count=${numberOfImages}`
    await fetch(API_URL + API_KEY + imageCount)
      .then((res) => res.json())
      .then(
        (result) => {
          setFetchedImages(result)
        },
        (error) => console.log('Error appeared: ', error)
      )
  }
  //search by date function
  async function getImagesByDates() {
    const startDate = `&start_date=${apodStartDate}`
    const endDate = `&end_date=${apodEndDate}`
    await fetch(API_URL + API_KEY + startDate + endDate)
      .then((res) => res.json())
      .then(
        (result) => {
          setFetchedImages(result)
        },
        (error) => console.log('Error appeared: ', error)
      )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
      <div>
        <div className={style.apodContentContainer}>
          <div className={style.apodImageContainer}>
            <img className={style.apodImageCol + ' ' + style.apodImage} src={image.url} alt={image.title} />
            <div className={style.apodInfo + ' ' + style.apodImageCol}>
              <p>
                <b>{image.title}</b>
              </p>
              <br />
              <p>{image.explanation}</p>
              <p>{image.date}</p>
              {/* Conditionally render copyright if exists */}
              {image.copyright && (
                <p>
                  <i>@{image.copyright}</i>
                </p>
              )}
            </div>
          </div>
          <div className={style.apodButtons}>
            <button onClick={downloadImage}>Open</button>
            <button onClick={() => saveToProfile(image)}>Save</button>
          </div>
        </div>
        <div className={styles2['saved-images']}>
          <p className={styles2['images-header']}>Discover more</p>
          <div className={style['filters']}>
            <div>
              <button className={style['filter-btn']} onClick={() => getImages(3)}>
                Random 3 Images
              </button>
              <button className={style['filter-btn']} onClick={() => getImages(5)}>
                Random 5 Images
              </button>
              <button className={style['filter-btn']} onClick={() => getImages(10)}>
                Random 10 Images
              </button>
            </div>
            <div className={style['dates-div']}>
              <span className={style['datesSpan']}>From</span>
              <input
                className={style['date-input']}
                type="date"
                name="start-date"
                onChange={(event) => {
                  setStartDate(event.target.value)
                  console.log(apodStartDate)
                }}
              />
              <span className={style['datesSpan']}>To</span>
              <input
                className={style['date-input']}
                type="date"
                name="end-date"
                onChange={(event) => {
                  setStartDate(event.target.value)
                  console.log(apodEndDate)
                }}
              />
              <button className={style['filter-btn']} onClick={() => getImagesByDates()}>
                Search by date
              </button>
            </div>
          </div>
          <div className={styles2['cards']}>
            {fetchedImages.map((image) => (
              <div className={styles2['image-card']}>
                <div className={styles2['card-visuals']}>
                  <div className={style['image-div']}>
                    <img
                      onClick={() => updateChosenPic(image)}
                      src={image.url}
                      alt={image.title}
                      className={style['fetched-photo']}
                    />
                  </div>
                  <p className={styles2['image-title']}>{image.title}</p>
                  <button title="Save image to profile" onClick={() => saveToProfile(image)}>
                    <BsFillPlusCircleFill />
                  </button>
                </div>
                <p className={styles2['image-desc']}>{image.explanation}</p>
              </div>
            ))}
          </div>
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
