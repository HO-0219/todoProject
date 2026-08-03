import { request } from '../../../api';
import type { Todo, TodoCreateRequest, TodoUpdateRequest } from '../types';

export type TodoApi = {
  findByDateRange(userId: number, from: string, to: string): Promise<Todo[]>;
  findById(todoId: number, userId: number): Promise<Todo>;
  create(request: TodoCreateRequest): Promise<Todo>;
  update(todoId: number, userId: number, request: TodoUpdateRequest): Promise<Todo>;
  complete(todoId: number, userId: number): Promise<Todo>;
  remove(todoId: number, userId: number): Promise<void>;
};

function userQuery(userId: number) {
  return new URLSearchParams({ userId: String(userId) });
}

export const todoApi: TodoApi = {
  findByDateRange(userId, from, to) {
    const params = new URLSearchParams({ userId: String(userId), from, to });
    return request<Todo[]>(`/api/todos?${params.toString()}`, {}, true);
  },

  findById(todoId, userId) {
    return request<Todo>(`/api/todos/${todoId}?${userQuery(userId).toString()}`, {}, true);
  },

  create(createRequest) {
    return request<Todo>('/api/todos', {
      method: 'POST',
      body: JSON.stringify(createRequest),
    }, true);
  },

  update(todoId, userId, updateRequest) {
    return request<Todo>(`/api/todos/${todoId}?${userQuery(userId).toString()}`, {
      method: 'PUT',
      body: JSON.stringify(updateRequest),
    }, true);
  },

  complete(todoId, userId) {
    return request<Todo>(`/api/todos/${todoId}/complete?${userQuery(userId).toString()}`, {
      method: 'PATCH',
    }, true);
  },

  remove(todoId, userId) {
    return request<void>(`/api/todos/${todoId}?${userQuery(userId).toString()}`, {
      method: 'DELETE',
    }, true);
  },
};
