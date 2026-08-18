import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarNav } from "../../features/todo/components/CalendarNav";
import { DailySummary } from "../../features/todo/components/DailySummary";
import { DailyTodoList } from "../../features/todo/components/DailyTodoList";
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
  const completed = todoState.todos.filter((todo) => todo.completed).length;

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

  const weekday = selectedDate
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  return (
    <section className="daily-dashboard">
      <header className="daily-intro">
        <div>
          <p className="daily-kicker">{weekday}</p>
          <h1>
            좋은 아침이에요.
            <br />
            <strong>오늘도 차분하게 시작해 볼까요?</strong>
          </h1>
          <p className="daily-subtitle">
            작은 완료 하나가 오늘의 흐름을 만듭니다.
          </p>
        </div>
        <CalendarNav
          date={selectedDate}
          label={`${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`}
          onChange={changeDate}
          onPrevious={() => changeDate(addDays(selectedDate, -1))}
          onNext={() => changeDate(addDays(selectedDate, 1))}
          onToday={() => changeDate(today)}
          todayLabel="오늘"
        />
      </header>

      <div className="daily-grid">
        <DailyTodoList
          todos={todoState.todos}
          onCreate={() => setShowCreateModal(true)}
          onToggle={todoState.toggleTodo}
          onEdit={todoState.editTodo}
          onDelete={todoState.removeTodo}
        />
        <DailySummary completed={completed} total={todoState.todos.length} />
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
