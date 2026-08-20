import { useMemo, useState } from "react";
import { CalendarNav } from "../../features/todo/components/CalendarNav";
import { CalendarExportButton } from "../../features/todo/components/CalendarExportButton";
import { PlannerMemo } from "../../features/todo/components/PlannerMemo";
import { PlannerAdBanner } from "../../features/todo/components/PlannerAdBanner";
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
      <div className="planner-top-row">
        <PlannerAdBanner />
        <div className="planner-top-controls">
          <CalendarNav
            date={selectedDate}
            label={label}
            onChange={setSelectedDate}
            onPrevious={() => setSelectedDate(addDays(selectedDate, -7))}
            onNext={() => setSelectedDate(addDays(selectedDate, 7))}
            onToday={() => setSelectedDate(today)}
            todayLabel="이번 주"
          />
        </div>
      </div>

      <div className="planner-content-grid">
        <section className="planner-task-card">
        <div className="planner-card-heading">
          <div>
            <p>MY WEEK</p>
            <h2>
              이번 주 일정 <span>{todoState.todos.length}</span>
            </h2>
          </div>
        </div>

        <div className="todo-primary-actions">
          <button
            className="todo-add-trigger"
            type="button"
            onClick={() => openCreateModal()}
          >
            + 일정 추가
          </button>
          <CalendarExportButton />
        </div>

        <WeeklyGrid
          dates={weekDates}
          todos={todoState.todos}
          onCreate={openCreateModal}
          onToggle={todoState.toggleTodo}
          onEdit={todoState.editTodo}
          onDelete={todoState.removeTodo}
        />
        </section>
        <PlannerMemo
          storageKey={`week:${toDateKey(weekDates[0])}`}
          label="이번 주 메모"
        />
      </div>

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
