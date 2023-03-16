import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api").then( resp => resp.json()).then(data => {
      console.log(data);
     setData(data) 
    });
  }, []);

 
  return (
    <div className="App">
     <h1>Bilka stores - opening hours</h1>

      <div>
        {data ? data.map((store) => (<div>{JSON.stringify(store, undefined, 3)}</div>)) : "Loading..."}
      </div>
  
    </div>
  );
}

export default App;
