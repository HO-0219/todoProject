type TodoEmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "empty" | "error";
};

export function TodoEmptyState({
  title = "아직 등록한 일정이 없어요.",
  description = "작은 일정부터 하나씩 추가해 오늘의 흐름을 만들어 보세요.",
  actionLabel = "새 일정 추가",
  onAction,
  variant = "empty",
}: TodoEmptyStateProps) {
  const isError = variant === "error";
  return (
    <section
      className={`todo-empty-state ${isError ? "is-error" : ""}`}
      role={isError ? "alert" : undefined}
    >
      <span className="todo-empty-icon" aria-hidden="true">
        {isError ? "!" : "✓"}
      </span>
      <strong>{isError ? "일정을 불러오지 못했어요." : title}</strong>
      <p>
        {isError
          ? "네트워크 상태를 확인한 후 다시 시도해 주세요."
          : description}
      </p>
      {onAction && (
        <button className="todo-empty-action" type="button" onClick={onAction}>
          {isError ? "다시 시도하기" : actionLabel}
        </button>
      )}
    </section>
  );
}
