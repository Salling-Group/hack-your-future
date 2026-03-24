
export function withQuery(path, query) {
  const url = new URL(path, "http://localhost:3001"); 
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "")
      url.searchParams.set(k, String(v));
  });
  return url.pathname + url.search;
}
