import React, { useState, useEffect } from 'react'

export default function FetchMarsApi(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=' + props.apiKey)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setData(result);
          console.log(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])


  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } 
  else {
    return (
      <ul>
        {data.rovers.map(rover => (
          <li key={rover.id}>
            {rover.name} {rover.status}
          </li>
        ))}
      </ul>
    );
  }
}