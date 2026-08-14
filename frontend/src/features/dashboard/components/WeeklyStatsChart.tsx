import type { TodoSummary } from "../utils/dashboardStats";

type WeeklyStat = TodoSummary & { date: Date };
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export function WeeklyStatsChart({ stats }: { stats: WeeklyStat[] }) {
  const maximum = Math.max(1, ...stats.map((stat) => stat.total));
  return (
    <section className="dashboard-panel dashboard-weekly-panel">
      <header>
        <div>
          <p>WEEKLY</p>
          <h2>주간 통계</h2>
        </div>
        <span>요일별 일정 분포</span>
      </header>
      <div className="dashboard-week-bars">
        {stats.map((stat, index) => (
          <div className="dashboard-week-day" key={toDateLabel(stat.date)}>
            <strong>{stat.total}</strong>
            <div className="dashboard-week-track">
              <i
                style={{
                  height: `${Math.max(8, (stat.total / maximum) * 100)}%`,
                }}
              >
                <b style={{ height: `${stat.rate}%` }} />
              </i>
            </div>
            <span>{weekdays[index]}</span>
            <small>{stat.date.getDate()}일</small>
          </div>
        ))}
      </div>
    </section>
  );
}

const toDateLabel = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
