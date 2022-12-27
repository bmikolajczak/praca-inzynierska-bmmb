import React, { useState, useEffect } from 'react'

export default function SelectForm(props) {

  const [selectedItem, setItem] = useState('empty')
  const [data, setData] = useState([])
  const [loaded, setLoaded]= useState(false)

  function handleChange(event) {
    setItem(event.target.value)
    console.log(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault()
    console.log(selectedItem)
    if(selectedItem === 'empty') return
    fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/'+ selectedItem +'/latest_photos?api_key=' + '0381f1py7G8yhbs9VvrxN9JPn2O5LJ88EEqolGND')
      .then((res) => res.json())
      .then((result) => {
        setData(result.latest_photos)
        setLoaded(true)
        console.log(data);
      })
  }
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor={props.name}>{props.labelText}</label>
          <select name={props.name} id={props.name} onChange={handleChange}>
            <option value='empty'></option>
            {props.data.map(item => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <input type="submit" value="Submit"/>
        </form>
        {loaded && data.length &&
          <div>
            <p>{data[0].earth_date}</p>
            <img src={data[0].img_src}/>
          </div>
        }

      </div>
    )
}
