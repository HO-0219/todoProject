import type { Todo, TodoCreateRequest, TodoUpdateRequest } from '../types';

/*
 * TODO API 전용 파일입니다.
 * 인증 API와 동일한 공통 request 함수를 재사용할 수 있도록
 * frontend/src/api.ts의 request 공개 여부를 먼저 팀에서 결정해 주세요.
 */
export type TodoApi = {
  findByDateRange(from: string, to: string): Promise<Todo[]>;
  findById(todoId: number): Promise<Todo>;
  create(request: TodoCreateRequest): Promise<Todo>;
  update(todoId: number, request: TodoUpdateRequest): Promise<Todo>;
  changeCompleted(todoId: number, completed: boolean): Promise<Todo>;
  remove(todoId: number): Promise<void>;
};
