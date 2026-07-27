/**
 * TODO API 작업을 시작할 때 백엔드 응답 형식과 함께 확정합니다.
 * 월간·주간·일간 화면은 모두 같은 Todo 타입을 사용합니다.
 */
export type Todo = {
  id: number;
  title: string;
  description?: string;
  todoDate: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type TodoCreateRequest = Pick<Todo, 'title' | 'description' | 'todoDate'>;
export type TodoUpdateRequest = Partial<TodoCreateRequest>;
