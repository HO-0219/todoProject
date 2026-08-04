import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TodoPagePlaceholder } from './TodoPagePlaceholder';
import { CalendarNav } from '../../features/todo/components/CalendarNav';

type DashboardTodo = {
  id: number;
  title: string;
  category: string;
  time?: string;
  done: boolean;
};

const initialTodos: DashboardTodo[] = [
  { id: 1, title: '랜딩 페이지 최종 디자인 확인하기', category: '디자인', time: '10:00', done: true },
  { id: 2, title: '오늘의 우선순위 세 가지 정리하기', category: '집중', time: '11:30', done: true },
  { id: 3, title: '팀원에게 진행 상황 공유하기', category: '협업', time: '14:00', done: false },
  { id: 4, title: '내일 해야 할 일 미리 기록하기', category: '개인', done: false },
];

export function DailyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const requestedDate = searchParams.get('date');
  const parsedDate = requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? new Date(`${requestedDate}T00:00:00`) : today;
  const [selectedDate, setSelectedDate] = useState(parsedDate);
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const completed = todos.filter((todo) => todo.done).length;
  const progress = useMemo(() => Math.round((completed / todos.length) * 100), [completed, todos.length]);
  const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const moveDate = (amount: number) => {
    const next = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + amount);
    setSelectedDate(next); setSearchParams({ date: dateKey(next) });
  };
  const goToToday = () => { setSelectedDate(today); setSearchParams({ date: dateKey(today) }); };
  const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  function toggleTodo(id: number) {
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo));
  }

  function addTodo(event: React.FormEvent) {
    event.preventDefault();
    const title = newTodo.trim();
    if (!title) return;
    setTodos((current) => [...current, { id: Date.now(), title, category: '새 할 일', done: false }]);
    setNewTodo('');
  }

  function editTodo(todo: DashboardTodo) {
    const title = window.prompt('할 일 내용을 수정하세요.', todo.title)?.trim();
    if (!title) return;
    setTodos((current) => current.map((item) => item.id === todo.id ? { ...item, title } : item));
  }

  function removeTodo(id: number) {
    if (window.confirm('이 할 일을 삭제할까요?')) setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return <section className="daily-dashboard">
    <header className="daily-intro">
      <div>
        <p className="daily-kicker">{weekday}</p>
        <h1>좋은 아침이에요,<br /><strong>오늘도 차분하게 시작해 볼까요?</strong></h1>
        <p className="daily-subtitle">작은 완료 하나가 오늘의 흐름을 만듭니다.</p>
      </div>
      <CalendarNav date={selectedDate} label={`${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`} onChange={(date) => { setSelectedDate(date); setSearchParams({ date: dateKey(date) }); }} onPrevious={() => moveDate(-1)} onNext={() => moveDate(1)} onToday={goToToday} todayLabel="오늘" />
    </header>

    <div className="daily-grid">
      <section className="daily-todos-card">
        <div className="daily-card-heading">
          <div><p>MY TASKS</p><h2>오늘의 할 일 <span>{todos.length}</span></h2></div>
          <button className="daily-more" type="button" aria-label="할 일 더보기">•••</button>
        </div>

        <form className="daily-add-form" onSubmit={addTodo}>
          <span>+</span>
          <input value={newTodo} onChange={(event) => setNewTodo(event.target.value)} placeholder="새로운 할 일을 입력하세요" />
          <button type="submit">추가</button>
        </form>

        <div className="daily-todo-list">
          {todos.length === 0 && <TodoPagePlaceholder onAction={() => document.querySelector<HTMLInputElement>('.daily-add-form input')?.focus()} />}
          {todos.map((todo) => <article className={`daily-todo ${todo.done ? 'is-complete' : ''}`} key={todo.id}>
            <button className="daily-check" type="button" onClick={() => toggleTodo(todo.id)} aria-label={`${todo.title} 완료 상태 변경`}>
              {todo.done && '✓'}
            </button>
            <div className="daily-todo-copy"><strong>{todo.title}</strong><span>{todo.category}</span></div>
            {todo.time && <time>{todo.time}</time>}
            <div className="todo-item-actions">
              <button type="button" onClick={() => editTodo(todo)}>수정</button>
              <button className="todo-delete" type="button" onClick={() => removeTodo(todo.id)}>삭제</button>
            </div>
          </article>)}
        </div>
      </section>

      <aside className="daily-side-column">
        <section className="daily-progress-card">
          <p>DAILY PROGRESS</p>
          <div className="daily-progress-main"><strong>{progress}<small>%</small></strong><span>완료한 할 일<br /><b>{completed} / {todos.length}</b></span></div>
          <div className="daily-progress-track"><i style={{ width: `${progress}%` }} /></div>
          <p className="daily-progress-message">{completed === todos.length ? '오늘의 할 일을 모두 끝냈어요!' : '조금만 더 하면 오늘의 계획을 마칠 수 있어요.'}</p>
        </section>

        <section className="daily-focus-card">
          <span className="daily-focus-icon">✦</span>
          <div><p>FOCUS NOTE</p><strong>완벽한 계획보다<br />지금 시작하는 게 중요해요.</strong></div>
          <span className="daily-focus-orbit" />
        </section>
      </aside>
    </div>
  </section>;
}
