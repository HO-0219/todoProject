import { Link } from 'react-router-dom';

const previewTodos = [
  { title: '랜딩 페이지 와이어프레임 정리', tag: '디자인', done: true },
  { title: '오늘의 우선순위 3개 정하기', tag: '집중', done: false },
  { title: '팀원에게 진행 상황 공유하기', tag: '협업', done: false },
];

export function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <nav className="landing-nav" aria-label="주요 메뉴">
          <Link className="landing-logo" to="/">
            <span className="brand-mark">T</span>
            <span>TEAM PROJECT</span>
          </Link>
          <div className="landing-nav-actions">
            <a href="#features">기능 소개</a>
            <Link to="/login">로그인</Link>
            <Link className="landing-nav-cta" to="/signup">무료로 시작하기</Link>
          </div>
        </nav>

        <div className="landing-hero-content">
          <div className="landing-copy">
            <p className="landing-eyebrow">MAKE TODAY COUNT</p>
            <h1>할 일을 정리하고,<br />하루에 집중하세요.</h1>
            <p className="landing-description">
              복잡한 일정은 가볍게 정리하고, 중요한 일에 더 많은 시간을 써보세요.
              팀 프로젝트가 오늘의 흐름을 함께 만들어 드립니다.
            </p>
            <div className="landing-cta-row">
              <Link className="landing-primary-cta" to="/signup">지금 시작하기 <span>→</span></Link>
              <Link className="landing-text-cta" to="/login">이미 계정이 있나요?</Link>
            </div>
            <div className="landing-trust">
              <span className="landing-trust-dots"><i /><i /><i /></span>
              <span>오늘도 나를 위한 시간을 만들어 보세요.</span>
            </div>
          </div>

          <div className="dashboard-preview" aria-label="할 일 관리 화면 미리보기">
            <div className="preview-topbar">
              <span className="preview-logo">T</span>
              <span className="preview-title">오늘의 할 일</span>
              <span className="preview-date">8월 3일, 일요일</span>
            </div>
            <div className="preview-body">
              <div className="preview-progress">
                <div><span>오늘의 진행률</span><strong>67%</strong></div>
                <div className="progress-track"><i /></div>
              </div>
              <div className="preview-list">
                {previewTodos.map((todo) => (
                  <div className={`preview-todo ${todo.done ? 'is-done' : ''}`} key={todo.title}>
                    <span className="preview-check">{todo.done ? '✓' : ''}</span>
                    <span className="preview-todo-title">{todo.title}</span>
                    <span className="preview-tag">{todo.tag}</span>
                  </div>
                ))}
              </div>
              <button className="preview-add" type="button">+ 새 할 일 추가</button>
            </div>
          </div>
        </div>
        <div className="landing-orbit landing-orbit-one" />
        <div className="landing-orbit landing-orbit-two" />
      </section>

      <section className="landing-features" id="features">
        <p className="section-eyebrow">SIMPLE, BUT POWERFUL</p>
        <h2>매일의 계획을 더 선명하게</h2>
        <p className="section-description">필요한 기능만 담아, 계획을 세우는 시간은 줄이고 실행하는 시간은 늘렸습니다.</p>
        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-icon">☀</span>
            <h3>일간 플래너</h3>
            <p>오늘 해야 할 일에 집중하고, 작은 완료를 차곡차곡 쌓아보세요.</p>
          </article>
          <article className="feature-card feature-card-emphasis">
            <span className="feature-icon">▦</span>
            <h3>주간 흐름</h3>
            <p>한 주의 리듬을 한눈에 확인하고, 놓치기 쉬운 일을 미리 챙겨요.</p>
          </article>
          <article className="feature-card">
            <span className="feature-icon">◷</span>
            <h3>월간 목표</h3>
            <p>큰 목표부터 매일의 할 일까지, 나만의 속도로 이어갈 수 있어요.</p>
          </article>
        </div>
      </section>

      <section className="landing-final-cta">
        <p>READY WHEN YOU ARE</p>
        <h2>오늘의 첫 번째 체크를<br />완료해 볼까요?</h2>
        <Link className="landing-primary-cta landing-primary-cta-dark" to="/signup">무료로 시작하기 <span>→</span></Link>
      </section>
    </main>
  );
}
