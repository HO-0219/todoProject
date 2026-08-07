import { useCallback, useEffect,useMemo, useState } from 'react';
import { CalendarNav } from '../../features/todo/components/CalendarNav';
import { todoApi } from '../../features/todo/api/todoApi';
import type { Todo } from '../../features/todo/types';
import { TodoPagePlaceholder } from './TodoPagePlaceholder';


const days = ['일', '월', '화', '수', '목', '금', '토'];

const addDays = (date: Date, daysToAdd: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysToAdd);
const startOfWeek = (date: Date) => addDays(date, -date.getDay());

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;


export function WeeklyPage() {
  const today = useMemo(() => new Date(), []); const [selectedDate, setSelectedDate] = useState(today); const [todos, setTodos] = useState<Todo[]>([]); const [title, setTitle] = useState(''); const [day, setDay] = useState(0);
  const weekStart = startOfWeek(selectedDate); 
  const weekDates = days.map((_, index) => addDays(weekStart, index)); 

  // 현재 선택된 주의 Todo를 DB에서 조회
const loadWeeklyTodos = useCallback(async () => {
  const currentWeekStart = startOfWeek(selectedDate);
  const currentWeekEnd = addDays(currentWeekStart, 6);

  try {
    const result = await todoApi.findByDateRange(
      toDateKey(currentWeekStart),
      toDateKey(currentWeekEnd),
    );

    setTodos(result);
  } catch (error) {
    console.error('주간 Todo 조회 실패:', error);
    window.alert('주간 할 일을 불러오지 못했습니다.');
  }
}, [selectedDate]);

// 첫 진입 또는 주간 이동 시 다시 조회
useEffect(() => {
  void loadWeeklyTodos();
}, [loadWeeklyTodos]);
  
  const completed = todos.filter((todo) => todo.completed).length;
  const moveWeek = (amount: number) => setSelectedDate(addDays(selectedDate, amount * 7));
  
  
  // 선택한 요일에 Todo 등록
async function addTodo(event: React.FormEvent) {
  event.preventDefault();

  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  try {
    await todoApi.create({
      title: trimmedTitle,
      description: null,
      todoDate: toDateKey(weekDates[day]),
    });

    setTitle('');
    await loadWeeklyTodos();
  } catch (error) {
    console.error('주간 Todo 등록 실패:', error);
    window.alert('할 일을 추가하지 못했습니다.');
  }
}

// 미완료 Todo를 완료 처리
async function completeTodo(todo: Todo) {
  if (todo.completed) {
    window.alert('완료된 할 일은 현재 다시 미완료로 변경할 수 없습니다.');
    return;
  }

  try {
    await todoApi.complete(todo.id);
    await loadWeeklyTodos();
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

    await loadWeeklyTodos();
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
    await loadWeeklyTodos();
  } catch (error) {
    console.error('Todo 삭제 실패:', error);
    window.alert('할 일을 삭제하지 못했습니다.');
  }
}
  
  
  const label = `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekDates[6].getMonth() + 1}월 ${weekDates[6].getDate()}일`;
  return <section className="planner-page weekly-planner"><header className="planner-intro"><div><p>WEEKLY PLANNER</p><h1>이번 주의 흐름을<br /><strong>한눈에 정리하세요.</strong></h1><span>완료 {completed}개 · 남은 할 일 {todos.length - completed}개</span></div><CalendarNav date={selectedDate} label={label} onChange={setSelectedDate} onPrevious={() => moveWeek(-1)} onNext={() => moveWeek(1)} onToday={() => setSelectedDate(today)} todayLabel="이번 주" /></header><form className="planner-add-bar" onSubmit={addTodo}><select value={day} onChange={(event) => setDay(Number(event.target.value))}>{days.map((item, index) => <option value={index} key={item}>{item}요일</option>)}</select><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="이번 주에 할 일을 추가하세요" /><button type="submit">+ 할 일 추가</button></form>{todos.length === 0 ? <TodoPagePlaceholder onAction={() => document.querySelector<HTMLInputElement>('.planner-add-bar input')?.focus()} /> : <div className="week-grid">{days.map((item, index) => <section className={`week-day-card ${index === 0 ? 'is-sunday' : ''}`} key={item}><header><span>{item}</span><strong>{weekDates[index].getDate()}</strong></header><div>{todos.filter((todo) => todo.todoDate === toDateKey(weekDates[index])).map((todo) => <article className={`week-todo ${todo.completed ? 'is-complete' : ''}`} key={todo.id}><button className="daily-check" type="button" onClick={() => void completeTodo(todo)}>{todo.completed && '✓'}</button><strong>{todo.title}</strong><div className="todo-item-actions"><button type="button" onClick={() => editTodo(todo)}>수정</button><button className="todo-delete" type="button" onClick={() => removeTodo(todo.id)}>삭제</button></div></article>)}</div><button className="week-add-day" type="button" onClick={() => { setDay(index); document.querySelector<HTMLInputElement>('.planner-add-bar input')?.focus(); }}>+ 추가</button></section>)}</div>}</section>;
}
