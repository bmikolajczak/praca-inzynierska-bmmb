import React, { useState } from 'react'
import style from '../styles/RoverForm.module.scss'
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
import { useEffect } from 'react'

export default function RoverForm(props) {
  const [selectedItem, setItem] = useState('empty')
  const [roverError, setRoverError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [rover, setRover] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitLoaded, setSubmitLoaded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [sol, setSol] = useState(0)
  const [photos, setPhotos] = useState([])

  function handleRoverChange(event) {
    setIsLoaded(false)
    setIsSubmitted(false)
    setRoverError(null)
    setItem(event.target.value)
    console.log(event.target.value)
    if (event.target.value !== 'empty') {
      fetch(
        `${props.baseUrl}/rovers/${event.target.value}?api_key=${props.apiKey}`
      )
        .then((res) => res.json())
        .then((result) => {
          setRover(result.rover)
          setIsLoaded(true)
          setIsSubmitted(false)
        }),
        (roverError) => {
          setIsLoaded(true)
          setRoverError(roverError)
          console.warn(roverError)
        }
    }
  }
  function handleSubmit(event) {
    event.preventDefault()
    if (selectedItem === 'empty') {
      alert('You need to choose a rover')
      return
    }
    setIsSubmitted(true)
    setSubmitLoaded(false)
    fetch(
      `${props.baseUrl}/rovers/${selectedItem}/photos?sol=${sol}&api_key=${props.apiKey}`
    )
      .then((res) => res.json())
      .then((result) => {
        setPhotos(result.photos)
        setSubmitLoaded(true)
      }),
      (submitError) => {
        setIsSubmitted(true)
        setSubmitLoaded(true)
        setSubmitError(submitError)
        console.warn(submitError)
      }
  }
  function handleSolChange(event) {
    setSol(event.target.value)
  }

  return (
    <div className={style.roverForm}>
      <div className={style.formInfoPanel}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="rovers">Choose rover </label>
          <select name="rovers" id="rovers" onChange={handleRoverChange}>
            <option value="empty"></option>
            {props.data.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <label htmlFor="sol">Choose Sol</label>
          <input type="number" name="sol" id="sol" value={sol} onChange={handleSolChange} min="0" max={rover.max_sol} />
          <input type="submit" value="Submit" />
        </form>
        <div className={style.roverInfo}>
          {isLoaded && !roverError && (
            <>
              <p>
                Rover: <b>{rover.name}</b>
              </p>
              <p>
                Mission status: <b>{rover.status}</b>
              </p>
              <p>
                Last Sol: <b>{rover.max_sol}</b>
              </p>
              <p>
                Last date: <b>{rover.max_date}</b>
              </p>
              <p>
                Launch date: <b>{rover.launch_date}</b>
              </p>
              <p>
                Landing date: <b>{rover.landing_date}</b>
              </p>
              <p>
                Total number of photos: <b>{rover.total_photos}</b>
              </p>
            </>
          )}
        </div>
      </div>
      <div className={style.photoTagsPanel}>
        <PhotoFrame photos={photos} isSubmitted={isSubmitted} isLoaded={isSubmitLoaded} error={submitError} />
      </div>
    </div>
  )
}

function PhotoFrame(props) {
  const photos = props.photos
  const isSubmitted = props.isSubmitted
  const isLoaded = props.isLoaded
  const error = props.error
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    setPhotoIndex(0)
  }, [photos])

  function prevPhoto() {
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1)
    }
  }
  function nextPhoto() {
    if (photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1)
    }
  }

  if (error) {
    return <div className={style.centered}>Error: {error.message}</div>
  } else if (!isLoaded && isSubmitted) {
    return <div className={style.centered}>Loading...</div>
  } else if (isSubmitted && photos?.length == 0) {
    return <div className={style.centered}>No photos on chosen Sol</div>
  } else if (isSubmitted) {
    return (
      <div className={style.photoContainer}>
        <div className={style.photoTags}>
          <span>{photos[photoIndex]?.camera.name}</span>
          <span>{photos[photoIndex]?.earth_date}</span>
        </div>
        <img src={photos[photoIndex]?.img_src} />
        <div className={style.stepsContainer}>
          <button onClick={prevPhoto}>
            <AiFillCaretLeft />
          </button>
          <span>{photoIndex + 1}</span>
          <span>/</span>
          <span>{photos?.length}</span>
          <button onClick={nextPhoto}>
            <AiFillCaretRight />
          </button>
        </div>
      </div>
    )
  }
}
