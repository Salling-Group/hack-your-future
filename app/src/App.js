import './App.css';
import { useState } from 'react';

function App() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStoreOpeningHours = () => {
    fetch("/stores/")
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error("Error fetching store opening hours:", error);
        setError("Failed to fetch store opening hours. Please try again later.");
        setData(null);
      });
  }


  const fetchStoreOpeningHoursBilkaTilts = () => {
    fetch("/stores/efba0457-090e-4132-81ba-c72b4c8e7fee")
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error("Error fetching store opening hours:", error);
        setError("Failed to fetch store opening hours. Please try again later.");
        setData(null);
      });
  }

  const fetchStoreOpeningHoursByName = () => {
    fetch("/sorted-stores/")
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error("Error fetching store opening hours:", error);
        setError("Failed to fetch store opening hours. Please try again later.");
        setData(null);
      });
  }

  const showNearByStoreWithing10 = () => {
    fetch("/find-nearby-stores/10")
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error("Error fetching store opening hours:", error);
        setError("Failed to fetch store opening hours. Please try again later.");
        setData(null);
      });
  }

  const showNearByStoreWithing50 = () => {
    fetch("/find-nearby-stores/50")
    .then( resp => resp.json())
    .then(data => {
      if(!data.length) return;
      setData(data);
      setError(null);
    })
    .catch(error => {
      console.error("Error fetching store opening hours:", error);
      setError("Failed to fetch store opening hours. Please try again later.");
      setData(null);
    });
  }

  const renderOpeningHoursByStore = (store) => {
    const openingHours = store.hours.filter((hour) => hour.type === 'store');

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      return (
      <div className='listItem'>
        <h3>{store.name}<br></br>Opening Hours</h3>
        {openingHours.map((hours) => (
           <p>{weekdays[new Date(hours.date).getDay()]} open from {new Date(hours.open).getHours()} to {new Date(hours.close).getHours()}</p>  
        ))}
         
      </div>
      )
  }

 
  return (
    <div className="App">

      <h1>Bilka stores - opening hours</h1>
      <div className="wrapper">
        <div className='button-wrapper'>
        <button className='btn1' onClick={fetchStoreOpeningHours}>Fetch bilka opening hours</button>
        </div>
        <div className='button-wrapper'>
        <button className='btn2' onClick={fetchStoreOpeningHoursBilkaTilts}>Fetch bilka Tilts</button>
        </div>
        <div className='button-wrapper'>
        <button className='btn3' onClick={fetchStoreOpeningHoursByName}>Sorted by name asc</button>
        </div>
        <div className='button-wrapper'>
        <button className='btn4' onClick={showNearByStoreWithing10}>Show stores within 10 Km</button>
        </div>
        <div className='button-wrapper'>
        <button className='btn5' onClick={showNearByStoreWithing50}>Show stores within 50 Km</button>
        </div>
      </div>
      
      
      <div className="list">
        {error && <div className="error">{error}</div>}
        {data && data.map((store) => (<div>{renderOpeningHoursByStore(store)}</div>))}
      </div>
  

    </div>
  );
}

export default App;
