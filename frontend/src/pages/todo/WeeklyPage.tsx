import { useMemo, useState } from "react";
import { CalendarNav } from "../../features/todo/components/CalendarNav";
import { TodoCreateModal } from "../../features/todo/components/TodoCreateModal";
import { WeeklyGrid } from "../../features/todo/components/WeeklyGrid";
import { useTodos } from "../../features/todo/hooks/useTodos";
import {
  addDays,
  getWeekDates,
  toDateKey,
} from "../../features/todo/utils/dateUtils";

export function WeeklyPage() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDay());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const todoState = useTodos({
    from: toDateKey(weekDates[0]),
    to: toDateKey(weekDates[6]),
    rangeLabel: "주간",
  });
  const completed = todoState.todos.filter((todo) => todo.completed).length;

  function openCreateModal(dayIndex = selectedDay) {
    setSelectedDay(dayIndex);
    setShowCreateModal(true);
  }

  async function createTodo(title: string, date: Date) {
    if (!(await todoState.createTodo(title, date))) return;
    setSelectedDate(date);
    setSelectedDay(date.getDay());
    setShowCreateModal(false);
  }

  const label = `${weekDates[0].getMonth() + 1}월 ${weekDates[0].getDate()}일 - ${weekDates[6].getMonth() + 1}월 ${weekDates[6].getDate()}일`;

  return (
    <section className="planner-page weekly-planner">
      <header className="planner-intro">
        <div>
          <p>WEEKLY PLANNER</p>
          <h1>
            이번 주의 흐름을
            <br />
            <strong>한눈에 정리하세요.</strong>
          </h1>
          <span>
            완료 {completed}개 · 남은 일정 {todoState.todos.length - completed}
            개
          </span>
        </div>
        <CalendarNav
          date={selectedDate}
          label={label}
          onChange={setSelectedDate}
          onPrevious={() => setSelectedDate(addDays(selectedDate, -7))}
          onNext={() => setSelectedDate(addDays(selectedDate, 7))}
          onToday={() => setSelectedDate(today)}
          todayLabel="이번 주"
        />
      </header>

      <button
        className="todo-add-trigger"
        type="button"
        onClick={() => openCreateModal()}
      >
        + 일정 추가
      </button>

      <WeeklyGrid
        dates={weekDates}
        todos={todoState.todos}
        onCreate={openCreateModal}
        onToggle={todoState.toggleTodo}
        onEdit={todoState.editTodo}
        onDelete={todoState.removeTodo}
      />

      <TodoCreateModal
        open={showCreateModal}
        initialDate={weekDates[selectedDay]}
        pending={todoState.creating}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createTodo}
      />
    </section>
  );
}
