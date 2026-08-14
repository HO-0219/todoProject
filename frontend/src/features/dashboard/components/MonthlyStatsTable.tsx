import type { TodoSummary } from "../utils/dashboardStats";

type MonthlyRow = TodoSummary & { week: number; from: Date; to: Date };

export function MonthlyStatsTable({ rows }: { rows: MonthlyRow[] }) {
  return (
    <section className="dashboard-panel dashboard-monthly-panel">
      <header>
        <div>
          <p>MONTHLY</p>
          <h2>월간 통계</h2>
        </div>
        <span>주차별 완료 현황</span>
      </header>
      <div className="dashboard-table-wrap">
        <table>
          <thead>
            <tr>
              <th>기간</th>
              <th>전체</th>
              <th>완료</th>
              <th>남음</th>
              <th>완료율</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.week}>
                <th>
                  {row.week}주차{" "}
                  <small>
                    {row.from.getMonth() + 1}.{row.from.getDate()}–
                    {row.to.getMonth() + 1}.{row.to.getDate()}
                  </small>
                </th>
                <td>{row.total}</td>
                <td>{row.completed}</td>
                <td>{row.remaining}</td>
                <td>
                  <span className="dashboard-rate">
                    <i style={{ width: `${row.rate}%` }} />
                    {row.rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
