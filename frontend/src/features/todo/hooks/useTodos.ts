import { useCallback, useEffect, useState } from "react";
import { todoApi } from "../api/todoApi";
import type { Todo } from "../types";
import { isPastDateKey, toDateKey } from "../utils/dateUtils";

type UseTodosOptions = {
  from: string;
  to: string;
  rangeLabel: string;
};

export function useTodos({ from, to, rangeLabel }: UseTodosOptions) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setTodos(await todoApi.findByDateRange(from, to));
    } catch (error) {
      console.error(`${rangeLabel} 일정 조회 실패:`, error);
      window.alert(`${rangeLabel} 일정을 불러오지 못했습니다.`);
    } finally {
      setLoading(false);
    }
  }, [from, rangeLabel, to]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createTodo = useCallback(
    async (title: string, date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      if (selectedDate < today) {
        window.alert("지난 날짜에는 일정을 추가할 수 없습니다.");
        return false;
      }
      setCreating(true);
      try {
        await todoApi.create({
          title,
          description: null,
          todoDate: toDateKey(date),
        });
        await reload();
        return true;
      } catch (error) {
        console.error("일정 추가 실패:", error);
        window.alert("일정을 추가하지 못했습니다.");
        return false;
      } finally {
        setCreating(false);
      }
    },
    [reload],
  );

  const toggleTodo = useCallback(
    async (todo: Todo) => {
      if (isPastDateKey(todo.todoDate)) {
        window.alert("지난 일정의 완료 상태는 변경할 수 없습니다.");
        return;
      }
      try {
        const updatedTodo = await todoApi.toggleCompletion(todo.id);
        setTodos((currentTodos) =>
          currentTodos.map((currentTodo) =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      } catch (error) {
        console.error("일정 완료 처리 실패:", error);
        window.alert("완료 상태를 변경하지 못했습니다.");
      }
    },
    [],
  );

  const editTodo = useCallback(
    async (todo: Todo) => {
      if (isPastDateKey(todo.todoDate)) {
        window.alert("지난 일정은 수정할 수 없습니다.");
        return;
      }
      const title = window
        .prompt("일정 내용을 수정하세요.", todo.title)
        ?.trim();
      if (!title) return;
      try {
        await todoApi.update(todo.id, {
          title,
          description: todo.description,
          todoDate: todo.todoDate,
        });
        await reload();
      } catch (error) {
        console.error("일정 수정 실패:", error);
        window.alert("일정을 수정하지 못했습니다.");
      }
    },
    [reload],
  );

  const removeTodo = useCallback(
    async (todoId: number) => {
      const todo = todos.find((item) => item.id === todoId);
      if (todo && isPastDateKey(todo.todoDate)) {
        window.alert("지난 일정은 삭제할 수 없습니다.");
        return;
      }
      if (!window.confirm("이 일정을 삭제할까요?")) return;
      try {
        await todoApi.remove(todoId);
        await reload();
      } catch (error) {
        console.error("일정 삭제 실패:", error);
        window.alert("일정을 삭제하지 못했습니다.");
      }
    },
    [reload, todos],
  );

  return {
    todos,
    loading,
    creating,
    reload,
    createTodo,
    toggleTodo,
    editTodo,
    removeTodo,
  };
}
