import './App.css';
import { useState } from 'react';
 
function App() {
 
  const [data, setData] = useState([]);
 
 
  const fetchStoreOpeningHours = () => {
    fetch("/stores/").then(resp => resp.json()).then(data => {
      setData(data)
    });
  }
 
  const fetchStoreOpeningHoursBilkaTilts = () => {
    fetch("/stores/efba0457-090e-4132-81ba-c72b4c8e7fee").then(resp => resp.json()).then(data => {
      setData(data)
    });
  }
 
const fetchStoreOpeningHoursByName = () => {
  fetch("/sorted-stores/")
    .then((resp) => resp.json())
    .then((json) => setData(Array.isArray(json) ? json : []))
    .catch(() => setData([]));
};
 
  const showNearByStoreWithing10 = () => {
    fetch("/find-nearby-stores/10")
      .then((resp) => resp.json())
      .then((data) => {
        setData(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setData([]);
      });
  };
 
  const showNearByStoreWithing50 = () => {
    fetch("/find-nearby-stores/50").then(resp => resp.json()).then(data => {
      if (!data.length) return;
      setData(data)
    });
  }
 
  const renderOpeningHoursByStore = (store) => {
   const openingHours = (Array.isArray(store?.hours) ? store.hours : []).filter(
  (hour) => hour?.type === "store"
);
 
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
 
    return (
      <div className="store-container">
        <h3>{store.name} - Opening Hours</h3>
 
        <table className="hours-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Open</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody>
            {openingHours.map((hours, index) => {
              const day = weekdays[new Date(hours.date).getDay()] || "—";
              const open = new Date(hours.open).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const close = new Date(hours.close).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
 
              return (
                <tr key={index}>
                  <td>{day}</td>
                  <td>{open}</td>
                  <td>{close}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
 
 
  return (
    <div className="App">
 
      <h1>Bilka stores - opening hours</h1>
      <div className="button-section">
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
        <button onClick={showNearByStoreWithing10}>Show stores within 10 Km</button>
      </div>
      <div className='button-wrapper'>
        <button onClick={showNearByStoreWithing50}>Show stores within 50 Km</button>
      </div>
</div>
 
 
 
     <div>
        {data && data.map((store) => (<div>{renderOpeningHoursByStore(store)}</div>))}
      </div>
 
 
    </div>
  );
}
 
export default App;
 
 