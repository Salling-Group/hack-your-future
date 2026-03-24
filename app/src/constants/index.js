// Action keys
export const ACTIONS = {
  ALL: "all",
  TILST: "tilst",
  SORTED: "sorted",
  NEAR10: "near10",
  NEAR50: "near50",
};

// API paths
export const API_PATHS = {
  STORES: "/stores/",
  SORTED_STORES: "/sorted-stores/",
  STORE_BY_ID: (id) => `/stores/${id}`,
  FIND_NEARBY: (km) => `/find-nearby-stores/${km}`,
};

// IDs
export const TILST_ID = "efba0457-090e-4132-81ba-c72b4c8e7fee";

// Default coordinates 
export const DEFAULT_COORDS = { lat: 56.162387, lon: 10.0078135 };
