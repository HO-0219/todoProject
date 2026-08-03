type TodoLoadingProps = {
  message?: string;
};

export function TodoLoading({ message = '할 일을 불러오는 중입니다.' }: TodoLoadingProps) {
  return (
    <div className="todo-state" role="status" aria-live="polite">
      <span className="todo-loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
