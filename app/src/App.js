import "./App.css";
import { useState } from "react";

function App() {
  const [data, setData] = useState(null);

  const fetchStoreOpeningHours = () => {
    fetch("/stores/")
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch(console.error());
  };

  const fetchStoreOpeningHoursBilkaTilts = () => {
    fetch("/stores/efba0457-090e-4132-81ba-c72b4c8e7fee")
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch(console.error());
  };

  const fetchStoreOpeningHoursByName = () => {
    fetch("/sorted-stores/")
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
      })
      .catch(console.error());
  };

  const showNearByStoreWithing10 = () => {
    fetch("/find-nearby-stores/10")
      .then((resp) => resp.json())
      .then((data) => {
        if (!data.length) return;
        setData(data);
      });
  };

  const showNearByStoreWithing50 = () => {
    fetch("/find-nearby-stores/50")
      .then((resp) => resp.json())
      .then((data) => {
        if (!data.length) return;
        setData(data);
      });
  };

  const renderOpeningHoursByStore = (store) => {
    const openingHours = store.hours.filter((hour) => hour.type === "store");

    const weekdays = [
      "Sunday",
      "Monday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return (
      <div className="store">
        <h3>{store.name} - Opening Hours</h3>
        {openingHours.map((hours) => (
          <p>
            {weekdays[new Date(hours.date).getDay()]} open from{" "}
            {new Date(hours.open).getHours()} to{" "}
            {new Date(hours.close).getHours()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="header">
        <img src="./bilkaLogo.jpg" className="Bilka-logo" alt="bilkalogo" />
        <h1>Bilka stores - opening hours</h1>
        <img
          src="./sallingLogo.png"
          className="Salling-logo"
          alt="sallinglogo"
        />
      </div>
      <div className="nav">
        <div className="button-wrapper">
          <button onClick={fetchStoreOpeningHours}>
            Fetch bilka opening hours
          </button>
        </div>
        <div className="button-wrapper">
          <button onClick={fetchStoreOpeningHoursBilkaTilts}>
            Fetch bilka Tilts
          </button>
        </div>
        <div className="button-wrapper">
          <button onClick={fetchStoreOpeningHoursByName}>
            Sorted by name asc
          </button>
        </div>
        <div className="button-wrapper">
          <button onClick={showNearByStoreWithing10}>
            Show stores within 10 Km
          </button>
        </div>
        <div className="button-wrapper">
          <button onClick={showNearByStoreWithing50}>
            Show stores within 50 Km
          </button>
        </div>
      </div>

      <div>
        {data &&
          data.map((store) => <div>{renderOpeningHoursByStore(store)}</div>)}
      </div>
    </div>
  );
}

export default App;
