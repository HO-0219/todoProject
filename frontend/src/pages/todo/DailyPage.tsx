import { todoApi } from '../../features/todo/api/todoApi';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TodoPagePlaceholder } from './TodoPagePlaceholder';
import { CalendarNav } from '../../features/todo/components/CalendarNav';

type DashboardTodo = {
  id: number;
  title: string;
  category: string;
  description: string | null;
  todoDate: string;    //description, todoDate 추가 
  time?: string;
  done: boolean;
};

const initialTodos: DashboardTodo[] = [];

export function DailyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const requestedDate = searchParams.get('date');
  const parsedDate = requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? new Date(`${requestedDate}T00:00:00`) : today;
  const [selectedDate, setSelectedDate] = useState(parsedDate);
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const completed = todos.filter((todo) => todo.done).length;
  const progress = useMemo(() => todos.length === 0
    ? 0
    : Math.round((completed / todos.length) * 100),
  [completed, todos.length],);
  
  const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const moveDate = (amount: number) => {
    const next = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + amount);
    setSelectedDate(next); setSearchParams({ date: dateKey(next) });
  };
  const goToToday = () => { setSelectedDate(today); setSearchParams({ date: dateKey(today) }); };
  
  const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  // 선택한 날짜의 할 일을 DB에서 조회
async function loadTodos() {
  try {
    const selectedDateKey = dateKey(selectedDate);

    const response = await todoApi.findByDateRange(
      selectedDateKey,
      selectedDateKey,
    );

    // 백엔드 형식을 화면에서 사용하는 형식으로 변환
    const dashboardTodos: DashboardTodo[] = response.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description:todo.description,
      todoDate: todo.todoDate,
      category: todo.description || '할 일',
      done: todo.completed,
    }));

    setTodos(dashboardTodos);
  } catch (error) {
    console.error('할 일 조회 실패:', error);
    window.alert('할 일을 불러오지 못했습니다.');
  }
}

// 화면에 처음 들어오거나 선택 날짜가 변경되면 조회
useEffect(() => {
  loadTodos();
}, [selectedDate]);
  
  

  // 체크 버튼을 누르면 백엔드의 완료 상태를 변경
async function toggleTodo(id: number) {
  try {
    const updatedTodo = await todoApi.complete(id);

    // 백엔드가 반환한 completed 값으로 화면 상태 변경
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? { ...todo, done: updatedTodo.completed }
          : todo
      )
    );
  } catch (error) {
    console.error('완료 상태 변경 실패:', error);
    window.alert('완료 상태를 변경하지 못했습니다.');
  }
}

  async function addTodo(event: React.FormEvent) {
  event.preventDefault();

  const title = newTodo.trim();

  if (!title) {
    return;
  }

  try {
    // 입력한 내용을 백엔드에 저장
    const createdTodo = await todoApi.create({
      title,
      description: null,
      todoDate: dateKey(selectedDate),
    });

    // 백엔드가 반환한 Todo를 현재 화면 형식으로 변환
    const dashboardTodo: DashboardTodo = {
      id: createdTodo.id,
      title: createdTodo.title,
      description: createdTodo.description,
      todoDate: createdTodo.todoDate,
      category: createdTodo.description || '할 일',
      done: createdTodo.completed,
    };

    // 저장에 성공한 할 일을 화면 목록에 추가
    setTodos((current) => [...current, dashboardTodo]);
    setNewTodo('');
  } catch (error) {
    console.error('할 일 추가 실패:', error);
    window.alert('할 일을 저장하지 못했습니다.');
  }
}

  // 수정한 할 일 내용을 백엔드와 DB에 저장
async function editTodo(todo: DashboardTodo) {
  const title = window
    .prompt('할 일 내용을 수정하세요.', todo.title)
    ?.trim();

  if (!title) {
    return;
  }

  try {
    const updatedTodo = await todoApi.update(todo.id, {
      title,
      description: todo.description,
      todoDate: todo.todoDate,
    });

    // 백엔드가 반환한 최신 값으로 화면 상태 변경
    setTodos((current) =>
      current.map((item) =>
        item.id === todo.id
          ? {
              ...item,
              title: updatedTodo.title,
              description: updatedTodo.description,
              todoDate: updatedTodo.todoDate,
              category: updatedTodo.description || '할 일',
              done: updatedTodo.completed,
            }
          : item
      )
    );
  } catch (error) {
    console.error('할 일 수정 실패:', error);
    window.alert('할 일을 수정하지 못했습니다.');
  }
}

 // 선택한 할 일을 백엔드와 DB에서 삭제
async function removeTodo(id: number) {
  const confirmed = window.confirm('이 할 일을 삭제할까요?');

  if (!confirmed) {
        return;
  }

  try {
    // DELETE /api/v1/todos/{id} 요청
    await todoApi.remove(id);

    // 삭제 성공 후 화면 목록에서도 제거
    setTodos((current) =>
      current.filter((todo) => todo.id !== id)
    );
  } catch (error) {
    console.error('할 일 삭제 실패:', error);
    window.alert('할 일을 삭제하지 못했습니다.');
  }
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
