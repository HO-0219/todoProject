package com.teamproject.auth.todo.presentation.dto;


import com.teamproject.auth.todo.domain.Todo;


import java.time.LocalDate;
import java.time.LocalDateTime;

public class TodoResponse {

    private final Long id;
    private final Long userId;
    private final String title;
    private final String description;
    private final LocalDate todoDate;
    private final boolean completed;
    private final LocalDateTime completedAt;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public TodoResponse(
            Long id, Long userId,
            String title, String description,
            LocalDate todoDate, boolean completed,
            LocalDateTime completedAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt

    ){
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.todoDate = todoDate;
        this.completed = completed;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
      }

    // Todo Entity를 응답용 DTO로 변환
    public static TodoResponse from(Todo todo){
        return new TodoResponse(
                todo.getId(), todo.getUser().getId(),
                todo.getTitle(),todo.getDescription(),
                todo.getTodoDate(),todo.isCompleted(),
                todo.getCompletedAt(),todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
     }

    public Long getId() {
        return id;
    }
    public Long getUserId() {
        return userId;
    }
    public String getTitle() {
        return title;
    }
    public String getDescription() {
        return description;
    }
    public LocalDate getTodoDate() {
        return todoDate;
    }
    public boolean isCompleted() {
        return completed;
    }
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}



