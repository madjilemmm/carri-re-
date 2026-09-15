// Shared motion presets so every interactive element in the game feels
// consistent: springy and fast rather than linear and slow.

export const springSnappy = { type: "spring", stiffness: 420, damping: 28, mass: 0.7 } as const;
export const springPop = { type: "spring", stiffness: 380, damping: 22, mass: 0.6 } as const;
export const springSoft = { type: "spring", stiffness: 300, damping: 30 } as const;
export const springBouncy = { type: "spring", stiffness: 450, damping: 18, mass: 0.5 } as const;

export const fadeFast = { duration: 0.15, ease: [0.16, 1, 0.3, 1] } as const;
export const fadeCalm = { duration: 0.22, ease: [0.16, 1, 0.3, 1] } as const;

export const tapScale = { scale: 0.95 };
export const tapScaleSubtle = { scale: 0.97 };
export const hoverLift = { y: -2 };

export const pageTransition = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: springSoft,
};

export const shakeX = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.4, ease: "easeInOut" as const },
};
