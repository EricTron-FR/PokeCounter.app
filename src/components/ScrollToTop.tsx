import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top on every route change. Needed because
 * React Router preserves scroll position by default — when you click a
 * footer link at the bottom of /pokedex, you'd land at the bottom of the
 * new page without this.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}
