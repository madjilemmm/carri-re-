export default function ClubBadge({
  label,
  size = "md",
}: {
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };
  return (
    <div
      className={`${sizes[size]} shrink-0 rounded-lg border border-purple/30 bg-purple/[0.07] text-purple flex items-center justify-center font-bold tracking-wide transition-colors`}
      aria-hidden
    >
      {label}
    </div>
  );
}
