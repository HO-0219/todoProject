import { useMemo, useState } from "react";
import { CalendarNav } from "../../features/todo/components/CalendarNav";
import { CalendarExportButton } from "../../features/todo/components/CalendarExportButton";
import { PlannerMemo } from "../../features/todo/components/PlannerMemo";
import { PlannerAdBanner } from "../../features/todo/components/PlannerAdBanner";
import { MonthlyCalendar } from "../../features/todo/components/MonthlyCalendar";
import { TodoCreateModal } from "../../features/todo/components/TodoCreateModal";
import { useTodos } from "../../features/todo/hooks/useTodos";
import {
  createDate,
  getCalendarDates,
  getMonthRange,
} from "../../features/todo/utils/dateUtils";

export function MonthlyPage() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() =>
    createDate(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const calendarDates = useMemo(() => getCalendarDates(viewDate), [viewDate]);
  const range = getMonthRange(viewDate);
  const todoState = useTodos({ ...range, rangeLabel: "월간" });

  function selectDate(date: Date) {
    setSelectedDate(date);
    if (date.getMonth() !== viewDate.getMonth()) {
      setViewDate(createDate(date.getFullYear(), date.getMonth(), 1));
    }
  }

  function moveMonth(amount: number) {
    const nextDate = createDate(
      viewDate.getFullYear(),
      viewDate.getMonth() + amount,
      1,
    );
    setViewDate(nextDate);
    setSelectedDate(nextDate);
  }

  function goToToday() {
    setViewDate(createDate(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  }

  async function createTodo(title: string, date: Date) {
    if (!(await todoState.createTodo(title, date))) return;
    selectDate(date);
    setShowCreateModal(false);
  }

  return (
    <section className="planner-page monthly-planner">
      <div className="planner-top-row">
        <PlannerAdBanner />
        <div className="planner-top-controls">
          <CalendarNav
            date={selectedDate}
            label={`${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`}
            onChange={selectDate}
            onPrevious={() => moveMonth(-1)}
            onNext={() => moveMonth(1)}
            onToday={goToToday}
            todayLabel="이번 달"
          />
        </div>
      </div>

      <div className="planner-content-grid">
        <section className="planner-task-card">
        <div className="planner-card-heading">
          <div>
            <p>MY MONTH</p>
            <h2>
              이번 달 일정 <span>{todoState.todos.length}</span>
            </h2>
          </div>
        </div>

        <div className="todo-primary-actions">
          <button
            className="todo-add-trigger"
            type="button"
            onClick={() => setShowCreateModal(true)}
          >
            + 일정 추가
          </button>
          <CalendarExportButton />
        </div>

        <MonthlyCalendar
          dates={calendarDates}
          todos={todoState.todos}
          today={today}
          viewDate={viewDate}
          selectedDate={selectedDate}
          onSelectDate={selectDate}
          onToggle={todoState.toggleTodo}
          onEdit={todoState.editTodo}
          onDelete={todoState.removeTodo}
        />
        </section>
        <PlannerMemo
          storageKey={`month:${range.from}`}
          label="이번 달 메모"
        />
      </div>

      <TodoCreateModal
        open={showCreateModal}
        initialDate={selectedDate}
        pending={todoState.creating}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createTodo}
      />
    </section>
  );
}
