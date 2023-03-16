import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api").then( resp => resp.json()).then(data => {
     setData(data) 
    });
  }, []);

  const renderOpeningHoursByStore = (store) => {
    const openingHours = store.hours.filter((hour) => hour.type === 'store');

      return (
      <div>
        <h3>{store.name} - Opening Hours</h3>
        {openingHours.map((hours) => (
           <p>open from {new Date(hours.open).getHours()} to {new Date(hours.close).getHours()}</p>  
        ))}
         
      </div>
      )
  }

 
  return (
    <div className="App">
     <h1>Bilka stores - opening hours</h1>

      <div>
        {data ? data.map((store) => (<div>{renderOpeningHoursByStore(store)}</div>)) : "Loading..."}
      </div>
  
    </div>
  );
}

export default App;
