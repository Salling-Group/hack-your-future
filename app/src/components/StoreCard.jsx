import React from "react";
import { formatTime, weekdayLabel } from "../utils/date.js";
import { STR } from "../constants/string.js";

export default function StoreCard({ store }) {
  const hours = Array.isArray(store.hours) ? store.hours : [];

  return (
    <div className="card" key={store.id}>
      <div className="card-header">
        <div className="badge">{STR.BADGE_STORE}</div>
        <h3 className="card-title">{store.name}</h3>
      </div>

      {hours.length === 0 ? (
        <p className="muted">{STR.NO_HOURS}</p>
      ) : (
        <ul className="hours-list">
          {hours.map((h) => (
            <li key={`${store.id}-${h.date}`}>
              <span className="hours-day">{weekdayLabel(h.date)}:</span>
              <span className="hours-time">
                {h.closed
                  ? STR.CLOSED
                  : `${formatTime(h.open)} – ${formatTime(h.close)}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
