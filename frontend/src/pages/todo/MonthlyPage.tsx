import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodoPagePlaceholder } from './TodoPagePlaceholder';
import { CalendarNav } from '../../features/todo/components/CalendarNav';

type MonthlyTodo = { id: number; date: string; title: string; done: boolean };
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const createDate = (year: number, month: number, day: number) => new Date(year, month, day);
const toDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function MonthlyPage() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => createDate(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<MonthlyTodo[]>(() => [
    { id: 1, date: toDateKey(today), title: '오늘의 계획 정리', done: true },
    { id: 2, date: toDateKey(createDate(today.getFullYear(), today.getMonth(), Math.min(today.getDate() + 2, 28))), title: '중간 발표 자료 준비', done: false },
    { id: 3, date: toDateKey(createDate(today.getFullYear(), today.getMonth(), Math.min(today.getDate() + 8, 28))), title: '팀 회의', done: false },
  ]);

  const calendarDates = useMemo(() => {
    const firstDay = createDate(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const firstVisible = createDate(viewDate.getFullYear(), viewDate.getMonth(), 1 - firstDay.getDay());
    return Array.from({ length: 42 }, (_, index) => createDate(firstVisible.getFullYear(), firstVisible.getMonth(), firstVisible.getDate() + index));
  }, [viewDate]);
  const sameDay = (a: Date, b: Date) => toDateKey(a) === toDateKey(b);
  const moveMonth = (amount: number) => { const next = createDate(viewDate.getFullYear(), viewDate.getMonth() + amount, 1); setViewDate(next); setSelectedDate(next); };
  const goToToday = () => { setViewDate(createDate(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(today); };
  function selectDate(date: Date) { setSelectedDate(date); if (date.getMonth() !== viewDate.getMonth()) setViewDate(createDate(date.getFullYear(), date.getMonth(), 1)); }
  function addTodo(event: React.FormEvent) { event.preventDefault(); if (!title.trim()) return; setTodos((current) => [...current, { id: Date.now(), date: toDateKey(selectedDate), title: title.trim(), done: false }]); setTitle(''); }
  function toggleTodo(id: number) { setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo)); }
  function editTodo(todo: MonthlyTodo) { const next = window.prompt('할 일 내용을 수정하세요.', todo.title)?.trim(); if (next) setTodos((current) => current.map((item) => item.id === todo.id ? { ...item, title: next } : item)); }
  function removeTodo(id: number) { if (window.confirm('이 할 일을 삭제할까요?')) setTodos((current) => current.filter((todo) => todo.id !== id)); }

  return <section className="planner-page monthly-planner">
    <header className="planner-intro"><div><p>MONTHLY CALENDAR</p><h1>한 달의 계획을<br /><strong>여유 있게 이어가세요.</strong></h1><span>날짜를 선택하면 해당 일간 화면으로 바로 이동할 수 있어요.</span></div><CalendarNav date={selectedDate} label={`${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`} onChange={selectDate} onPrevious={() => moveMonth(-1)} onNext={() => moveMonth(1)} onToday={goToToday} todayLabel="이번 달" /></header>
    <form className="planner-add-bar" onSubmit={addTodo}><span className="selected-date-label">{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="선택한 날짜에 새 할 일을 추가하세요" /><button type="submit">+ 할 일 추가</button></form>
    {todos.length === 0 ? <TodoPagePlaceholder onAction={() => document.querySelector<HTMLInputElement>('.planner-add-bar input')?.focus()} /> : <div className="month-calendar"><div className="month-weekdays">{weekdays.map((day, index) => <span className={index === 0 ? 'is-sunday' : ''} key={day}>{day}</span>)}</div><div className="month-grid">{calendarDates.map((date) => {
      const dateKey = toDateKey(date); const dayTodos = todos.filter((todo) => todo.date === dateKey); const isCurrentMonth = date.getMonth() === viewDate.getMonth();
      return <section className={`month-day ${sameDay(date, today) ? 'is-today' : ''} ${isCurrentMonth ? '' : 'is-other-month'} ${sameDay(date, selectedDate) ? 'is-selected' : ''}`} key={dateKey}><header><button className="month-date-button" type="button" onClick={() => selectDate(date)}>{date.getDate()}</button><button type="button" aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일 일간 화면으로 이동`} onClick={() => navigate(`/day?date=${dateKey}`)}>↗</button></header>{dayTodos.slice(0, 3).map((todo) => <article className={`month-todo ${todo.done ? 'is-complete' : ''}`} key={todo.id}><button type="button" onClick={() => toggleTodo(todo.id)}>{todo.done ? '✓' : '○'}</button><strong>{todo.title}</strong><div className="todo-item-actions"><button type="button" onClick={() => editTodo(todo)}>수정</button><button className="todo-delete" type="button" onClick={() => removeTodo(todo.id)}>삭제</button></div></article>)}{dayTodos.length > 3 && <button className="month-more-count" type="button" onClick={() => navigate(`/day?date=${dateKey}`)}>외 {dayTodos.length - 3}개</button>}</section>;
    })}</div></div>}
  </section>;
}
