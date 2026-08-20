import type { Todo } from "../types";
import { TodoItemActions } from "./TodoItemActions";
import { TodoEmptyState } from "./TodoEmptyState";
import { isPastDateKey } from "../utils/dateUtils";
import { CalendarExportButton } from "./CalendarExportButton";

type DailyTodoListProps = {
  todos: Todo[];
  onCreate: () => void;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
};

export function DailyTodoList({
  todos,
  onCreate,
  onToggle,
  onEdit,
  onDelete,
}: DailyTodoListProps) {
  return (
    <section className="daily-todos-card">
      <div className="daily-card-heading">
        <div>
          <p>MY TASKS</p>
          <h2>
            오늘의 일정 <span>{todos.length}</span>
          </h2>
        </div>
      </div>

      <div className="todo-primary-actions">
        <button className="todo-add-trigger" type="button" onClick={onCreate}>
          + 일정 추가
        </button>
        <CalendarExportButton />
      </div>

      <div className="daily-todo-list">
        {todos.length === 0 && <TodoEmptyState onAction={onCreate} />}
        {todos.map((todo) => (
          <article
            className={`daily-todo ${todo.completed ? "is-complete" : ""}`}
            key={todo.id}
          >
            <button
              className="daily-check"
              type="button"
              onClick={() => onToggle(todo)}
              disabled={isPastDateKey(todo.todoDate)}
              aria-label={`${todo.title} 완료 상태 변경`}
            >
              {todo.completed && "✓"}
            </button>
            <div className="daily-todo-copy">
              <strong>{todo.title}</strong>
              <span>{todo.description || "일정"}</span>
            </div>
            <TodoItemActions
              todo={todo}
              onEdit={onEdit}
              onDelete={onDelete}
              disabled={isPastDateKey(todo.todoDate)}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
