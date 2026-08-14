import type { Todo } from "../../todo/types";
import { addDays, startOfWeek, toDateKey } from "../../todo/utils/dateUtils";

export type TodoSummary = {
  total: number;
  completed: number;
  remaining: number;
  rate: number;
};

export const summarizeTodos = (todos: Todo[]): TodoSummary => {
  const completed = todos.filter((todo) => todo.completed).length;
  return {
    total: todos.length,
    completed,
    remaining: todos.length - completed,
    rate: todos.length === 0 ? 0 : Math.round((completed / todos.length) * 100),
  };
};

export const todosBetween = (todos: Todo[], from: Date, to: Date) => {
  const fromKey = toDateKey(from);
  const toKey = toDateKey(to);
  return todos.filter(
    (todo) => todo.todoDate >= fromKey && todo.todoDate <= toKey,
  );
};

export const createWeeklyStats = (todos: Todo[], today: Date) => {
  const firstDay = startOfWeek(today);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(firstDay, index);
    const dayTodos = todos.filter((todo) => todo.todoDate === toDateKey(date));
    return { date, ...summarizeTodos(dayTodos) };
  });
};

export const createMonthlyRows = (todos: Todo[], today: Date) => {
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const rows = [];
  let cursor = startOfWeek(monthStart);
  let week = 1;
  while (cursor <= monthEnd) {
    const end = addDays(cursor, 6);
    const from = cursor < monthStart ? monthStart : cursor;
    const to = end > monthEnd ? monthEnd : end;
    rows.push({
      week,
      from,
      to,
      ...summarizeTodos(todosBetween(todos, from, to)),
    });
    cursor = addDays(cursor, 7);
    week += 1;
  }
  return rows;
};
