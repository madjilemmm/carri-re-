"use client";

import { useEffect, useRef, useState } from "react";
import { motionValue, useSpring, useMotionValueEvent } from "framer-motion";

export default function CountUp({
  value,
  className,
  suffix = "",
  stiffness = 220,
  damping = 26,
}: {
  value: number;
  className?: string;
  suffix?: string;
  stiffness?: number;
  damping?: number;
}) {
  const [mv] = useState(() => motionValue(value));
  const spring = useSpring(mv, { stiffness, damping });
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useMotionValueEvent(spring, "change", (latest) => {
    if (spanRef.current) {
      spanRef.current.textContent = `${Math.round(latest).toLocaleString("fr-FR")}${suffix}`;
    }
  });

  return (
    <span ref={spanRef} className={className}>
      {Math.round(value).toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}
