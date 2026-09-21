import { useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { scrollToHash } from "@/shared/lib/scroll-to-hash";

export function ScrollOnNavigate() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    history.scrollRestoration = "manual";
    void pathname;
    if (hash) {
      scrollToHash(hash);
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
