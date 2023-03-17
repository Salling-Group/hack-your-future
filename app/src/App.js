import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [data, setData] = useState(null);


  const fetchStoreOpeningHours = () => {
    fetch("/stores/").then( resp => resp.json()).then(data => {
      setData(data) 
     });
  }

  const fetchStoreOpeningHoursBilkaTilts = () => {
    fetch("/stores/efba0457-090e-4132-81ba-c72b4c8e7fee").then( resp => resp.json()).then(data => {
      setData(data) 
     });
  }

  const fetchStoreOpeningHoursByName = () => {
    fetch("/sorted-stores/").then( resp => resp.json()).then(data => {
      setData(data) 
     });
  }

  const showMostBusyStore = () => {
    fetch("/most-busy-store/").then( resp => resp.json()).then(data => {
      if(!data.length) return;
      setData(data) 
     });
  }

  const renderOpeningHoursByStore = (store) => {
    const openingHours = store.hours.filter((hour) => hour.type === 'store');

    const weekdays = ["Sunday", "Monday", "Wednesday", "Thursday", "Friday", "Saturday"];

      return (
      <div>
        <h3>{store.name} - Opening Hours</h3>
        {openingHours.map((hours) => (
           <p>{weekdays[new Date(hours.date).getDay()]} open from {new Date(hours.open).getHours()} to {new Date(hours.close).getHours()}</p>  
        ))}
         
      </div>
      )
  }

 
  return (
    <div className="App">

     <h1>Bilka stores - opening hours</h1>
    <div className='button-wrapper'>
    <button onClick={fetchStoreOpeningHours}>Fetch bilka opening hours</button>
    </div>
    <div className='button-wrapper'>
    <button onClick={fetchStoreOpeningHoursBilkaTilts}>Fetch bilka Tilts</button>
    </div>
    <div className='button-wrapper'>
    <button onClick={fetchStoreOpeningHoursByName}>Sorted by name asc</button>
    </div>
    <div className='button-wrapper'>
    <button onClick={showMostBusyStore}>Show the most busy store</button>
    </div>
      
     
      

      <div>
        {data && data.map((store) => (<div>{renderOpeningHoursByStore(store)}</div>))}
      </div>
  

    </div>
  );
}

export default App;
