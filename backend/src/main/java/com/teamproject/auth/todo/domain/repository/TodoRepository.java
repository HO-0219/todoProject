package com.teamproject.auth.todo.domain.repository;

import com.teamproject.auth.todo.domain.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo,Long> {

   // 미완료 Todo를 먼저 조회하고, 같은 상태에서는 생성 순서로 정렬
List<Todo> findByUser_IdAndTodoDateBetweenOrderByCompletedAscCreatedAtAsc(
        Long userId,
        LocalDate from,
        LocalDate to
);
    //사용자의 전체 Todo를 날짜순으로 조회 
    List<Todo> findByUser_IdOrderByTodoDateAscCreatedAtAsc(Long userId);

    // Todo ID와 소유자 ID가 모두 일치하는 Todo 한 개 조회
    Optional<Todo> findByIdAndUser_Id(Long todoId, Long userId);

    // 회원 탈퇴 시 해당 사용자의 Todo 전체 삭제
    void deleteByUser_Id(Long userId);

}
