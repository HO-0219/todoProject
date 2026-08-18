import type { Todo } from "../types";

type TodoItemActionsProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  disabled?: boolean;
};

export function TodoItemActions({
  todo,
  onEdit,
  onDelete,
  disabled = false,
}: TodoItemActionsProps) {
  return (
    <div className="todo-item-actions">
      <button type="button" onClick={() => onEdit(todo)} disabled={disabled}>
        수정
      </button>
      <button
        className="todo-delete"
        type="button"
        onClick={() => onDelete(todo.id)}
        disabled={disabled}
      >
        삭제
      </button>
    </div>
  );
}
