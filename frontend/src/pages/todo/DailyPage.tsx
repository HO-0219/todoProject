import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarNav } from "../../features/todo/components/CalendarNav";
import { DailyTodoList } from "../../features/todo/components/DailyTodoList";
import { PlannerMemo } from "../../features/todo/components/PlannerMemo";
import { PlannerAdBanner } from "../../features/todo/components/PlannerAdBanner";
import { TodoCreateModal } from "../../features/todo/components/TodoCreateModal";
import { useTodos } from "../../features/todo/hooks/useTodos";
import { addDays, toDateKey } from "../../features/todo/utils/dateUtils";

export function DailyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const requestedDate = searchParams.get("date");
  const initialDate =
    requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
      ? new Date(`${requestedDate}T00:00:00`)
      : today;
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const selectedDateKey = toDateKey(selectedDate);
  const todoState = useTodos({
    from: selectedDateKey,
    to: selectedDateKey,
    rangeLabel: "일간",
  });
  function changeDate(date: Date) {
    setSelectedDate(date);
    setSearchParams({ date: toDateKey(date) });
  }

  async function createTodo(title: string, date: Date) {
    const created = await todoState.createTodo(title, date);
    if (!created) return;
    setShowCreateModal(false);
    if (toDateKey(date) !== selectedDateKey) changeDate(date);
  }

  return (
    <section className="daily-dashboard">
      <div className="planner-top-row">
        <PlannerAdBanner />
        <div className="planner-top-controls">
          <CalendarNav
            date={selectedDate}
            label={`${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`}
            onChange={changeDate}
            onPrevious={() => changeDate(addDays(selectedDate, -1))}
            onNext={() => changeDate(addDays(selectedDate, 1))}
            onToday={() => changeDate(today)}
            todayLabel="오늘"
          />
        </div>
      </div>

      <div className="daily-grid">
        <DailyTodoList
          todos={todoState.todos}
          onCreate={() => setShowCreateModal(true)}
          onToggle={todoState.toggleTodo}
          onEdit={todoState.editTodo}
          onDelete={todoState.removeTodo}
        />
        <PlannerMemo
          storageKey={`day:${selectedDateKey}`}
          label="오늘의 메모"
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
