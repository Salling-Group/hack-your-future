import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./styles/App.css";

import ActionButton from "./components/ActionButton.jsx";
import StoreCard from "./components/StoreCard.jsx";
import { useRequest } from "./hooks/useRequest.js";
import {
  ACTIONS,
  API_PATHS,
  TILST_ID,
  DEFAULT_COORDS,
} from "./constants/index.js";
import { withQuery } from "./services/api.js";
import { STR } from "./constants/string.js";

export default function App() {
  const [storeList, setStoreList] = useState([]);
  const [activeAction, setActiveAction] = useState("");


  const { overlayBusy, loadingAction, error, setError, run } = useRequest();
  const hasData = useMemo(() => Array.isArray(storeList) && storeList.length > 0, [storeList]);

  // Actions
  const fetchAll = useCallback(() => {
    setActiveAction(ACTIONS.ALL);
    run(API_PATHS.STORES, ACTIONS.ALL, setStoreList);
  }, [run]);

  const fetchSorted = () => {
    setActiveAction(ACTIONS.SORTED);
    run(API_PATHS.SORTED_STORES, ACTIONS.SORTED, setStoreList);
  };

  const fetchTilst = () => {
    setActiveAction(ACTIONS.TILST);
    run(API_PATHS.STORE_BY_ID(TILST_ID), ACTIONS.TILST, setStoreList);
  };

  // Common helper for nearby stores
  const fetchNear = (km, actionKey) => {
    setActiveAction(actionKey);
    const pathWithQuery = withQuery(API_PATHS.FIND_NEARBY(km), {
      lat: DEFAULT_COORDS.lat,
      lon: DEFAULT_COORDS.lon,
    });
    run(pathWithQuery, actionKey, setStoreList);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDismissToast = () => setError(null);

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="brand">
          <div>
            <div className="brand-title">{STR.BRAND_TITLE}</div>
            <div className="brand-sub">{STR.BRAND_SUB}</div>
          </div>
        </div>
        <div className="header-actions" />
      </header>

      {/* Store Page View */}
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="menu-group">
            {/* Store Page Menus */}
            <div className="menu-title">{STR.SEC_STORES}</div>

            <ActionButton
              loading={loadingAction === ACTIONS.ALL}
              active={activeAction === ACTIONS.ALL}
              onClick={fetchAll}
            >
              {STR.BTN_ALL}
            </ActionButton>

            <ActionButton
              loading={loadingAction === ACTIONS.TILST}
              active={activeAction === ACTIONS.TILST}
              onClick={fetchTilst}
            >
              {STR.BTN_TILST}
            </ActionButton>

            <ActionButton
              loading={loadingAction === ACTIONS.SORTED}
              active={activeAction === ACTIONS.SORTED}
              onClick={fetchSorted}
            >
              {STR.BTN_SORTED}
            </ActionButton>
          </div>

          <div className="menu-group">
            <div className="menu-title">{STR.SEC_NEARBY}</div>

            <ActionButton
              variant="outline"
              loading={loadingAction === ACTIONS.NEAR10}
              active={activeAction === ACTIONS.NEAR10}
              onClick={() => fetchNear(10, ACTIONS.NEAR10)}
            >
              {STR.BTN_NEARBY_10}
            </ActionButton>

            <ActionButton
              variant="outline"
              loading={loadingAction === ACTIONS.NEAR50}
              active={activeAction === ACTIONS.NEAR50}
              onClick={() => fetchNear(50, ACTIONS.NEAR50)}
            >
              {STR.BTN_NEARBY_50}
            </ActionButton>
          </div>
        </aside>

        <main className="admin-content">
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="toast toast-error"
              onClick={onDismissToast}
              title={STR.TOAST_DISMISS_TITLE}
            >
              <strong>{STR.TOAST_ERROR_PREFIX}</strong> {error}
            </div>
          )}

          <div className="content-header">
            <p className="content-sub muted">
              {activeAction === ACTIONS.ALL && STR.SUB_ALL}
              {activeAction === ACTIONS.TILST && STR.SUB_TILST}
              {activeAction === ACTIONS.SORTED && STR.SUB_SORTED}
              {activeAction === ACTIONS.NEAR10 && STR.SUB_NEAR10}
              {activeAction === ACTIONS.NEAR50 && STR.SUB_NEAR50}
            </p>
          </div>
          {/* Loader */}

          {overlayBusy && (
            <div className="overlay" aria-busy="true" aria-label="Loading">
              <div className="overlay-panel">
                <div className="overlay-spinner" />
                <div className="overlay-text">{STR.OVERLAY_FETCHING}</div>
              </div>
            </div>
          )}

          {!overlayBusy && !hasData && !error && (
            <div className="empty-state">
              <div className="empty-illustration" />
              <h3>{STR.EMPTY_TITLE}</h3>
            </div>
          )}
          {/* Store Page Listing */}

          {!overlayBusy && hasData && (
            <div className="grid">
              {storeList.map((s) => (
                <StoreCard key={s.id} store={s} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
