import { useMemo, useState } from 'react';
import { CalendarNav } from '../../features/todo/components/CalendarNav';
import { TodoPagePlaceholder } from './TodoPagePlaceholder';

type WeeklyTodo = { id: number; day: number; title: string; done: boolean };
const days = ['일', '월', '화', '수', '목', '금', '토'];
const initialTodos: WeeklyTodo[] = [{ id: 1, day: 0, title: '주간 우선순위 정리', done: true }, { id: 2, day: 2, title: '팀 스탠드업 미팅', done: false }, { id: 3, day: 5, title: '주간 회고 작성', done: false }];
const addDays = (date: Date, daysToAdd: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysToAdd);
const startOfWeek = (date: Date) => addDays(date, -date.getDay());

export function WeeklyPage() {
  const today = useMemo(() => new Date(), []); const [selectedDate, setSelectedDate] = useState(today); const [todos, setTodos] = useState(initialTodos); const [title, setTitle] = useState(''); const [day, setDay] = useState(0);
  const weekStart = startOfWeek(selectedDate); const weekDates = days.map((_, index) => addDays(weekStart, index)); const completed = todos.filter((todo) => todo.done).length;
  const moveWeek = (amount: number) => setSelectedDate(addDays(selectedDate, amount * 7));
  function addTodo(event: React.FormEvent) { event.preventDefault(); if (!title.trim()) return; setTodos((current) => [...current, { id: Date.now(), day, title: title.trim(), done: false }]); setTitle(''); }
  function toggle(id: number) { setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo)); }
  function edit(todo: WeeklyTodo) { const value = window.prompt('할 일 내용을 수정하세요.', todo.title)?.trim(); if (value) setTodos((current) => current.map((item) => item.id === todo.id ? { ...item, title: value } : item)); }
  function remove(id: number) { if (window.confirm('이 할 일을 삭제할까요?')) setTodos((current) => current.filter((todo) => todo.id !== id)); }
  const label = `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekDates[6].getMonth() + 1}월 ${weekDates[6].getDate()}일`;
  return <section className="planner-page weekly-planner"><header className="planner-intro"><div><p>WEEKLY PLANNER</p><h1>이번 주의 흐름을<br /><strong>한눈에 정리하세요.</strong></h1><span>완료 {completed}개 · 남은 할 일 {todos.length - completed}개</span></div><CalendarNav date={selectedDate} label={label} onChange={setSelectedDate} onPrevious={() => moveWeek(-1)} onNext={() => moveWeek(1)} onToday={() => setSelectedDate(today)} todayLabel="이번 주" /></header><form className="planner-add-bar" onSubmit={addTodo}><select value={day} onChange={(event) => setDay(Number(event.target.value))}>{days.map((item, index) => <option value={index} key={item}>{item}요일</option>)}</select><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="이번 주에 할 일을 추가하세요" /><button type="submit">+ 할 일 추가</button></form>{todos.length === 0 ? <TodoPagePlaceholder onAction={() => document.querySelector<HTMLInputElement>('.planner-add-bar input')?.focus()} /> : <div className="week-grid">{days.map((item, index) => <section className={`week-day-card ${index === 0 ? 'is-sunday' : ''}`} key={item}><header><span>{item}</span><strong>{weekDates[index].getDate()}</strong></header><div>{todos.filter((todo) => todo.day === index).map((todo) => <article className={`week-todo ${todo.done ? 'is-complete' : ''}`} key={todo.id}><button className="daily-check" type="button" onClick={() => toggle(todo.id)}>{todo.done && '✓'}</button><strong>{todo.title}</strong><div className="todo-item-actions"><button type="button" onClick={() => edit(todo)}>수정</button><button className="todo-delete" type="button" onClick={() => remove(todo.id)}>삭제</button></div></article>)}</div><button className="week-add-day" type="button" onClick={() => { setDay(index); document.querySelector<HTMLInputElement>('.planner-add-bar input')?.focus(); }}>+ 추가</button></section>)}</div>}</section>;
}
