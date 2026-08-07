package com.teamproject.auth.todo.application;

import com.teamproject.auth.todo.domain.Todo;
import com.teamproject.auth.todo.domain.repository.TodoRepository;
import com.teamproject.auth.user.User;
import com.teamproject.auth.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

// Todo의 생성·조회·수정·완료·삭제 작업을 처리하는 서비스
@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // 필요한 Repository를 외부에서 전달받음
    public TodoService(
            TodoRepository todoRepository,
            UserRepository userRepository
    ) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    // 새로운 Todo를 생성하고 DB에 저장
    @Transactional
    public Todo createTodo(
            Long userId,
            String title,
            String description,
            LocalDate todoDate
    ) {
        // 제목과 날짜 입력값 확인
        validateTodoInput(title, todoDate);

        // 오늘 또는 내일 날짜인지 확인
        validateAllowedDate(todoDate);

        // Todo를 소유할 사용자가 존재하는지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "사용자를 찾을 수 없습니다."
                ));

        // 전달받은 정보로 새로운 Todo 객체 생성
        Todo todo = new Todo(
                user,
                title,
                description,
                todoDate
        );

        return todoRepository.save(todo);
    }

    // 사용자 소유의 Todo 한 건을 조회
    @Transactional(readOnly = true)
    public Todo getTodo(Long todoId, Long userId) {
        return findOwnedTodo(todoId, userId);
    }

    // 사용자의 Todo를 날짜 범위로 조회
    @Transactional(readOnly = true)
    public List<Todo> getTodoByDateRange(
            Long userId,
            LocalDate from,
            LocalDate to
    ) {
        // 날짜 범위 입력값 확인
        validateDateRange(from, to);

        return todoRepository.findByUser_IdAndTodoDateBetweenOrderByCompletedAscCreatedAtAsc(
                userId,
                from,
                to
        );
    }

    // 사용자 소유의 Todo 내용을 수정
    @Transactional
    public Todo updateTodo(
            Long todoId,
            Long userId,
            String title,
            String description,
            LocalDate todoDate
    ) {
        // 수정할 제목과 날짜 입력값 확인
        validateTodoInput(title, todoDate);

        // Todo ID와 사용자 ID를 함께 확인
        Todo todo = findOwnedTodo(todoId, userId);

        // 기존 Todo가 과거 날짜라면 제목·내용·날짜 모두 수정 불가
        validateEditableTodo(todo);

        // 변경할 날짜는 오늘 또는 내일만 허용
        validateAllowedDate(todoDate);
        
        // 조회한 Todo 객체의 내용을 변경
        todo.update(title, description, todoDate);

        
        // 트랜잭션 종료 시 변경 내용이 DB에 자동 반영됨
        return todo;
    }

    // 사용자 소유의 Todo를 완료 상태로 변경
    @Transactional
    public Todo completeTodo(Long todoId, Long userId) {
        // Todo ID와 사용자 ID를 함께 확인
        Todo todo = findOwnedTodo(todoId, userId);

         // 지난 날짜의 Todo는 완료 상태 변경 금지
        validateEditableTodo(todo);

        todo.complete();

        return todo;
    }

    // 사용자 소유의 Todo를 삭제
    @Transactional
    public void deleteTodo(Long todoId, Long userId) {
        // Todo ID와 사용자 ID를 함께 확인
        Todo todo = findOwnedTodo(todoId, userId);

        // 지난 날짜의 Todo는 삭제 금지
        validateEditableTodo(todo);

        todoRepository.delete(todo);
    }

    // 로그인 사용자가 소유한 Todo인지 확인하면서 조회
    private Todo findOwnedTodo(Long todoId, Long userId) {
        return todoRepository.findByIdAndUser_Id(todoId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Todo를 찾을 수 없습니다."
                ));
    }

    // 할 일을 등록하거나 이동할 수 있는 날짜인지 확인
    private void validateAllowedDate(LocalDate todoDate) {
       LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));
       LocalDate tomorrow = today.plusDays(1);

       if (todoDate.isBefore(today) || todoDate.isAfter(tomorrow)) {
           throw new ResponseStatusException(
                   HttpStatus.BAD_REQUEST,
                   "할 일은 오늘 또는 내일 날짜로만 등록할 수 있습니다."
          );
    }
   }

   // 기존 Todo가 변경 가능한 날짜인지 확인
    private void validateEditableTodo(Todo todo) {
           LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));

        if (todo.getTodoDate().isBefore(today)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "지난 날짜의 할 일은 조회만 가능합니다."
            );
       }
}

    // Todo 제목과 날짜 입력값 확인
    private void validateTodoInput(
            String title,
            LocalDate todoDate
    ) {
        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "제목은 공백일 수 없습니다."
            );
        }

        if (title.length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "제목은 100자 이내로 입력해야 합니다."
            );
        }

        if (todoDate == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Todo 날짜를 입력해야 합니다."
            );
        }
    }

    


    // 조회 시작일과 종료일 확인
    private void validateDateRange(LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "조회 시작일과 종료일을 입력해야 합니다."
            );
        }

        if (from.isAfter(to)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "조회 시작일은 종료일보다 늦을 수 없습니다."
            );
        }
    }
}