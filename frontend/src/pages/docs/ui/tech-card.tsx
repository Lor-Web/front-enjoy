import type { CSSProperties, PointerEvent } from "react";
import { Link } from "react-router";
import type { DocTech } from "@/shared/config/docs";
import { TechIcon } from "@/shared/ui/tech-icon";

function moveSpot(event: PointerEvent<HTMLAnchorElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export function TechCard({ tech }: { tech: DocTech }) {
  return (
    <Link
      to={tech.href}
      onPointerEnter={moveSpot}
      onPointerMove={moveSpot}
      className="group relative isolate flex min-h-60 flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-10 backdrop-blur-xl outline-none transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-18px_color-mix(in_srgb,var(--brand)_40%,transparent)] focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-0 active:scale-[0.99]"
      style={
        {
          "--brand": tech.hex,
          "--spot-x": "50%",
          "--spot-y": "40%",
          backgroundColor: `color-mix(in srgb, ${tech.hex} 10%, transparent)`,
          border: `1px solid color-mix(in srgb, ${tech.hex} 28%, transparent)`,
          boxShadow: `0 18px 40px -24px color-mix(in srgb, ${tech.hex} 28%, transparent)`,
        } as CSSProperties
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 dark:from-white/8 dark:to-black/25"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{
          background: `radial-gradient(260px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, ${tech.hex} 22%, transparent), transparent 72%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{
          background: `radial-gradient(200px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, ${tech.hex} 55%, transparent), transparent 55%)`,
          padding: 1,
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />
      <TechIcon
        id={tech.id}
        className="relative size-20 drop-shadow-[0_8px_20px_color-mix(in_srgb,var(--brand)_35%,transparent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        style={{ color: tech.hex }}
      />
      <span className="relative mt-4 font-serif text-3xl tracking-tight">
        {tech.title}
      </span>
      <span className="text-muted-foreground relative mt-2 max-w-[16rem] text-center text-sm leading-5">
        {tech.description}
      </span>
    </Link>
  );
}
