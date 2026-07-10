import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    
    // Set initial state
    setIsMobile(media.matches);
    
    // Add listener
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}
