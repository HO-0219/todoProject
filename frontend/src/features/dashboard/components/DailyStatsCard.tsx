import type { Todo } from "../../todo/types";
import { summarizeTodos } from "../utils/dashboardStats";

export function DailyStatsCard({ todos }: { todos: Todo[] }) {
  const summary = summarizeTodos(todos);
  return (
    <section className="dashboard-panel dashboard-daily-panel">
      <header>
        <div>
          <p>DAILY</p>
          <h2>오늘의 통계</h2>
        </div>
        <span>
          {summary.completed}/{summary.total} 완료
        </span>
      </header>
      <div className="dashboard-daily-progress">
        <strong>
          {summary.rate}
          <small>%</small>
        </strong>
        <div>
          <span>오늘의 완료율</span>
          <div>
            <i style={{ width: `${summary.rate}%` }} />
          </div>
        </div>
      </div>
      <ul>
        {todos.length === 0 ? (
          <li className="is-empty">오늘 등록된 일정이 없습니다.</li>
        ) : (
          todos.slice(0, 4).map((todo) => (
            <li key={todo.id}>
              <span className={todo.completed ? "is-complete" : ""}>
                {todo.completed ? "✓" : "○"}
              </span>
              <strong>{todo.title}</strong>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
