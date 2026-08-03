package com.teamproject.auth.todo.presentation;


import com.teamproject.auth.todo.application.TodoService;
import com.teamproject.auth.todo.domain.Todo;
import com.teamproject.auth.todo.presentation.dto.TodoCreateRequest;
import com.teamproject.auth.todo.presentation.dto.TodoResponse;
import com.teamproject.auth.todo.presentation.dto.TodoUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService){
        this.todoService = todoService;
    }

    // Todo 등록 요청을 받는 API
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TodoResponse createTodo(
            @RequestBody TodoCreateRequest request
            ){
        // 요청 DTO의 값을 서비스에 전달하여 Todo를 생성
        Todo todo = todoService.createTodo(
                request.getUserId(), request.getTitle(),
                request.getDescription(), request.getTodoDate()
        );
        // 생성된 Entity를 응답 DTO로 변환
        return TodoResponse.from(todo);
    }
    // Todo 한 건을 조회하는 API
    @GetMapping("/{todoId}")
    public TodoResponse getTodo(
            @PathVariable Long todoId,
            @RequestParam Long userId
    ){
        Todo todo = todoService.getTodo(todoId, userId);

        return TodoResponse.from(todo);
    }

    // 날짜 범위에 해당하는 Todo 목록을 조회하는 API
    @GetMapping
    public List<TodoResponse> getTodoByDateRange(
            @RequestParam Long userId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to
        ){
        return todoService.getTodoByDateRange(userId, from, to)
                .stream().map(TodoResponse::from).toList();

    }
    // 기존 Todo의 제목, 설명, 날짜를 수정하는 API
    @PutMapping("/{todoId}")
    public TodoResponse updateTodo(
            @PathVariable Long todoId,
            @RequestParam Long userId,
            @RequestBody TodoUpdateRequest request
            ){
        Todo updatedTodo = todoService.updateTodo(
                todoId,userId, request.getTitle(),
                request.getDescription(),
                request.getTodoDate()
        );
        return TodoResponse.from(updatedTodo);
    }
    // Todo를 완료 상태로 변경하는 API
    @PatchMapping("/{todoId}/complete")
    public TodoResponse completeTodo(
            @PathVariable Long todoId,
            @RequestParam Long userId
    ) {
        Todo completedTodo = todoService.completeTodo(todoId, userId);

        return TodoResponse.from(completedTodo);
    }

    // Todo를 삭제하는 API
    @DeleteMapping("/{todoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTodo(
            @PathVariable Long todoId,
            @RequestParam Long userId
    ) {
        todoService.deleteTodo(todoId, userId);
    }

}
