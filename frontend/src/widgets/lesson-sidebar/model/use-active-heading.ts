import { useEffect, useState } from "react";

export function useActiveHeading(ids: string[]) {
  const key = ids.join("|");
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const list = key.length > 0 ? key.split("|") : [];
    if (list.length === 0) {
      return;
    }

    const update = () => {
      const offset = 112;
      const { scrollHeight } = document.documentElement;
      const canScroll = scrollHeight > window.innerHeight + 8;
      const scrolledToEnd =
        canScroll && window.innerHeight + window.scrollY >= scrollHeight - 24;

      if (scrolledToEnd) {
        setActiveId(list[list.length - 1]);
        return;
      }

      let current = list[0];
      for (const id of list) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActiveId(current);
    };

    update();
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, [key]);

  return activeId;
}
