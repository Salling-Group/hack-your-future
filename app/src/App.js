import { useState } from "react";
import styles from "./App.module.css";
import { Loading } from "./components/Loading/Loading";
import { StoreTable } from "./components/StoreTable/StoreTable";
import { Error } from "./components/Error/Error";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resetErrorMsg = () => {
    setErrorMsg("");
  };

  const fetchStoreOpeningHours = () => {
    setIsLoading(true);

    fetch("/stores/")
      .then(async (resp) => {
        if (!resp.ok) {
          const errData = await resp.json();
          setErrorMsg(errData.error);
        }

        return resp.json();
      })
      .then((data) => {
        setData(data);
        resetErrorMsg();
      })
      .finally(() => setIsLoading(false));
  };

  const fetchStoreOpeningHoursBilkaTilts = () => {
    setIsLoading(true);

    fetch("/stores/efba0457-090e-4132-81ba-c72b4c8e7fee")
      .then(async (resp) => {
        if (!resp.ok) {
          const errData = await resp.json();
          setErrorMsg(errData.error);
        }

        return resp.json();
      })
      .then((data) => {
        setData(data);
        resetErrorMsg();
      })
      .finally(() => setIsLoading(false));
  };

  const fetchStoreOpeningHoursByName = () => {
    setIsLoading(true);

    fetch("/sorted-stores/")
      .then(async (resp) => {
        if (!resp.ok) {
          const errData = await resp.json();
          setErrorMsg(errData.error);
        }

        return resp.json();
      })
      .then((data) => {
        setData(data);
        resetErrorMsg();
      })
      .finally(() => setIsLoading(false));
  };

  const showNearByStoreWithing10 = () => {
    setIsLoading(true);

    fetch("/find-nearby-stores/10")
      .then(async (resp) => {
        if (!resp.ok) {
          const errData = await resp.json();
          setErrorMsg(errData.error);
        }

        return resp.json();
      })
      .then((data) => {
        setData(data);
        resetErrorMsg();
      })
      .finally(() => setIsLoading(false));
  };

  const showNearByStoreWithing50 = () => {
    fetch("/find-nearby-stores/50")
      .then(async (resp) => {
        if (!resp.ok) {
          const errData = await resp.json();
          setErrorMsg(errData.error);
        }

        return resp.json();
      })
      .then((data) => {
        setData(data);
        resetErrorMsg();
      })
      .finally(() => setIsLoading(false));
  };

  const render = () => {
    if (isLoading) {
      return <Loading />;
    } else if (errorMsg) {
      return <Error errorMsg={errorMsg} />;
    } else if (data?.length) {
      return <StoreTable stores={data} />;
    } else {
      return <h1 className={styles.fetchData}>Plase Fetch Data</h1>;
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Bilka stores - opening hours</h1>

      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={fetchStoreOpeningHours}>
          Fetch bilka opening hours
        </button>

        <button
          className={styles.button}
          onClick={fetchStoreOpeningHoursBilkaTilts}
        >
          Fetch bilka Tilts
        </button>

        <button
          className={styles.button}
          onClick={fetchStoreOpeningHoursByName}
        >
          Sorted by name asc
        </button>

        <button className={styles.button} onClick={showNearByStoreWithing10}>
          Show stores within 10 Km
        </button>

        <button className={styles.button} onClick={showNearByStoreWithing50}>
          Show stores within 50 Km
        </button>
      </div>

      <div>{render()}</div>
    </div>
  );
}

export default App;
