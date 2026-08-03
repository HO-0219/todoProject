package com.teamproject.auth.todo.domain.repository;

import com.teamproject.auth.todo.domain.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo,Long> {

    // 특정 사용자의 Todo를 날짜 범위로 여러 개 조회
    List<Todo> findByUser_IdAndTodoDateBetween(
            Long userId,
            LocalDate from,
            LocalDate to
          );
    // Todo ID와 소유자 ID가 모두 일치하는 Todo 한 개 조회
    Optional<Todo> findByIdAndUser_Id(Long todoId, Long userId);

}
