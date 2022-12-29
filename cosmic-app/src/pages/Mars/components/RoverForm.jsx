import React, { useState } from 'react'
import style from '../styles/RoverForm.module.scss'
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'

export default function RoverForm(props) {
  const [selectedItem, setItem] = useState('empty')
  const [error, setError] = useState(null)
  const [rover, setRover] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [sol, setSol] = useState(0)
  const [photos, setPhotos] = useState([])
  const [photoIndex, setPhotoIndex] = useState(0)

  function handleRoverChange(event) {
    setIsLoaded(false)
    setIsSubmitted(false)
    setError(null)
    setItem(event.target.value)
    console.log(event.target.value)
    if (event.target.value !== 'empty') {
      fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${event.target.value}?api_key=0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND`
      )
        .then((res) => res.json())
        .then((result) => {
          setRover(result.rover)
          setIsLoaded(true)
          console.log(result.rover)
        }),
        (error) => {
          setIsLoaded(true)
          setError(error)
          console.log(error)
        }
    }
  }
  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitted(false)
    setPhotoIndex(0)
    console.log('Sol:', sol)
    console.log('selectedItem:', selectedItem)
    if (selectedItem !== 'empty') {
      fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedItem}/photos?sol=${sol}&api_key=0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND`
      )
        .then((res) => res.json())
        .then((result) => {
          setPhotos(result.photos)
          setIsSubmitted(true)
          console.log(result.photos)
        })
    }
  }
  function handleSolChange(event) {
    setSol(event.target.value)
  }
  function prevPhoto(){
    if(photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    }


  }
  function nextPhoto() {
    if(photoIndex < photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    }
  }

  return (
    <div className={style.roverForm}>
      <div className={style.formInfoPanel}>
        <form onSubmit={handleSubmit}>
          <label htmlFor={props.name}>{props.labelText}</label>
          <select name={props.name} id={props.name} onChange={handleRoverChange}>
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
        {isLoaded && !error && (
          <div>
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
          </div>
        )}
      </div>
      <div className={style.photoTagsPanel}>
        {isSubmitted && photos.length && (
          <div className={style.photoContainer}>
            <div className={style.photoTags}>
              <span>{photos[photoIndex].camera.name}</span>
              <span>{photos[photoIndex].earth_date}</span>
            </div>
            <img src={photos[photoIndex].img_src} />
            <div className={style.stepsContainer}>
              <button onClick={prevPhoto}>
                <AiFillCaretLeft />
              </button>
              <span>{photoIndex + 1}</span>
              <span>/</span>
              <span>{photos.length}</span>
              <button onClick={nextPhoto}>
                <AiFillCaretRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
