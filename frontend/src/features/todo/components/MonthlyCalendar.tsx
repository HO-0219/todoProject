import { useNavigate } from "react-router-dom";
import type { Todo } from "../types";
import { isPastDateKey, sameDay, toDateKey } from "../utils/dateUtils";
import { TodoItemActions } from "./TodoItemActions";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

type MonthlyCalendarProps = {
  dates: Date[];
  todos: Todo[];
  today: Date;
  viewDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
};

export function MonthlyCalendar({
  dates,
  todos,
  today,
  viewDate,
  selectedDate,
  onSelectDate,
  onToggle,
  onEdit,
  onDelete,
}: MonthlyCalendarProps) {
  const navigate = useNavigate();
  return (
    <div className="month-calendar">
      <div className="month-weekdays">
        {weekdays.map((weekday, index) => (
          <span className={index === 0 ? "is-sunday" : ""} key={weekday}>
            {weekday}
          </span>
        ))}
      </div>
      <div className="month-grid">
        {dates.map((date) => {
          const dateKey = toDateKey(date);
          const isPastDate = isPastDateKey(dateKey);
          const dayTodos = todos.filter((todo) => todo.todoDate === dateKey);
          return (
            <section
              className={`month-day ${sameDay(date, today) ? "is-today" : ""} ${date.getMonth() === viewDate.getMonth() ? "" : "is-other-month"} ${sameDay(date, selectedDate) ? "is-selected" : ""}`}
              key={dateKey}
            >
              <header>
                <button
                  className="month-date-button"
                  type="button"
                  onClick={() => onSelectDate(date)}
                  disabled={isPastDate}
                >
                  {date.getDate()}
                </button>
                <button
                  type="button"
                  aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일 일간 화면으로 이동`}
                  onClick={() => navigate(`/day?date=${dateKey}`)}
                  disabled={isPastDate}
                >
                  →
                </button>
              </header>
              {dayTodos.slice(0, 3).map((todo) => (
                <article
                  className={`month-todo ${todo.completed ? "is-complete" : ""}`}
                  key={todo.id}
                >
                  <button
                    type="button"
                    onClick={() => onToggle(todo)}
                    disabled={isPastDateKey(todo.todoDate)}
                  >
                    {todo.completed ? "✓" : "○"}
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
              {dayTodos.length > 3 && (
                <button
                  className="month-more-count"
                  type="button"
                  onClick={() => navigate(`/day?date=${dateKey}`)}
                >
                  +{dayTodos.length - 3}개
                </button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
