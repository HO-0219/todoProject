import { useMemo } from "react";
import { DailyStatsCard } from "../features/dashboard/components/DailyStatsCard";
import { DashboardSummaryCards } from "../features/dashboard/components/DashboardSummaryCards";
import { MonthlyStatsTable } from "../features/dashboard/components/MonthlyStatsTable";
import { WeeklyStatsChart } from "../features/dashboard/components/WeeklyStatsChart";
import {
  createMonthlyRows,
  createWeeklyStats,
  summarizeTodos,
  todosBetween,
} from "../features/dashboard/utils/dashboardStats";
import { useTodos } from "../features/todo/hooks/useTodos";
import {
  addDays,
  startOfWeek,
  toDateKey,
} from "../features/todo/utils/dateUtils";

export function DashboardPage() {
  const today = useMemo(() => new Date(), []);
  const monthStart = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  );
  const monthEnd = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + 1, 0),
    [today],
  );
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 6);
  const rangeStart = weekStart < monthStart ? weekStart : monthStart;
  const rangeEnd = weekEnd > monthEnd ? weekEnd : monthEnd;
  const { todos, loading } = useTodos({
    from: toDateKey(rangeStart),
    to: toDateKey(rangeEnd),
    rangeLabel: "대시보드",
  });
  const monthlyTodos = todosBetween(todos, monthStart, monthEnd);
  const todayTodos = todos.filter((todo) => todo.todoDate === toDateKey(today));

  return (
    <section className="personal-dashboard">
      <header className="dashboard-intro">
        <div>
          <p>PERSONAL DASHBOARD</p>
          <h1>
            나의 일정 흐름을
            <br />
            <strong>한눈에 확인하세요.</strong>
          </h1>
          <span>
            {today.getFullYear()}년 {today.getMonth() + 1}월 일정 통계입니다.
          </span>
        </div>
        <div className="dashboard-date-badge">
          <span>오늘</span>
          <strong>
            {today.getMonth() + 1}월 {today.getDate()}일
          </strong>
        </div>
      </header>

      {loading ? (
        <div className="dashboard-loading">통계를 불러오는 중입니다.</div>
      ) : (
        <>
          <DashboardSummaryCards summary={summarizeTodos(monthlyTodos)} />
          <div className="dashboard-main-grid">
            <MonthlyStatsTable rows={createMonthlyRows(monthlyTodos, today)} />
            <DailyStatsCard todos={todayTodos} />
          </div>
          <WeeklyStatsChart stats={createWeeklyStats(todos, today)} />
        </>
      )}
    </section>
  );
}
