type DailySummaryProps = {
  completed: number;
  total: number;
};

export function DailySummary({ completed, total }: DailySummaryProps) {
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <aside className="daily-side-column">
      <section className="daily-progress-card">
        <p>DAILY PROGRESS</p>
        <div className="daily-progress-main">
          <strong>
            {progress}
            <small>%</small>
          </strong>
          <span>
            완료한 일정
            <br />
            <b>
              {completed} / {total}
            </b>
          </span>
        </div>
        <div className="daily-progress-track">
          <i style={{ width: `${progress}%` }} />
        </div>
        <p className="daily-progress-message">
          {total > 0 && completed === total
            ? "오늘의 일정을 모두 끝냈어요!"
            : "조금만 더 하면 오늘의 계획을 마칠 수 있어요."}
        </p>
      </section>

      <section className="daily-focus-card">
        <span className="daily-focus-icon">✦</span>
        <div>
          <p>FOCUS NOTE</p>
          <strong>
            완벽한 계획보다
            <br />
            지금 시작하는 게 중요해요.
          </strong>
        </div>
        <span className="daily-focus-orbit" />
      </section>
    </aside>
  );
}
