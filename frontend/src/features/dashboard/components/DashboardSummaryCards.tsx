import type { TodoSummary } from "../utils/dashboardStats";

export function DashboardSummaryCards({ summary }: { summary: TodoSummary }) {
  const cards = [
    ["전체 일정", summary.total, "이번 달 등록한 일정"],
    ["완료 일정", summary.completed, "차근차근 완료했어요"],
    ["남은 일정", summary.remaining, "앞으로 진행할 일정"],
    ["완료율", `${summary.rate}%`, "이번 달 달성률"],
  ];
  return (
    <div className="dashboard-summary-grid">
      {cards.map(([label, value, description]) => (
        <article className="dashboard-summary-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}
