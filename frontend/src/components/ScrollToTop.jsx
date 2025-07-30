import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, key } = useLocation();

  useEffect(() => {
    // Force scroll to top every time the location key changes (even on back/forward)
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [key]); // key changes on every navigation including POP

  return null;
};

export default ScrollToTop;
