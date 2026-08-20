import { request, requestBlob } from "../../../api";
import type { Todo, TodoCreateRequest, TodoUpdateRequest } from "../types";

export type TodoApi = {
  findByDateRange(from: string, to: string): Promise<Todo[]>;
  findById(todoId: number): Promise<Todo>;
  create(request: TodoCreateRequest): Promise<Todo>;
  update(todoId: number, request: TodoUpdateRequest): Promise<Todo>;
  toggleCompletion(todoId: number): Promise<Todo>;
  exportCalendar(): Promise<Blob>;
  remove(todoId: number): Promise<void>;
};

export const todoApi: TodoApi = {
  findByDateRange(from, to) {
    const params = new URLSearchParams({ from, to });
    return request<Todo[]>(`/todos?${params.toString()}`, {}, true);
  },

  findById(todoId) {
    return request<Todo>(`/todos/${todoId}`, {}, true);
  },

  create(createRequest) {
    return request<Todo>(
      "/todos",
      {
        method: "POST",
        body: JSON.stringify(createRequest),
      },
      true,
    );
  },

  update(todoId, updateRequest) {
    return request<Todo>(
      `/todos/${todoId}`,
      {
        method: "PUT",
        body: JSON.stringify(updateRequest),
      },
      true,
    );
  },

  toggleCompletion(todoId) {
    return request<Todo>(
      `/todos/${todoId}/complete`,
      {
        method: "PATCH",
      },
      true,
    );
  },

  exportCalendar() {
    return requestBlob("/todos/export");
  },

  remove(todoId) {
    return request<void>(
      `/todos/${todoId}`,
      {
        method: "DELETE",
      },
      true,
    );
  },
};
