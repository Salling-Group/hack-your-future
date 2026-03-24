import React from "react";

export default function ActionButton({
  variant = "solid",
  loading = false,
  active = false,
  children,
  onClick,
}) {
  const className = [
    "menu-btn",
    variant === "outline" ? "outline" : "",
    loading ? "loading" : "",
    active ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={className}
      disabled={loading}
      aria-busy={loading}
      onClick={onClick}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}