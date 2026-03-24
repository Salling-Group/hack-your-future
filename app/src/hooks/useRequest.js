import { useCallback, useState } from "react";

export function useRequest() {
  const [overlayBusy, setOverlayBusy] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState(null);

  const run = useCallback(async (endpoint, actionKey, onSuccess) => {
    setLoadingAction(actionKey);
    setOverlayBusy(true);
    setError(null);

    try {
      const resp = await fetch(endpoint);
      if (!resp.ok) {
        const fallback = { error: resp.statusText || `HTTP ${resp.status}` };
        let body = fallback;
        try {
          body = await resp.json();
        } catch(e) {
          setError(e)
          setLoadingAction(null);
          setOverlayBusy(false);
        }
        throw new Error(body.error || fallback.error);
      }
      const json = await resp.json();
      onSuccess(Array.isArray(json) ? json : []);
    } catch (e) {
      const message = e && e.message ? e.message : "Something went wrong";
      setError(message);
      onSuccess([]); // keep UI stable
    } finally {
      setLoadingAction(null);
      setOverlayBusy(false);
    }
  }, []);

  return { overlayBusy, loadingAction, error, setError, run };
}
