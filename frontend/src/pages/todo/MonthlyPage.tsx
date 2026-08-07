import { useCallback, useEffect,useMemo, useState } from 'react';
import { todoApi } from '../../features/todo/api/todoApi';
import type { Todo } from '../../features/todo/types';
import { useNavigate } from 'react-router-dom';
import { TodoPagePlaceholder } from './TodoPagePlaceholder';
import { CalendarNav } from '../../features/todo/components/CalendarNav';


const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const createDate = (year: number, month: number, day: number) => new Date(year, month, day);
const toDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function MonthlyPage() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => createDate(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [title, setTitle] = useState('');

  // 백엔드에서 조회한 월간 Todo 목록
const [todos, setTodos] = useState<Todo[]>([]);

  const calendarDates = useMemo(() => {
    const firstDay = createDate(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const firstVisible = createDate(viewDate.getFullYear(), viewDate.getMonth(), 1 - firstDay.getDay());
    return Array.from({ length: 42 }, (_, index) => createDate(firstVisible.getFullYear(), firstVisible.getMonth(), firstVisible.getDate() + index));
  }, [viewDate]);

  // 현재 보고 있는 달의 Todo 목록을 DB에서 조회
const loadMonthlyTodos = useCallback(async () => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const from = toDateKey(createDate(year, month, 1));
  const to = toDateKey(createDate(year, month + 1, 0));

  try {
    const result = await todoApi.findByDateRange(from, to);
    setTodos(result);
  } catch (error) {
    console.error('월간 Todo 조회 실패:', error);
    window.alert('월간 할 일을 불러오지 못했습니다.');
  }
}, [viewDate]);
// 월간 화면을 처음 열거나 조회 월이 바뀌면 다시 조회
useEffect(() => {
  void loadMonthlyTodos();
}, [loadMonthlyTodos]);

  const sameDay = (a: Date, b: Date) => toDateKey(a) === toDateKey(b);
  const moveMonth = (amount: number) => { const next = createDate(viewDate.getFullYear(), viewDate.getMonth() + amount, 1); setViewDate(next); setSelectedDate(next); };
  const goToToday = () => { setViewDate(createDate(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(today); };
  function selectDate(date: Date) { setSelectedDate(date); if (date.getMonth() !== viewDate.getMonth()) setViewDate(createDate(date.getFullYear(), date.getMonth(), 1)); }
  
  
  // 선택한 날짜에 Todo 등록
async function addTodo(event: React.FormEvent) {
  event.preventDefault();

  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  try {
    await todoApi.create({
      title: trimmedTitle,
      description: null,
      todoDate: toDateKey(selectedDate),
    });

    setTitle('');
    await loadMonthlyTodos();
  } catch (error) {
    console.error('Todo 등록 실패:', error);
    window.alert('할 일을 추가하지 못했습니다.');
  }
}

// 미완료 Todo를 완료 상태로 변경
async function toggleTodo(todo: Todo) {
  if (todo.completed) {
    window.alert('완료된 할 일은 현재 다시 미완료로 변경할 수 없습니다.');
    return;
  }

  try {
    await todoApi.complete(todo.id);
    await loadMonthlyTodos();
  } catch (error) {
    console.error('Todo 완료 처리 실패:', error);
    window.alert('완료 상태를 변경하지 못했습니다.');
  }
}

// Todo 제목 수정
async function editTodo(todo: Todo) {
  const nextTitle = window
    .prompt('할 일 내용을 수정하세요.', todo.title)
    ?.trim();

  if (!nextTitle) return;

  try {
    await todoApi.update(todo.id, {
      title: nextTitle,
      description: todo.description,
      todoDate: todo.todoDate,
    });

    await loadMonthlyTodos();
  } catch (error) {
    console.error('Todo 수정 실패:', error);
    window.alert('할 일을 수정하지 못했습니다.');
  }
}
  
  
  // Todo 삭제
async function removeTodo(id: number) {
  if (!window.confirm('이 할 일을 삭제할까요?')) return;

  try {
    await todoApi.remove(id);
    await loadMonthlyTodos();
  } catch (error) {
    console.error('Todo 삭제 실패:', error);
    window.alert('할 일을 삭제하지 못했습니다.');
  }
}

  return <section className="planner-page monthly-planner">
    <header className="planner-intro"><div><p>MONTHLY CALENDAR</p><h1>한 달의 계획을<br /><strong>여유 있게 이어가세요.</strong></h1><span>날짜를 선택하면 해당 일간 화면으로 바로 이동할 수 있어요.</span></div><CalendarNav date={selectedDate} label={`${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`} onChange={selectDate} onPrevious={() => moveMonth(-1)} onNext={() => moveMonth(1)} onToday={goToToday} todayLabel="이번 달" /></header>
    <form className="planner-add-bar" onSubmit={addTodo}><span className="selected-date-label">{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="선택한 날짜에 새 할 일을 추가하세요" /><button type="submit">+ 할 일 추가</button></form>
    
    {todos.length === 0 && (<TodoPagePlaceholder onAction={() =>document.querySelector<HTMLInputElement>('.planner-add-bar input')?.focus()}/>)} 
    
     <div className="month-calendar"><div className="month-weekdays">{weekdays.map((day, index) => <span className={index === 0 ? 'is-sunday' : ''} key={day}>{day}</span>)}</div><div className="month-grid">{calendarDates.map((date) => {
      const dateKey = toDateKey(date); const dayTodos = todos.filter((todo) => todo.todoDate === dateKey); const isCurrentMonth = date.getMonth() === viewDate.getMonth();
      return <section className={`month-day ${sameDay(date, today) ? 'is-today' : ''} ${isCurrentMonth ? '' : 'is-other-month'} ${sameDay(date, selectedDate) ? 'is-selected' : ''}`} key={dateKey}><header><button className="month-date-button" type="button" onClick={() => selectDate(date)}>{date.getDate()}</button><button type="button" aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일 일간 화면으로 이동`} onClick={() => navigate(`/day?date=${dateKey}`)}>↗</button></header>{dayTodos.slice(0, 3).map((todo) => <article className={`month-todo ${todo.completed ? 'is-complete' : ''}`} key={todo.id}><button type="button" onClick={() => void toggleTodo(todo)}>{todo.completed ? '✓' : '○'}</button><strong>{todo.title}</strong><div className="todo-item-actions"><button type="button" onClick={() => void editTodo(todo)}>수정</button><button className="todo-delete" type="button" onClick={() => void removeTodo(todo.id)}>삭제</button></div></article>)}{dayTodos.length > 3 && <button className="month-more-count" type="button" onClick={() => navigate(`/day?date=${dateKey}`)}>외 {dayTodos.length - 3}개</button>}</section>;
    })}</div></div>
  </section>;
}
