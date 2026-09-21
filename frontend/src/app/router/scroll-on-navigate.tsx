import { useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { scrollToHash } from "@/shared/lib/scroll-to-hash";

export function ScrollOnNavigate() {
  const location = useLocation();

  useLayoutEffect(() => {
    history.scrollRestoration = "manual";
    if (location.hash) {
      scrollToHash(location.hash);
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}
