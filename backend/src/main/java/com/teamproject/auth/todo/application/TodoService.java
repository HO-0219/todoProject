package com.teamproject.auth.todo.application;

import com.teamproject.auth.todo.domain.Todo;
import com.teamproject.auth.todo.domain.repository.TodoRepository;
import com.teamproject.auth.user.User;
import com.teamproject.auth.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

// Todo의 생성·조회·수정·완료·삭제 작업을 처리하는 서비스
@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // 필요한 Repository를 외부에서 전달받음
    public  TodoService(
            TodoRepository todoRepository,
            UserRepository userRepository
         ){
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
    ){
        // 제목과 날짜 입력값 확인
        validateTodoInput(title, todoDate);

        // Todo를 소유할 사용자가 존재하는지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException(
                        "사용자를 찾을 수 없습니다."
                ));

        // 전달받은 정보로 새로운 Todo 객체 생성
        Todo todo = new Todo(
                user,title,description,todoDate
        );

        return todoRepository.save(todo);
    }
    // 사용자 소유의 Todo 한 건을 조회
    @Transactional(readOnly = true)
    public Todo getTodo (Long todoId,Long userId){

        return todoRepository.findByIdAndUser_Id(todoId,userId)
                .orElseThrow(()->new IllegalArgumentException(
                        "Todo를 찾을 수 없습니다."
                ));
    }
    // 사용자의 Todo를 날짜 범위로 조회
    @Transactional(readOnly = true)
    public List<Todo> getTodoByDateRange(
            Long userId,
            LocalDate from,
            LocalDate to
    ){
        return todoRepository.findByUser_IdAndTodoDateBetween(
                userId,from,to
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

        // 해당 사용자의 Todo인지 확인하면서 조회
        Todo todo = todoRepository.findByIdAndUser_Id(todoId,userId)
                .orElseThrow(()->new IllegalArgumentException(
                        " Todo를 찾을 수 없습니다."
          ));

        // 조회한 Todo 객체의 내용을 변경
        todo.update(title, description, todoDate);

        // 트랜잭션 종료 시 변경 내용이 DB에 자동 반영됨
        return todo;
    }
    // 사용자 소유의 Todo를 완료 상태로 변경
    @Transactional
    public Todo completeTodo(Long todoId, Long userId){

        // 해당 사용자의 Todo인지 확인하면서 조회
        Todo todo = todoRepository.findByIdAndUser_Id(todoId,userId)
                .orElseThrow(()->new IllegalArgumentException(
                        "Todo를 찾을 수 없습니다."));

        todo.complete();

        return todo;
   }
   @Transactional
   public void deleteTodo(Long todoId, Long userId){
        Todo todo = todoRepository.findByIdAndUser_Id(todoId,userId)
                .orElseThrow(()->new IllegalArgumentException(
                        "Todo를 찾을 수 없습니다."));

        todoRepository.delete(todo);

   }

    private void validateTodoInput(
         String title, LocalDate todoDate
    ){
        if (title == null || title.isBlank()){
            throw new IllegalArgumentException("제목은 공백일 수 없습니다.");
        }
        if (title.length()>100 ){
            throw new IllegalArgumentException("제목은 100자 이내로 입력해야 합니다.");
        }
        if (todoDate == null){
            throw new IllegalArgumentException("Todo 날짜를 입력해야 합니다.");
        }

     }

}