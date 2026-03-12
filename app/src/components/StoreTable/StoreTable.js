import styles from "./StoreTable.module.css";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function StoreTable({ stores }) {
  //Render opening hours
  const renderOpeningHoursByStore = (store) => {
    const openingHours = store.hours.sort((a, b) => {
      const dayA = new Date(a.date).getDay();
      const dayB = new Date(b.date).getDay();
      return dayA - dayB;
    });

    return (
      <>
        {openingHours.map((hours) => (
          <p>
            <b>{WEEK_DAYS[new Date(hours.date).getDay()]}</b>
            <> open from </>
            <b>{new Date(hours.open).getHours()}</b>
            <> to </>
            <b>{new Date(hours.close).getHours()}</b>
          </p>
        ))}
      </>
    );
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Store Name</th>
          <th>Opening Hours</th>
        </tr>
      </thead>
      <tbody>
        {stores &&
          stores.map((store) => (
            <tr key={store.name}>
              <td className={styles.storeName}>{store.name}</td>
              <td className={styles.openHours}>
                {renderOpeningHoursByStore(store)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
