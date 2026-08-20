import { useEffect, useRef } from "react";
import type { Todo } from "../types";
import { toDateKey } from "../utils/dateUtils";
import { isPastDateKey } from "../utils/dateUtils";
import { TodoItemActions } from "./TodoItemActions";

export const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

type WeeklyGridProps = {
  dates: Date[];
  todos: Todo[];
  onCreate: (dayIndex: number) => void;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
};

export function WeeklyGrid({
  dates,
  todos,
  onCreate,
  onToggle,
  onEdit,
  onDelete,
}: WeeklyGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const todayIndex = dates.findIndex(
      (date) => toDateKey(date) === toDateKey(new Date()),
    );
    if (todayIndex < 0) {
      grid.scrollLeft = 0;
      return;
    }
    const todayCard = grid.children.item(todayIndex) as HTMLElement | null;
    if (todayCard) grid.scrollLeft = todayCard.offsetLeft - grid.offsetLeft;
  }, [dates]);

  return (
    <div className="week-grid" ref={gridRef}>
      {weekdays.map((weekday, index) => (
        <section
          className={`week-day-card ${index === 0 ? "is-sunday" : ""}`}
          key={weekday}
        >
          <header>
            <span>{weekday}</span>
            <strong>{dates[index].getDate()}</strong>
          </header>
          <div>
            {todos
              .filter((todo) => todo.todoDate === toDateKey(dates[index]))
              .map((todo) => (
                <article
                  className={`week-todo ${todo.completed ? "is-complete" : ""}`}
                  key={todo.id}
                >
                  <button
                    className="daily-check"
                    type="button"
                    onClick={() => onToggle(todo)}
                    disabled={isPastDateKey(todo.todoDate)}
                  >
                    {todo.completed && "✓"}
                  </button>
                  <strong>{todo.title}</strong>
                  <TodoItemActions
                    todo={todo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    disabled={isPastDateKey(todo.todoDate)}
                  />
                </article>
              ))}
          </div>
          {!isPastDateKey(toDateKey(dates[index])) && (
            <button
              className="week-add-day"
              type="button"
              onClick={() => onCreate(index)}
            >
              + 추가
            </button>
          )}
        </section>
      ))}
    </div>
  );
}
