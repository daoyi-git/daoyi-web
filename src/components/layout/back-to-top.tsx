"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="回到頂端"
      className={`fixed bottom-5 right-5 z-40 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-warm-lg outline-none transition-all duration-300 hover:bg-primary-deep focus-visible:ring-2 focus-visible:ring-primary/50 md:bottom-6 md:right-6 md:size-11 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
