import { request } from '../../../api';
import type { Todo, TodoCreateRequest, TodoUpdateRequest } from '../types';

export type TodoApi = {
  findByDateRange(from: string, to: string): Promise<Todo[]>;
  findById(todoId: number): Promise<Todo>;
  create(request: TodoCreateRequest): Promise<Todo>;
  update(todoId: number, request: TodoUpdateRequest): Promise<Todo>;
  complete(todoId: number): Promise<Todo>;
  remove(todoId: number): Promise<void>;
};

export const todoApi: TodoApi = {
  findByDateRange(from, to) { return request<Todo[]>(`/todos?${new URLSearchParams({ from, to })}`, {}, true); },
  findById(todoId) { return request<Todo>(`/todos/${todoId}`, {}, true); },
  create(body) { return request<Todo>('/todos', { method: 'POST', body: JSON.stringify(body) }, true); },
  update(todoId, body) { return request<Todo>(`/todos/${todoId}`, { method: 'PUT', body: JSON.stringify(body) }, true); },
  complete(todoId) { return request<Todo>(`/todos/${todoId}/complete`, { method: 'PATCH' }, true); },
  remove(todoId) { return request<void>(`/todos/${todoId}`, { method: 'DELETE' }, true); },
};
