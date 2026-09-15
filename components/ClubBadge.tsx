export default function ClubBadge({
  label,
  revealed,
  size = "md",
}: {
  label: string;
  revealed: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };
  return (
    <div
      className={`${sizes[size]} shrink-0 rounded-lg border flex items-center justify-center font-bold tracking-wide ${
        revealed
          ? "border-purple/40 bg-purple/10 text-purple"
          : "border-border bg-surface text-text-secondary"
      }`}
      aria-hidden
    >
      {revealed ? label : "?"}
    </div>
  );
}
