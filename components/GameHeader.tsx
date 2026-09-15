export default function GameHeader({
  levelLabel,
  questionIndex,
  totalQuestions,
  score,
  streak,
}: {
  levelLabel: string;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
}) {
  const progress = (questionIndex / totalQuestions) * 100;
  return (
    <div className="border-b border-border px-4 md:px-8 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold">Carrière<span className="text-purple">.</span></span>
          <span className="text-text-secondary hidden sm:inline">{levelLabel}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary">
            Question {questionIndex}/{totalQuestions}
          </span>
          <span className="font-semibold">{score} pts</span>
          {streak > 0 && (
            <span className="text-purple font-semibold">Série {streak}</span>
          )}
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-2 h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-purple transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
